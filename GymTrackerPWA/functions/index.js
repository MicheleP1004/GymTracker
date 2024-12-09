const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require('firebase-admin');

admin.initializeApp();

//funzione che si attiva quando un nuovo documento viene creato nella raccolta 'notifications'
exports.sendPushNotification = onDocumentCreated("notifications/{notificationId}", async (event) => {
    const notificationData = event.data.data();  
    const title = notificationData.title;
    const body = notificationData.body;
    const icon = notificationData.icon;
    const token = notificationData.token;  

    const message = {
        notification: {
            title: title,
            body: body,
        },
        data: {
            icon: icon 
        },
        token: token,
    };

    try {
        //invia la notifica push
        const response = await admin.messaging().send(message);
        console.log('Notifica inviata con successo:', response);
    } catch (error) {
        console.error("Errore durante l'invio della notifica:", error);
    }
});


