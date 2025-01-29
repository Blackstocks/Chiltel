// Install service worker
const installEvent = () => {
    if (typeof window !== "undefined") {
      window.addEventListener("install", () => {
        // console.log('service worker installed');
      });
    }
  };
  installEvent();
  
  // Activate service worker
  const activateEvent = () => {
    if (typeof window !== "undefined") {
      window.addEventListener("activate", () => {
        // console.log('service worker activated');
      });
    }
  };
  activateEvent();