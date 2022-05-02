importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-messaging.js');

firebase.initializeApp({
	apiKey: "AIzaSyAQNkAFawVYUae8R1wXbJZfOaSbdtU3lbo",
    authDomain: "mrex-app.firebaseapp.com",
    projectId: "mrex-app",
    storageBucket: "mrex-app.appspot.com",
    messagingSenderId: "824013910552",
    appId: "1:824013910552:web:cf60c7a0406d997137096d",
    measurementId: "G-WFN7M64DDT"
});
const messaging = firebase.messaging();

const channel = new MessageChannel()

let lastNotification

console.log('Firebase-messaging-sw.js')

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    lastNotification = payload

    /*
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);*/
});

let getVersionPort;
self.addEventListener("message", event => {
    if (event.data && event.data.type === 'INIT_PORT') {
        getVersionPort = event.ports[0];
        console.log('Service worker initializaed')

        if (lastNotification) {
            console.log('Post last notification to clients')
            getVersionPort.postMessage(lastNotification);
            lastNotification = null;
        }
    }

})