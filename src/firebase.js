import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCYjkG6qNr67yItaUh-c_jULnzIuWj74JE",
    authDomain: "landlord-minder.firebaseapp.com",
    projectId: "landlord-minder",
    storageBucket: "landlord-minder.firebasestorage.app",
    messagingSenderId: "188119528802",
    appId: "1:188119528802:web:2e77d8cc06e44e6fb7e83b",
    measurementId: "G-6X8NDRTCYP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
