const i18n = {
    init: () => {
      chrome.storage.local.get(['language'], result => {
        this.setLanguage(result.language || navigator.language.split('-')[0]);
      });
    },
  
    setLanguage: (lang) => {
      chrome.storage.local.set({language: lang});
      fetch(`_locales/${lang}/messages.json`)
        .then(response => response.json())
        .then(messages => {
          document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = messages[key]?.message || key;
          });
        });
    }
  };