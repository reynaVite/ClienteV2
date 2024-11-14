// src/configF.js
import { initializeApp, getApps, getApp } from "firebase/app"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC07UJAW4ghnZJlvxoc3P_0sWFDNEQN1fI",
  authDomain: "pdf-eduzona.firebaseapp.com",
  projectId: "pdf-eduzona",
  storageBucket: "pdf-eduzona.appspot.com",
  messagingSenderId: "805160700521",
  appId: "1:805160700521:web:db29476a854b2c777cb0f8"
};

 
 
// Inicializa Firebase solo si no está inicializado
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Obtiene la aplicación existente
}
const storage = getStorage(app);
export { storage };

