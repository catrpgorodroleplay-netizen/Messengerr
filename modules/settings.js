class SettingsManager {
    constructor() {
        this.settings = {
            theme: 'light',
            notifications: true,
            sound: true,
            privacy: {
                lastSeen: 'everybody',
                profilePhoto: 'everybody',
                status: 'everybody'
            },
            language: 'ru'
        };
    }
    
    init() {
        this.loadSettings();
        this.applySettings();
    }
    
    loadSettings() {
        const saved = localStorage.getItem('appSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }
    
    saveSettings() {
        localStorage.setItem('appSettings', JSON.stringify(this.settings));
        this.applySettings();
    }
    
    applySettings() {
        // Применяем тему
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        
        // Применяем язык
        document.documentElement.lang = this.settings.language;
        
        // Обновляем UI настроек
        this.updateSettingsUI();
    }
    
    updateSettingsUI() {
        // Обновляем переключатели в настройках
        const notificationToggle = document.getElementById('notification-toggle');
        const soundToggle = document.getElementById('sound-toggle');
        const themeSelect = document.getElementById('theme-select');
        const languageSelect = document.getElementById('language-select');
        
        if (notificationToggle) {
            notificationToggle.checked = this.settings.notifications;
        }
        if (soundToggle) {
            soundToggle.checked = this.settings.sound;
        }
        if (themeSelect) {
            themeSelect.value = this.settings.theme;
        }
        if (languageSelect) {
            languageSelect.value = this.settings.language;
        }
    }
    
    // Методы для изменения настроек
    setTheme(theme) {
        this.settings.theme = theme;
        this.saveSettings();
    }
    
    toggleNotifications() {
        this.settings.notifications = !this.settings.notifications;
        this.saveSettings();
    }
    
    toggleSound() {
        this.settings.sound = !this.settings.sound;
        this.saveSettings();
    }
    
    setLanguage(lang) {
        this.settings.language = lang;
        this.saveSettings();
    }
    
    setPrivacySetting(key, value) {
        if (this.settings.privacy[key] !== undefined) {
            this.settings.privacy[key] = value;
            this.saveSettings();
        }
    }
    
    // Профиль пользователя
    async updateProfile(profileData) {
        try {
            const currentUser = authManager.getCurrentUser();
            const updatedUser = { ...currentUser, ...profileData };
            
            // Сохраняем в localStorage
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            authManager.currentUser = updatedUser;
            
            // Обновляем UI
            this.updateProfileUI(updatedUser);
            
            return updatedUser;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }
    
    updateProfileUI(user) {
        // Обновляем отображение профиля в интерфейсе
        const userNameElements = document.querySelectorAll('#current-user-name, #settings-username');
        const userPhoneElements = document.querySelectorAll('#current-user-phone, #settings-phone');
        
        userNameElements.forEach(el => {
            if (el) el.textContent = ${user.firstName} ${user.lastName};
        });
        
        userPhoneElements.forEach(el => {
            if (el) el.textContent = user.phone;
        });
    }
    
    // Выход из аккаунта
    logout() {

if (confirm('Вы уверены, что хотите выйти?')) {
            authManager.logout();
            window.location.reload();
        }
    }
    
    // Экспорт данных
    exportData() {
        const userData = {
            user: authManager.getCurrentUser(),
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = telegram-clone-backup-${new Date().getTime()}.json;
        link.click();
    }
    
    // Удаление аккаунта
    async deleteAccount() {
        if (confirm('ВНИМАНИЕ! Это действие нельзя отменить. Все ваши данные будут удалены. Продолжить?')) {
            try {
                // В реальном приложении здесь был бы запрос к API
                authManager.logout();
                localStorage.clear();
                window.location.reload();
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Ошибка при удалении аккаунта');
            }
        }
    }
}

window.settingsManager = new SettingsManager();
