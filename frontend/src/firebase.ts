import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const firebaseApp = initializeApp({
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  appId: "YOUR_APP_ID",
});
export const storage = getStorage(firebaseApp);
