// /* eslint @typescript-eslint/no-require-imports: "off" */

// const functions = require('firebase-functions');
// const admin = require('firebase-admin');

// // Inizializzazione dell'app Firebase Admin
// admin.initializeApp();

// // Funzione che si attiva quando un nuovo documento viene creato nella raccolta 'notifications'
// exports.sendPushNotification = functions.firestore
//     .document('notifications/{notificationId}')
//     .onCreate(async (snap) => {
//         const notificationData = snap.data();
//         const title = notificationData.title;
//         const body = notificationData.body;
//         const icon = notificationData.icon;
//         const token = notificationData.token;  // Il token FCM dell'utente

//         // Prepara la payload della notifica
//         const message = {
//             notification: {
//                 title: title,
//                 body: body,
//                 icon: icon
//             },
//             token: token,  // Invia la notifica al token specifico
//         };

//         try {
//             // Invia la notifica push
//             const response = await admin.messaging().send(message);
//             console.log('Notifica inviata con successo:', response);
//         } catch (error) {
//             console.error("Errore durante l'invio della notifica:", error);
//         }
//     });

// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

// // Inizializzazione dell'app Firebase Admin
// admin.initializeApp();

// // Funzione che si attiva quando un nuovo documento viene creato nella raccolta 'notifications'
// export const sendPushNotification = functions.firestore
//     .document('notifications/{notificationId}')
//     .onCreate(async (snap) => {
//         const notificationData = snap.data();
//         const title = notificationData.title;
//         const body = notificationData.body;
//         const icon = notificationData.icon;
//         const token = notificationData.token;  // Il token FCM dell'utente

//         // Prepara la payload della notifica
//         const message = {
//             notification: {
//                 title: title,
//                 body: body,
//                 icon: icon
//             },
//             token: token,  // Invia la notifica al token specifico
//         };

//         try {
//             // Invia la notifica push
//             const response = await admin.messaging().send(message);
//             console.log('Notifica inviata con successo:', response);
//         } catch (error) {
//             console.error("Errore durante l'invio della notifica:", error);
//         }
//     });

/* eslint @typescript-eslint/no-require-imports: "off" */
// Importazioni aggiornate con require
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require('firebase-admin');

// Inizializzazione dell'app Firebase Admin
admin.initializeApp();

// Funzione che si attiva quando un nuovo documento viene creato nella raccolta 'notifications'
exports.sendPushNotification = onDocumentCreated("notifications/{notificationId}", async (event) => {
    const notificationData = event.data.data();  // Uso dell'oggetto event per ottenere i dati
    const title = notificationData.title;
    const body = notificationData.body;
    const icon = notificationData.icon;
    const token = notificationData.token;  // Il token FCM dell'utente

    // Prepara la payload della notifica
    const message = {
        notification: {
            title: title,
            body: body,
            icon: icon
        },
        token: token,  // Invia la notifica al token specifico
    };

    try {
        // Invia la notifica push
        const response = await admin.messaging().send(message);
        console.log('Notifica inviata con successo:', response);
    } catch (error) {
        console.error("Errore durante l'invio della notifica:", error);
    }
});


