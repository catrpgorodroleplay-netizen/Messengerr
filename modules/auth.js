class AuthManager {
    constructor() {
        this.currentUser = null;
    }
    
    register(userData) {
        return new Promise((resolve) => {
            const user = {
                id: Date.now().toString(),
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                online: true
            };
            
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('userPassword', userData.password);
            
            resolve({ user });
        });
    }
    
    login(loginData) {
        return new Promise((resolve, reject) => {
            const savedUser = localStorage.getItem('currentUser');
            const savedPassword = localStorage.getItem('userPassword');
            
            if (savedUser && savedPassword === loginData.password) {
                this.currentUser = JSON.parse(savedUser);
                resolve({ user: this.currentUser });
            } else {
                reject(new Error('Неверные данные для входа'));
            }
        });
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userPassword');
    }
    
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    loadFromStorage() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            return true;
        }
        return false;
    }
}

window.authManager = new AuthManager();
