const API_BASE_URL = 'https://iekava.lv'; // Replace with your API URL

/**
 * Validates that a URL uses HTTPS protocol
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if HTTPS, false otherwise
 */
function isHttpsUrl(url) {
    try {
        return new URL(url).protocol === 'https:'; 
    } catch (error) {
        return false;
    }
}

/**
 * Secure login function that only accepts HTTPS endpoints
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @param {string} apiUrl - API endpoint URL
 * @returns {Promise} - Login response
 */
async function secureLogin(username, password, apiUrl) {
    // Validate inputs
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    // Ensure HTTPS-only communication
    if (!isHttpsUrl(apiUrl)) {
        throw new Error('Security Error: Only HTTPS connections are allowed. HTTP connections are forbidden for login operations.');
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'include', // REQUIRED to send/receive cookies
            mode: 'cors'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Login failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (networkError) {
        if (networkError.name === 'TypeError' && networkError.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to the server. Please check your connection and ensure the API is accessible via HTTPS.');
        }
        throw networkError;
    }
}

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
            window.location.href = '/login';
            return;
        }
        
        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * Logout function
 */
async function logout() {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        // Redirect to login page
        window.location.href = '/login';
    } catch (error) {
        console.error('Logout failed:', error);
        // Still redirect even if logout request fails
        window.location.href = '/login';
    }
}

/**
 * Check if user is authenticated
 */
async function checkAuth() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/me`);
        if (response && response.ok) {
            const user = await response.json();
            return user;
        }
        return null;
    } catch (error) {
        return null;
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
}

/**
 * Clear all messages
 */
function clearMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// Event listener for login button
document.getElementById('loginBtn').addEventListener('click', async function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');

    // Clear previous messages
    clearMessages();

    // Disable button during login attempt
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    try {
        // Construct the login endpoint URL
        const loginEndpoint = `${API_BASE_URL}/api/auth/login`;

        // Attempt secure login
        const result = await secureLogin(username, password, loginEndpoint);

        // Handle successful login
        showSuccess('Login successful!');
        console.log('Login successful:', result);

        // Here you would typically:
        // - Store the authentication token
        // - Redirect to the dashboard
        // - Update the UI state
        // localStorage.setItem('authToken', result.token); // Example
        // window.location.href = '/dashboard'; // Example

    } catch (error) {
        // Handle login errors
        showError(error.message);
        console.error('Login error:', error);
    } finally {
        // Re-enable button
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});

// Allow Enter key to trigger login
document.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        document.getElementById('loginBtn').click();
    }
});

// Additional security check: warn if page is loaded over HTTP
if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    console.warn('Security Warning: This login page should be served over HTTPS in production');
    showError('Security Warning: This page should be loaded over HTTPS for secure login');
}

// Test protected endpoint
async function testProtectedEndpoint() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/protected`);
        if (response && response.ok) {
            const data = await response.text();
            console.log('Protected data:', data);
        }
    } catch (error) {
        console.error('Protected endpoint failed:', error);
    }
}