const firebaseConfig = {
    apiKey: "AIzaSyBqjZXmIxpOZYAuNoxw7oQPFymEyJQd6Ms",
    authDomain: "budget-planner-app-1c877.firebaseapp.com",
    databaseURL: "https://budget-planner-app-1c877-default-rtdb.firebaseio.com",  // No trailing slash!
    projectId: "budget-planner-app-1c877",
    storageBucket: "budget-planner-app-1c877.appspot.com",
    messagingSenderId: "228727497801",
    appId: "1:228727497801:web:5f29574215856d7b044b98",
    measurementId: "G-56FH9HK17J"
};

// Initialize Firebase App
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database
const database = firebase.database(app);  // Explicitly pass app instance

console.log("Firebase App Initialized:", app);
console.log("Database URL (after fix):", app.options.databaseURL);

// Make database globally available
window.database = database;
