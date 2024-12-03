// Importa i moduli Firebase necessari
importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging-compat.js');

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAHu55oxRvlmFuuRkVfcM4JeF8TvIqlhg0",
    authDomain: "gymtrackerpwa.firebaseapp.com",
    projectId: "gymtrackerpwa",
    storageBucket: "gymtrackerpwa.appspot.com",
    messagingSenderId: "1046461599327",
    appId: "1:1046461599327:web:a5e22aa12f42ae252515ea"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Ottieni il servizio di messaggistica
const messaging = firebase.messaging();

// Gestisci i messaggi in background
messaging.onBackgroundMessage((payload) => {
    console.log("Notifica ricevuta in background:", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };

    // Mostra la notifica
    self.registration.showNotification(notificationTitle, notificationOptions);
});

