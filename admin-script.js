import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// REPLACE WITH YOUR ACTUAL FIREBASE CONFIG (same as script.js)
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

let registrationsData = [];
let isLoggedIn = false;

async function login() {
    const uid = document.getElementById('adminUID').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    if (!uid || !password) {
        alert('Please enter both UID and password!');
        return;
    }
    
    try {
        // Check admin credentials from Firebase
        const adminRef = ref(database, `admins/${uid}`);
        onValue(adminRef, (snapshot) => {
            const adminData = snapshot.val();
            
            if (adminData && adminData.password === password && adminData.active === true) {
                isLoggedIn = true;
                document.getElementById('loginSection').classList.add('hidden');
                document.getElementById('adminPanel').classList.remove('hidden');
                document.getElementById('logoutBtn').classList.remove('hidden');
                loadEventDetails();
                loadRegistrations();
            } else {
                alert('Invalid credentials or inactive admin!');
            }
        }, { onlyOnce: true });
    } catch (error) {
        alert('Login error: ' + error.message);
    }
}

function logout() {
    isLoggedIn = false;
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
    document.getElementById('adminUID').value = '';
    document.getElementById('adminPassword').value = '';
}

async function updateEvent() {
    const eventData = {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        updatedAt: new Date().toISOString()
    };

    try {
        await set(ref(database, 'eventDetails'), eventData);
        alert('Event details updated successfully!');
    } catch (error) {
        alert('Error updating event: ' + error.message);
    }
}

function loadEventDetails() {
    const eventRef = ref(database, 'eventDetails');
    onValue(eventRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('eventTitle').value = data.title || '';
            document.getElementById('eventDate').value = data.date || '';
            document.getElementById('eventTime').value = data.time || '';
            document.getElementById('eventLocation').value = data.location || '';
            document.getElementById('eventDescription').value = data.description || '';
        }
    });
}

function loadRegistrations() {
    const registrationsRef = ref(database, 'registrations');
    onValue(registrationsRef, (snapshot) => {
        const data = snapshot.val();
        registrationsData = data ? Object.values(data) : [];
        displayRegistrations();
        updateStats();
    });
}

function displayRegistrations() {
    const container = document.getElementById('registrationsList');
    
    if (registrationsData.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center;">No registrations yet.</p>';
        return;
    }

    let html = `
        <div class="registration-item registration-header">
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Year</div>
            <div>Branch</div>
        </div>
    `;

    registrationsData.forEach(reg => {
        html += `
            <div class="registration-item">
                <div>${reg.name}</div>
                <div>${reg.email}</div>
                <div>${reg.phone}</div>
                <div>${reg.year}</div>
                <div>${reg.branch}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function updateStats() {
    const total = registrationsData.length;
    const today = new Date().toDateString();
    const todayCount = registrationsData.filter(reg => 
        new Date(reg.timestamp).toDateString() === today
    ).length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('todayCount').textContent = todayCount;
}

function downloadExcel() {
    if (registrationsData.length === 0) {
        alert('No registrations to download!');
        return;
    }

    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Year', 'Branch', 'Registration Date'];
    const csvContent = [
        headers.join(','),
        ...registrationsData.map(reg => [
            `"${reg.name}"`,
            `"${reg.email}"`,
            `"${reg.phone}"`,
            `"${reg.year}"`,
            `"${reg.branch}"`,
            `"${new Date(reg.timestamp).toLocaleString()}"`
        ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GDG_AITR_Registrations_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function refreshData() {
    loadRegistrations();
    alert('Data refreshed!');
}

async function clearDatabase() {
    if (!confirm('⚠️ WARNING: This will permanently delete ALL student registrations. Are you sure?')) {
        return;
    }
    
    if (!confirm('This action cannot be undone. Type "DELETE" to confirm:') || 
        prompt('Type DELETE to confirm:') !== 'DELETE') {
        return;
    }
    
    try {
        await set(ref(database, 'registrations'), null);
        alert('✅ All registrations cleared successfully!');
        loadRegistrations();
    } catch (error) {
        alert('❌ Error clearing database: ' + error.message);
    }
}

// Make functions global
window.login = login;
window.logout = logout;
window.updateEvent = updateEvent;
window.downloadExcel = downloadExcel;
window.refreshData = refreshData;
window.clearDatabase = clearDatabase;