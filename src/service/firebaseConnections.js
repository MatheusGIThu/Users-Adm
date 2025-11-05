// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

// IMPORTANTE: Adicionar autenticação
import { getAuth, signInAnonymously } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyApHH3f5j-SYx8Ia0wmucg3AOoT-ZHx3nc",
    authDomain: "crudcad.firebaseapp.com",
    projectId: "crudcad",
    storageBucket: "crudcad.firebasestorage.app",
    messagingSenderId: "39632038279",
    appId: "1:39632038279:web:9f95d89a78145811570b22",
    measurementId: "G-RZJLY9R628"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Inicializa autenticação

 //CORREÇÃO: CHAMADA DA FUNÇÃO DE AUTENTICAÇÃO AGORA ESTÁ PRESENTE
// ************************************************************
signInAnonymously(auth).then(() => {
    console.log("SUCESSO: Usuário logado anonimamente. O Firestore deve funcionar.");
}).catch((error) => {
    // Isso deve alertar se o Firebase Auth não estiver habilitado para seu projeto.
    console.error("ERRO CRÍTICO: Não foi possível logar anonimamente. Verifique se o Firebase Auth (Login Anônimo) está habilitado.", error);
});


const produtosCollection = collection(db, "produtos");

export{
    db,
    produtosCollection,
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    deleteDoc,
    serverTimestamp
};

