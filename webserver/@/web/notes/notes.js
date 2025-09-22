const API_BASE_URL = 'https://iekava.lv'; // Replace with your API URL

/**
 * Make authenticated API calls (cookies sent automatically)
 */
async function makeAuthenticatedRequest(url, options = {}) {
    const defaultOptions = {
        credentials: 'include', // REQUIRED to send cookies
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        }
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (response.status === 401) {
            // Token expired or invalid, redirect to login
            window.location.href = '/';
            return;
        }
        
        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * Load user information and update the title
 */
async function loadUserInfo() {
    try {
        // Get user info from the /api/auth/me endpoint
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/auth/me`);
        
        if (response && response.ok) {
            const userInfo = await response.json();
            
            // Update the user info display
            const usernameDisplay = document.getElementById('usernameDisplay');
            const userIdDisplay = document.getElementById('userIdDisplay');
            
            if (userInfo && userInfo.username && userInfo.id) {
                usernameDisplay.textContent = userInfo.username;
                userIdDisplay.textContent = userInfo.id;
            } else if (userInfo && userInfo.username) {
                usernameDisplay.textContent = userInfo.username;
                userIdDisplay.textContent = '';
            }
            
            return userInfo;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error loading user info:', error);
        return null;
    }
}

/**
 * Load user's notes from the API
 */
async function loadNotes() {
    const notesTextarea = document.getElementById('notesText');
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/message`);
        
        if (response && response.ok) {
            const data = await response.json();
            notesTextarea.value = data.message || '';
        } else {
            showError('Failed to load notes');
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        showError('Error loading notes: ' + error.message);
    } finally {}
}

/**
 * Save notes to the API
 */
async function saveNotes() {
    const notesTextarea = document.getElementById('notesText');
    const saveBtn = document.getElementById('saveBtn');
    const text = notesTextarea.value;
    
    try {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/message/${encodeURIComponent(text)}`, {
            method: 'POST'
        });
        
        if (response && response.ok) {
            showSuccess('Notes saved successfully!');
        } else {
            showError('Failed to save notes');
        }
    } catch (error) {
        console.error('Error saving notes:', error);
        showError('Error saving notes: ' + error.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Notes';
    }
}

/**
 * Logout function
 */
async function logout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    try {
        logoutBtn.disabled = true;
        logoutBtn.textContent = 'Logging out...';
        
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        // Redirect to login page
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
        // Still redirect even if logout request fails
        window.location.href = '/';
    }
}

/**
 * Check if user is authenticated
 */
async function checkAuth() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/message`);
        if (!response || !response.ok) {
            window.location.href = '/';
            return false;
        }
        return true;
    } catch (error) {
        window.location.href = '/';
        return false;
    }
}

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');

    successDiv.style.display = 'none';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

/**
 * Display success message to user
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');

    errorDiv.style.display = 'none';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

/**
 * Clear all messages
 */
function clearMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// Auto-save functionality
let autoSaveTimeout;
function setupAutoSave() {
    const notesTextarea = document.getElementById('notesText');
    
    notesTextarea.addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        clearMessages();
        
        // Auto-save after 2 seconds of no typing
        autoSaveTimeout = setTimeout(() => {
            saveNotes();
        }, 2000);
    });
}

// Event listeners
document.getElementById('saveBtn').addEventListener('click', () => {
    clearTimeout(autoSaveTimeout); // Cancel auto-save if manual save is triggered
    clearMessages();
    saveNotes();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout? Any unsaved changes will be lost.')) {
        logout();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Ctrl+S or Cmd+S to save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        clearTimeout(autoSaveTimeout);
        clearMessages();
        saveNotes();
    }
    
    // Ctrl+L or Cmd+L to logout
    if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        if (confirm('Are you sure you want to logout? Any unsaved changes will be lost.')) {
            logout();
        }
    }
});

// Page initialization
window.addEventListener('DOMContentLoaded', async () => {
    // Check authentication first
    const isAuthenticated = await checkAuth();
    
    if (isAuthenticated) {
        await loadUserInfo();

        // Load existing notes
        await loadNotes();
        
        // Setup auto-save
        setupAutoSave();
        
        // Focus on textarea
        document.getElementById('notesText').focus();
    }
});

// Handle page visibility change (save when user switches tabs/minimizes)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // User is leaving the page, save notes
        const notesTextarea = document.getElementById('notesText');
        if (notesTextarea.value.trim()) {
            saveNotes();
        }
    }
});

// Handle beforeunload (when user closes tab/refreshes)
window.addEventListener('beforeunload', (event) => {
    const notesTextarea = document.getElementById('notesText');
    if (notesTextarea.value.trim()) {
        // Note: Modern browsers limit what you can do here
        // but we'll attempt to save
        navigator.sendBeacon(`${API_BASE_URL}/api/message/${encodeURIComponent(notesTextarea.value)}`, 
            JSON.stringify({}));
    }
});