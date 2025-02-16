// Track energy usage
let energyUsage = 0;

// Simulate energy savings based on user actions
function calculateEnergySavings() {
  const darkModeEnabled = document.body.classList.contains('dark-mode');
  const fpsLimited = window.requestAnimationFrame.name === 'optimizedRequestAnimationFrame';

  if (darkModeEnabled) energyUsage -= 0.01;
  if (fpsLimited) energyUsage -= 0.02;

  chrome.runtime.sendMessage({
    action: 'updateEnergyUsage',
    usage: energyUsage.toFixed(2)
  });
}

// Send energy usage updates every 5 seconds
setInterval(calculateEnergySavings, 5000);

// Listen for energy usage requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getEnergyUsage') {
    sendResponse({ savings: Math.abs(energyUsage) });
  }
});