// Main JavaScript functionality for GDG AITR website

// Form submission handler
document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!validateForm(data)) {
        return;
    }
    
    // Save to Firebase
    saveRegistration(data);
});

// Save registration to Firebase
function saveRegistration(data) {
    import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js').then(({ initializeApp }) => {
        import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js').then(({ getDatabase, ref, push }) => {
            const firebaseConfig = {
                apiKey: "AIzaSyAHg2XvF93Eno_ntRUExiW1V4lvQXxHSS8",
                authDomain: "gdg-aitr.firebaseapp.com",
                databaseURL: "https://gdg-aitr-default-rtdb.asia-southeast1.firebasedatabase.app",
                projectId: "gdg-aitr",
                storageBucket: "gdg-aitr.firebasestorage.app",
                messagingSenderId: "325045815983",
                appId: "1:325045815983:web:6617fcc9a21952f77d225a"
            };
            
            const app = initializeApp(firebaseConfig);
            const database = getDatabase(app);
            
            const registrationData = {
                ...data,
                timestamp: new Date().toISOString()
            };
            
            push(ref(database, 'registrations'), registrationData)
                .then(() => {
                    window.location.href = 'success.html';
                })
                .catch((error) => {
                    showMessage('Registration failed: ' + error.message, 'error');
                });
        });
    });
}

// Load event details from Firebase
function loadEventDetails() {
    import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js').then(({ initializeApp }) => {
        import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js').then(({ getDatabase, ref, onValue }) => {
            const firebaseConfig = {
                apiKey: "AIzaSyAHg2XvF93Eno_ntRUExiW1V4lvQXxHSS8",
                authDomain: "gdg-aitr.firebaseapp.com",
                databaseURL: "https://gdg-aitr-default-rtdb.asia-southeast1.firebasedatabase.app",
                projectId: "gdg-aitr",
                storageBucket: "gdg-aitr.firebasestorage.app",
                messagingSenderId: "325045815983",
                appId: "1:325045815983:web:6617fcc9a21952f77d225a"
            };
            
            const app = initializeApp(firebaseConfig);
            const database = getDatabase(app);
            const eventRef = ref(database, 'eventDetails');
            
            onValue(eventRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    if (data.title) document.getElementById('eventTitle').textContent = data.title;
                    if (data.date) {
                        const date = new Date(data.date);
                        document.getElementById('eventDate').textContent = date.toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                        });
                    }
                    if (data.time) {
                        const [hours, minutes] = data.time.split(':');
                        const time = new Date();
                        time.setHours(hours, minutes);
                        document.getElementById('eventTime').textContent = time.toLocaleTimeString('en-US', { 
                            hour: 'numeric', minute: '2-digit', hour12: true 
                        });
                    }
                    if (data.location) document.getElementById('eventLocation').textContent = data.location;
                    if (data.description) document.getElementById('eventDescription').textContent = data.description;
                }
            });
        });
    });
}

// Form validation
function validateForm(data) {
    if (!data.name || data.name.length < 2) {
        showMessage('Please enter a valid name', 'error');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!data.phone || data.phone.length < 10) {
        showMessage('Please enter a valid phone number', 'error');
        return false;
    }
    
    return true;
}

// Load event details when page loads
document.addEventListener('DOMContentLoaded', loadEventDetails);

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show success/error messages
function showMessage(message, type) {
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message fade-in' : 'error-message fade-in';
    messageDiv.textContent = message;
    
    const form = document.getElementById('eventForm');
    form.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

