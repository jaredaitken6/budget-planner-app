const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "budget-planner-app-1c877.firebaseapp.com",
    databaseURL: "https://budget-planner-app-1c877-default-rtdb.firebaseio.com",
    projectId: "budget-planner-app-1c877",
    storageBucket: "budget-planner-app-1c877.appspot.com",
    messagingSenderId: "228727497801",
    appId: "1:228727497801:web:5f29574215856d7b044b98",
    measurementId: "G-56FH9HK17J"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Make database globally accessible
window.database = database;
console.log("Firebase initialized successfully.");
