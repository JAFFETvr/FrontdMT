import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDccQnf18c7oc5KW3qsTYPRgm7sjZHcNGg",
    authDomain: "proyecto-multidiciplinario.firebaseapp.com",
    projectId: "proyecto-multidiciplinario",
    storageBucket: "proyecto-multidiciplinario.firebasestorage.app",
    messagingSenderId: "590720522711",
    appId: "1:590720522711:web:3d7a50ba108e16160e9392",
    measurementId: "G-KMNV84CZ3X"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, onMessage };