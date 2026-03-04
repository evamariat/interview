import { getApps } from "firebase/app"
import { getAuth } from "firebase/auth/web-extension"
import { getFirestore } from "firebase/firestore"

const initFirebaseAdmin = () => {
    const apps = getApps()
    if (apps.length === 0) {
        const admin = require("firebase-admin")
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBAE_CLIENT_EMAIL,
            }),
        })
    }


    return {
        auth: getAuth(),
        db: getFirestore()
    }

}

export const { auth, db } = initFirebaseAdmin()