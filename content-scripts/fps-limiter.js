let animationFrameId;
let lastFrameTime = 0;

const optimizeAnimations = (fpsLimit) => {
  const minFrameTime = 1000 / fpsLimit;
  
  window.requestAnimationFrame = (callback) => {
    const now = performance.now();
    const delta = now - lastFrameTime;
    
    if (delta >= minFrameTime) {
      lastFrameTime = now - (delta % minFrameTime);
      return originalRequestAnimationFrame(callback);
    }
    
    return animationFrameId;
  };
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateFPS') {
    if (request.enabled) {
      const originalRequestAnimationFrame = window.requestAnimationFrame;
      optimizeAnimations(Number(request.limit));
    } else {
      window.requestAnimationFrame = originalRequestAnimationFrame;
    }
  }
});