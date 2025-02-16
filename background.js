// Handle energy usage updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateEnergyUsage') {
    chrome.storage.local.set({ energyUsage: message.usage });
  }
});

// Handle FPS limit updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateFPS') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateFPS',
        enabled: message.enabled,
        limit: message.limit
      });
    });
  }
});