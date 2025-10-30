chrome.runtime.onMessage.addListener(msg => {
  if (msg.action === 'showWarning') {
    showWarningBanner(msg.data);
  }
});

function showWarningBanner(data) {
  if (document.getElementById('phishing-flag-warning')) return; //already shown
  
  const banner = document.createElement('div');
  banner.id = 'phishing-flag-warning';
  banner.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; z-index: 999999;
    background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
    color: white; padding: 20px; text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: slideDown 0.3s ease;
  `;
  
  banner.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">⚠️ Warning: Potential Phishing Site</div>
      <div style="font-size: 16px; margin-bottom: 15px;">
        This site has been flagged as potentially dangerous. Risk Score: ${data.score}/100
      </div>
      <div style="font-size: 14px; margin-bottom: 15px; opacity: 0.9;">
        Flags: ${data.flags.join(', ')}
      </div>
      <button id="phishing-flag-close" style="
        background: rgba(255,255,255,0.2); border: 2px solid white; color: white;
        padding: 10px 24px; font-size: 14px; font-weight: bold; cursor: pointer;
        border-radius: 4px; transition: all 0.2s;
      ">I Understand the Risk</button>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = '@keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }';
  document.head.appendChild(style);
  
  document.body.insertBefore(banner, document.body.firstChild);
  
  document.getElementById('phishing-flag-close').onclick = () => banner.remove();
}