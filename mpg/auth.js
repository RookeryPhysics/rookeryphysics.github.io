/**
 * Multiplayed Golf - Client-Side Authentication & Points Module
 * Handles SHA-256 password hashing with user salt, Google Apps Script integration,
 * local storage session caching, and event notification across pages.
 */

// Replace this with your Google Apps Script Web App Deployment URL
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyX1WcA1VxoGmMHt4pIk9HJtesC_Nzp5gTyuwfwKvjSucwzYqPer5ZNY82vS8ZbWuhCHQ/exec"; // Put your Apps Script URL here

const SESSION_STORAGE_KEY = 'mpg_user_session';
const OFFLINE_USERS_KEY = 'mpg_offline_users';

class MultiplayedAuth {
    constructor() {
        this.apiUrl = (typeof GOOGLE_APPS_SCRIPT_URL !== 'undefined' && !GOOGLE_APPS_SCRIPT_URL.includes('AKfycbz_1H7M3k2z9U2X7c2v0X4d5e6f7g8h9i0'))
            ? GOOGLE_APPS_SCRIPT_URL
            : null;
        this.currentUser = this.loadSession();

        // Listen for storage changes across tabs/windows
        window.addEventListener('storage', (event) => {
            if (event.key === SESSION_STORAGE_KEY) {
                this.currentUser = this.loadSession();
                this.notifyAuthChange();
            }
        });
    }

    /**
     * Set the Google Apps Script Web App URL dynamically
     */
    setApiUrl(url) {
        if (url && typeof url === 'string') {
            this.apiUrl = url.trim();
        }
    }

    /**
     * Compute SHA-256 hash using Web Cryptography API with a pure-JS fallback for non-secure contexts (HTTP)
     */
    async hashPassword(password, username) {
        const salt = 'mpg_golf_salt_' + username.trim().toLowerCase();
        const text = password + '::mpg_secure::' + salt;

        // In secure contexts (HTTPS / localhost), window.crypto.subtle is available
        if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Fallback SHA-256 for non-secure (HTTP) contexts where crypto.subtle is undefined
        return this.sha256Fallback(text);
    }

    /**
     * Pure JavaScript SHA-256 implementation for environments without window.crypto.subtle
     */
    sha256Fallback(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }

        const mathPow = Math.pow;
        const maxWord = mathPow(2, 32);
        let result = '';

        const words = [];
        const asciiBitLength = ascii.length * 8;

        let hash = [];
        const k = [];
        let primeCounter = 0;

        const isPrime = {};
        for (let candidate = 2; primeCounter < 64; candidate++) {
            if (!isPrime[candidate]) {
                for (let i = candidate * candidate; i < 312; i += candidate) {
                    isPrime[i] = true;
                }
                if (primeCounter < 8) {
                    hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
                }
                k[primeCounter] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
                primeCounter++;
            }
        }

        ascii += '\x80';
        while ((ascii.length % 64) - 56) ascii += '\x00';
        for (let i = 0; i < ascii.length; i++) {
            const j = ascii.charCodeAt(i);
            if (j >> 8) return; // Only ASCII supported
            words[i >> 2] |= j << (((3 - i) % 4) * 8);
        }
        words[words.length] = (asciiBitLength / maxWord) | 0;
        words[words.length] = asciiBitLength;

        for (let j = 0; j < words.length;) {
            const w = words.slice(j, j += 16);
            const oldHash = hash;
            hash = hash.slice(0, 8);

            for (let i = 0; i < 64; i++) {
                const w15 = w[i - 15], w2 = w[i - 2];
                const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
                const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
                const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
                const temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? (w[i] || 0) : ((w[i - 16] + s0 + w[i - 7] + s1) | 0))) | 0;
                const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
                const temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0;

                hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
            }

            for (let i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 3; j >= 0; j--) {
                const b = (hash[i] >> (8 * j)) & 255;
                result += ((b < 16) ? '0' : '') + b.toString(16);
            }
        }
        return result;
    }

    /**
     * Load session from localStorage
     */
    loadSession() {
        try {
            const raw = localStorage.getItem(SESSION_STORAGE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            return data;
        } catch (e) {
            console.error("Error reading session:", e);
            return null;
        }
    }

    /**
     * Save session to localStorage
     */
    saveSession(userData) {
        this.currentUser = userData;
        try {
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
        } catch (e) {
            console.error("Error saving session:", e);
        }
        this.notifyAuthChange();
    }

    /**
     * Notify listeners that auth state or points changed
     */
    notifyAuthChange() {
        window.dispatchEvent(new CustomEvent('mpg-auth-change', {
            detail: { user: this.currentUser }
        }));
    }

    /**
     * Check if a user is logged in
     */
    isLoggedIn() {
        return !!(this.currentUser && this.currentUser.username);
    }

    /**
     * Get current user object or null
     */
    getUser() {
        return this.currentUser;
    }

    /**
     * Logout
     */
    logout() {
        this.currentUser = null;
        try {
            localStorage.removeItem(SESSION_STORAGE_KEY);
        } catch (e) { }
        this.notifyAuthChange();
    }

    /**
     * Send API request to Google Apps Script
     */
    async sendApiRequest(action, payload) {
        if (!this.apiUrl) {
            // Local fallback simulation mode when Google Apps Script is not yet connected
            return this.simulateLocalAuth(action, payload);
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // Plain text avoids CORS preflight issues with Apps Script
                },
                body: JSON.stringify({
                    action: action,
                    ...payload
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.warn("Google Apps Script request failed, attempting fallback:", error);
            // If network or CORS blocked, fallback gracefully
            return this.simulateLocalAuth(action, payload);
        }
    }

    /**
     * Local storage simulated backend (fallback until user pastes their Google Apps Script URL)
     */
    simulateLocalAuth(action, payload) {
        return new Promise((resolve) => {
            setTimeout(async () => {
                let db = [];
                try {
                    db = JSON.parse(localStorage.getItem(OFFLINE_USERS_KEY) || '[]');
                } catch (e) {
                    db = [];
                }

                if (action === 'register') {
                    const existing = db.find(u => u.username.toLowerCase() === payload.username.toLowerCase() || u.email.toLowerCase() === payload.email.toLowerCase());
                    if (existing) {
                        return resolve({ success: false, error: 'Username or email already exists (Local Mode)' });
                    }

                    const newUser = {
                        id: 'usr_' + Math.random().toString(36).substring(2, 9),
                        username: payload.username,
                        email: payload.email,
                        password_hash: payload.password_hash,
                        salt: payload.salt,
                        points: 0,
                        created_at: new Date().toISOString()
                    };
                    db.push(newUser);
                    localStorage.setItem(OFFLINE_USERS_KEY, JSON.stringify(db));

                    return resolve({
                        success: true,
                        message: 'Account created! (Local Mode - Connect Google Apps Script to save in Google Sheets)',
                        user: {
                            id: newUser.id,
                            username: newUser.username,
                            email: newUser.email,
                            points: newUser.points,
                            created_at: newUser.created_at
                        }
                    });
                }

                if (action === 'login') {
                    const user = db.find(u => (u.username.toLowerCase() === payload.username.toLowerCase() || u.email.toLowerCase() === payload.username.toLowerCase()));
                    if (!user) {
                        return resolve({ success: false, error: 'Account not found. Please create an account.' });
                    }
                    if (user.password_hash !== payload.password_hash) {
                        return resolve({ success: false, error: 'Incorrect password' });
                    }

                    return resolve({
                        success: true,
                        message: 'Logged in successfully (Local Mode)',
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            points: user.points || 0,
                            created_at: user.created_at
                        }
                    });
                }

                if (action === 'update_points') {
                    const user = db.find(u => u.username.toLowerCase() === (payload.username || '').toLowerCase() || u.id === payload.id);
                    if (!user) {
                        return resolve({ success: false, error: 'User not found for point update' });
                    }
                    if (payload.points !== undefined) {
                        user.points = Math.max(0, Number(payload.points));
                    } else if (payload.delta !== undefined) {
                        user.points = Math.max(0, (user.points || 0) + Number(payload.delta));
                    }
                    localStorage.setItem(OFFLINE_USERS_KEY, JSON.stringify(db));

                    return resolve({
                        success: true,
                        message: 'Points updated',
                        user: {
                            id: user.id,
                            username: user.username,
                            points: user.points
                        }
                    });
                }

                if (action === 'get_user') {
                    const user = db.find(u => u.username.toLowerCase() === (payload.username || '').toLowerCase() || u.id === payload.id);
                    if (!user) {
                        return resolve({ success: false, error: 'User not found' });
                    }
                    return resolve({
                        success: true,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            points: user.points || 0
                        }
                    });
                }

                return resolve({ success: false, error: 'Unsupported action' });
            }, 300);
        });
    }

    /**
     * Register a new user
     */
    async register(username, email, password) {
        if (!username || username.trim().length < 2) {
            throw new Error("Username must be at least 2 characters");
        }
        if (!email || !email.includes('@')) {
            throw new Error("Please enter a valid email address");
        }
        if (!password || password.length < 4) {
            throw new Error("Password must be at least 4 characters");
        }

        const cleanUsername = username.trim();
        const cleanEmail = email.trim();
        const salt = 'salt_' + cleanUsername.toLowerCase();
        const passwordHash = await this.hashPassword(password, cleanUsername);

        const result = await this.sendApiRequest('register', {
            username: cleanUsername,
            email: cleanEmail,
            password_hash: passwordHash,
            salt: salt
        });

        if (result.success && result.user) {
            this.saveSession(result.user);
            return result.user;
        } else {
            throw new Error(result.error || "Registration failed");
        }
    }

    /**
     * Login user
     */
    async login(usernameOrEmail, password) {
        if (!usernameOrEmail || !password) {
            throw new Error("Please enter both username/email and password");
        }

        const cleanIdentifier = usernameOrEmail.trim();
        const passwordHash = await this.hashPassword(password, cleanIdentifier);

        const result = await this.sendApiRequest('login', {
            username: cleanIdentifier,
            password_hash: passwordHash
        });

        if (result.success && result.user) {
            this.saveSession(result.user);
            return result.user;
        } else {
            throw new Error(result.error || "Login failed");
        }
    }

    /**
     * Update user's points (e.g. delta = +50 or points = 120)
     */
    async updatePoints({ delta, points }) {
        if (!this.isLoggedIn()) {
            throw new Error("User must be logged in to update points");
        }

        const current = this.currentUser;
        const result = await this.sendApiRequest('update_points', {
            id: current.id,
            username: current.username,
            delta: delta,
            points: points
        });

        if (result.success && result.user) {
            const updated = {
                ...current,
                points: result.user.points
            };
            this.saveSession(updated);
            return updated.points;
        } else {
            throw new Error(result.error || "Failed to update points");
        }
    }

    /**
     * Refresh user profile and points from server
     */
    async refreshUser() {
        if (!this.isLoggedIn()) return null;

        const result = await this.sendApiRequest('get_user', {
            id: this.currentUser.id,
            username: this.currentUser.username
        });

        if (result.success && result.user) {
            const updated = {
                ...this.currentUser,
                points: result.user.points,
                email: result.user.email || this.currentUser.email
            };
            this.saveSession(updated);
            return updated;
        }
        return this.currentUser;
    }
}

// Global singleton instance
window.Auth = new MultiplayedAuth();
