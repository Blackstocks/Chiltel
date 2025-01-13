export default function RegisterServiceWorker() {
    let serviceWorker = window?.navigator?.serviceWorker;
      if (serviceWorker) {
        serviceWorker.register("/service-worker.js", { scope: "/" }).then((registration) => {
          // console.log("Service Worker registration successful with scope: ", registration.scope);
        }).catch((err) => {
          // console.log("Service Worker registration failed: ", err);
        });
      }
  
  }