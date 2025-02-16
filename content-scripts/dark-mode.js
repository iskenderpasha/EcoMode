// Apply dark mode to the page
function applyDarkMode(isEnabled) {
  if (isEnabled) {
    document.body.style.backgroundColor = "#1e1e1e";
    document.body.style.color = "#ffffff";
    document.body.classList.add('dark-mode');
  } else {
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    document.body.classList.remove('dark-mode');
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleDarkMode') {
    applyDarkMode(message.enabled);
  }
});

// Apply saved dark mode state on page load
chrome.storage.local.get(['darkModeEnabled'], (data) => {
  applyDarkMode(data.darkModeEnabled || false);
});