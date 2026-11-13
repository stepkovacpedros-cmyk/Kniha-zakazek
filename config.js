// Konfigurace Firebase pro Štěpkovač (projekt stepkovac-ba81f).
// Hodnoty jsou z Firebase konzole: Nastavení projektu → Obecné → Vaše aplikace.
// Používá se self.*, aby soubor šel načíst i do service workeru (kvůli upozorněním).
self.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAt5eFLX4415Vj5lypO_Mi2PRBUhwdy55s",
  authDomain: "stepkovac-ba81f.firebaseapp.com",
  projectId: "stepkovac-ba81f",
  storageBucket: "stepkovac-ba81f.firebasestorage.app",
  messagingSenderId: "662316932357",
  appId: "1:662316932357:web:608566744c7f36ca956b6c"
};

// Klíč pro upozornění (Web Push): Firebase konzole → Nastavení projektu → Cloud Messaging
// → Web Push certificates → Generate key pair → zkopírujte „Key pair“ sem mezi uvozovky.
self.FIREBASE_VAPID_KEY = "";
