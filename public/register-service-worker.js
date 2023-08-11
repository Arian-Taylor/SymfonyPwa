window.addEventListener('load', () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = navigator.serviceWorker.register("/service-worker.js", {});
            if (registration.installing) {
                console.log(`[sw] : installing`);
            } else if (registration.waiting) {
                console.log(`[sw] : waiting`);
            } else if (registration.active) {
                console.log(`[sw] : active`);
            }
        } catch (error) {
            console.error(`[sw] : Registration failed with ${error}`);
        }
    }
})