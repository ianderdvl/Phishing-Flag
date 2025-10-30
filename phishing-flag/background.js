let siteData = {}; //stores analysis results per tab
let analyzingTabs = {}; //track tabs currently being analyzed

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === 'loading') {
    analyzingTabs[tabId] = true; //mark as analyzing
  }
  if (info.status === 'complete' && tab.url) {
    analyzeSite(tab.url, tabId);
  }
});

chrome.tabs.onActivated.addListener(({tabId}) => {
  chrome.tabs.get(tabId, tab => {
    if (tab.url && siteData[tabId]) updateBadge(tabId);
  });
});

chrome.tabs.onRemoved.addListener(tabId => {
  delete siteData[tabId]; //cleanup closed tabs
  delete analyzingTabs[tabId];
});

async function analyzeSite(url, tabId) {
  try {
    const u = new URL(url);
    if (!['http:', 'https:'].includes(u.protocol)) return;

    const risk = {score: 0, flags: [], metadata: {}, url: url}; //store URL with data
    
    //HTTPS check
    if (u.protocol === 'http:') {
      risk.score += 30;
      risk.flags.push('No HTTPS');
    }

    //domain analysis
    const domain = u.hostname;
    risk.metadata.domain = domain;
    
    //suspicious TLD
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work'];
    if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
      risk.score += 20;
      risk.flags.push('Suspicious TLD');
    }

    //homograph/typosquatting patterns
    if (domain.includes('paypa1') || domain.includes('g00gle') || /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüý]/i.test(domain)) {
      risk.score += 40;
      risk.flags.push('Possible typosquatting');
    }

    //excessive subdomains
    const parts = domain.split('.');
    if (parts.length > 4) {
      risk.score += 15;
      risk.flags.push('Excessive subdomains');
    }

    //IP address as domain
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
      risk.score += 35;
      risk.flags.push('IP address used as domain');
    }

    //suspicious keywords
    const keywords = ['login', 'verify', 'account', 'secure', 'update', 'confirm', 'banking', 'wallet'];
    const pathAndQuery = u.pathname + u.search;
    if (keywords.some(k => pathAndQuery.toLowerCase().includes(k))) {
      risk.score += 10;
      risk.flags.push('Suspicious keywords in URL');
    }

    //check PhishTank
    await checkPhishTank(url, risk);

    //check certificate info (via external API)
    if (u.protocol === 'https:') {
      await checkSSL(domain, risk);
    }

    //determine risk level
    risk.level = risk.score >= 50 ? 'high' : risk.score >= 30 ? 'medium' : 'low';
    
    siteData[tabId] = risk; //store data permanently until tab closed/reloaded
    analyzingTabs[tabId] = false; //analysis complete
    updateBadge(tabId);
    
    //inject warning if high risk
    if (risk.level === 'high') {
      chrome.tabs.sendMessage(tabId, {action: 'showWarning', data: risk}).catch(() => {}); //ignore if content script not ready
    }
  } catch (e) {
    console.error('Analysis error:', e);
    analyzingTabs[tabId] = false;
  }
}

async function checkPhishTank(url, risk) {
  try {
    const encoded = encodeURIComponent(url);
    const res = await fetch(`https://checkurl.phishtank.com/checkurl/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `url=${encoded}&format=json`
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.results?.in_database && data.results?.valid) {
        risk.score += 100;
        risk.flags.push('PhishTank confirmed phishing');
        risk.metadata.phishtank = 'Confirmed';
      }
    }
  } catch (e) {
    //API might be rate limited, continue without
  }
}

async function checkSSL(domain, risk) {
  try {
    const res = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${domain}&fromCache=on&maxAge=24`);
    if (res.ok) {
      const data = await res.json();
      risk.metadata.ssl_grade = data.endpoints?.[0]?.grade || 'Unknown';
      if (data.endpoints?.[0]?.grade && ['F', 'T', 'M'].includes(data.endpoints[0].grade)) {
        risk.score += 25;
        risk.flags.push('Poor SSL rating');
      }
    }
  } catch (e) {
    //continue without SSL Labs data
  }
}

function updateBadge(tabId) {
  const data = siteData[tabId];
  if (!data) return;
  
  const colors = {high: '#d32f2f', medium: '#f57c00', low: '#388e3c'};
  const texts = {high: '⚠', medium: '!', low: '✓'};
  
  chrome.action.setBadgeText({text: texts[data.level], tabId});
  chrome.action.setBadgeBackgroundColor({color: colors[data.level], tabId});
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.action === 'getData') {
    const tabId = msg.tabId || sender.tab?.id; //use provided tabId or sender's tab
    reply(siteData[tabId] || null);
    return true;
  }
});