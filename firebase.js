import firebase from 'firebase';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAC0X29TiPdMPIpvZ_Ehq7J4euQbjB6fZA",
  authDomain: "facebookclone-63a32.firebaseapp.com",
  projectId: "facebookclone-63a32",
  storageBucket: "facebookclone-63a32.appspot.com",
  messagingSenderId: "463504707817",
  appId: "1:463504707817:web:0054e6eb36ba7d55cea078"
};
const app=!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db= app.firestore();
const storage=firebase.storage();

export { db , storage };