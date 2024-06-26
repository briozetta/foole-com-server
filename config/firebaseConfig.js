// firebaseConfig.js
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
const { getAuth } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyAcnnPxoGbPVxXLXGLHnc1qjjsw2dO43kQ",
  authDomain: "andrue-com.firebaseapp.com",
  projectId: "andrue-com",
  storageBucket: "andrue-com.appspot.com",
  messagingSenderId: "695431297125",
  appId: "1:695431297125:web:80fbc4ec32029c953aee8c",
  measurementId: "G-HJ09LBVR0B"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

module.exports = { storage , auth };


