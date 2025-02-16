// Internationalization
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
  document.getElementById('language-select').addEventListener('change', (e) => {
    i18n.setLanguage(e.target.value);
  });
});

// Settings Manager
const Settings = {
  save: (key, value) => chrome.storage.local.set({[key]: value}),
  load: async (key) => {
    return new Promise(resolve => {
      chrome.storage.local.get([key], result => resolve(result[key]));
    });
  }
};

// FPS Limiter System
const initializeFPSSettings = async () => {
  const fpsEnabled = await Settings.load('fpsEnabled');
  const fpsLimit = await Settings.load('fpsLimit') || '30';
  
  document.getElementById('fps-limiter-toggle').checked = fpsEnabled;
  document.getElementById('fps-limit').value = fpsLimit;

  document.getElementById('fps-limiter-toggle').addEventListener('change', async (e) => {
    await Settings.save('fpsEnabled', e.target.checked);
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateFPS',
        enabled: e.target.checked,
        limit: document.getElementById('fps-limit').value
      });
    });
  });

  document.getElementById('fps-limit').addEventListener('change', async (e) => {
    if(document.getElementById('fps-limiter-toggle').checked) {
      await Settings.save('fpsLimit', e.target.value);
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateFPS',
          enabled: true,
          limit: e.target.value
        });
      });
    }
  });
};

// Enhanced Dark Mode with Persistence
const initializeDarkMode = async () => {
  const darkModeEnabled = await Settings.load('darkModeEnabled');
  document.getElementById('dark-mode-toggle').checked = darkModeEnabled;
  
  document.getElementById('dark-mode-toggle').addEventListener('change', async (e) => {
    await Settings.save('darkModeEnabled', e.target.checked);
    document.body.classList.toggle('dark-theme', e.target.checked);
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleDarkMode',
        enabled: e.target.checked
      });
    });
  });
};

// Energy Monitoring System
const initializeEnergyMonitor = () => {
  chrome.runtime.sendMessage({action: 'getEnergyUsage'}, response => {
    document.getElementById('energy-saving-amount').textContent = 
      `${response.savings.toFixed(1)} kWh`;
  });
};

// Initialize all components
document.addEventListener('DOMContentLoaded', async () => {
  await initializeFPSSettings();
  await initializeDarkMode();
  initializeEnergyMonitor();
  
  // Load additional settings
  document.getElementById('hardware-acceleration-toggle').checked = 
    await Settings.load('hardwareAcceleration');
  document.getElementById('energy-alerts-toggle').checked = 
    await Settings.load('energyAlerts');
});