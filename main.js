// Главный файл для инициализации приложения
class TelegramApp {
    constructor() {
        this.initialized = false;
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            // Загружаем настройки
            settingsManager.init();
            
            // Проверяем авторизацию
            if (authManager.loadFromStorage()) {
                await this.showMainApp();
            } else {
                this.showAuthScreen();
            }
            
            this.initialized = true;
            
        } catch (error) {
            console.error('App initialization error:', error);
            this.showErrorScreen();
        }
    }
    
    async showMainApp() {
        // Показываем главный экран
        this.showScreen('main-screen');
        
        // Инициализируем менеджеры
        messageManager.connectSocket();
        contactManager.loadContacts();
        
        // Уведомляем сервер о онлайн статусе
        if (messageManager.socket) {
            messageManager.socket.emit('user_online', authManager.getCurrentUser().id);
        }
    }
    
    showAuthScreen() {
        this.showScreen('auth-screen');
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    showErrorScreen() {
        // Показываем экран ошибки
        document.body.innerHTML = 
            <div class="error-screen">
                <h1>😕 Что-то пошло не так</h1>
                <p>Попробуйте перезагрузить страницу</p>
                <button onclick="location.reload()">Перезагрузить</button>
            </div>
        ;
    }
    
    // Глобальные обработчики
    setupGlobalHandlers() {
        // Обработчик выхода
        window.logout = () => settingsManager.logout();
        
        // Обработчик переключения экранов
        window.showScreen = (screenId) => this.showScreen(screenId);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
    window.app = new TelegramApp();
    window.app.setupGlobalHandlers();
    await window.app.init();
});
