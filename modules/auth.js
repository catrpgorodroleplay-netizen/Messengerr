class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
    }
    
    async register(userData) {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            
            const data = await response.json();
            this.currentUser = data.user;
            this.token = data.token;
            
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
    
    async login(phone) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone })
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            this.currentUser = data.user;
            this.token = data.token;
            
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    
    logout() {
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
    }
    
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    loadFromStorage() {
        const savedUser = localStorage.getItem('currentUser');
        const savedToken = localStorage.getItem('token');
        
        if (savedUser && savedToken) {
            this.currentUser = JSON.parse(savedUser);
            this.token = savedToken;
            return true;
        }
        return false;
    }
}

// Создаем глобальный экземпляр
window.authManager = new AuthManager();
