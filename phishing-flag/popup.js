chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  const tabId = tabs[0]?.id;
  
  chrome.runtime.sendMessage({action: 'getData', tabId: tabId}, data => {
    const content = document.getElementById('content');
    
    if (!data) {
      content.innerHTML = '<div class="no-data">No data available for this site</div>';
      return;
    }
    
    const riskColors = {high: '#d32f2f', medium: '#f57c00', low: '#388e3c'};
    const riskLabels = {high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk'};
    
    content.innerHTML = `
      <div class="risk-badge" style="background: ${riskColors[data.level]}">
        ${riskLabels[data.level]}
      </div>
      <div class="score">Risk Score: ${data.score}/100</div>
      
      ${data.flags.length ? `
        <div class="section">
          <h3>Detected Issues</h3>
          <ul class="flags">
            ${data.flags.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      ` : '<div class="section"><p>No issues detected</p></div>'}
      
      ${Object.keys(data.metadata).length ? `
        <div class="section">
          <h3>Metadata</h3>
          <div class="metadata">
            ${Object.entries(data.metadata).map(([k,v]) => `
              <div class="meta-item">
                <span class="meta-key">${k}:</span>
                <span class="meta-value">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  });
});