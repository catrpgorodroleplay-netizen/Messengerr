class Utils {
    // Форматирование номера телефона
    static formatPhoneNumber(phone, countryCode) {
        const cleanPhone = phone.replace(/\D/g, '');
        
        const formats = {
            '7': /^(\d{3})(\d{3})(\d{2})(\d{2})$/, // Россия
            '375': /^(\d{2})(\d{3})(\d{2})(\d{2})$/, // Беларусь
            '380': /^(\d{2})(\d{3})(\d{2})(\d{2})$/, // Украина
            '77': /^(\d{3})(\d{3})(\d{2})(\d{2})$/, // Казахстан
            '374': /^(\d{2})(\d{3})(\d{2})(\d{2})$/, // Армения
            '994': /^(\d{2})(\d{3})(\d{2})(\d{2})$/, // Азербайджан
            '995': /^(\d{3})(\d{3})(\d{2})(\d{2})$/, // Грузия
            '998': /^(\d{2})(\d{3})(\d{2})(\d{2})$/, // Узбекистан
            '1': /^(\d{3})(\d{3})(\d{4})$/, // США
            '44': /^(\d{4})(\d{3})(\d{3})$/, // Великобритания
            '49': /^(\d{3})(\d{3})(\d{4})$/, // Германия
            '33': /^(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, // Франция
            '39': /^(\d{3})(\d{3})(\d{4})$/, // Италия
            '34': /^(\d{3})(\d{3})(\d{3})$/, // Испания
            '86': /^(\d{3})(\d{4})(\d{4})$/, // Китай
            '91': /^(\d{5})(\d{5})$/ // Индия
        };
        
        const format = formats[countryCode];
        if (format && cleanPhone.match(format)) {
            return cleanPhone.replace(format, '$1 $2 $3 $4').trim();
        }
        
        // Формат по умолчанию
        return cleanPhone;
    }
    
    // Валидация email
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Валидация номера телефона
    static validatePhone(phone, countryCode) {
        const cleanPhone = phone.replace(/\D/g, '');
        
        const minLengths = {
            '7': 10, '375': 9, '380': 9, '77': 10, '374': 8,
            '994': 9, '995': 9, '998': 9, '1': 10, '44': 10,
            '49': 10, '33': 9, '39': 10, '34': 9, '86': 11, '91': 10
        };
        
        return cleanPhone.length >= (minLengths[countryCode] || 8);
    }
    
    // Генерация случайного ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Форматирование даты
    static formatDate(date, format = 'relative') {
        const now = new Date();
        const target = new Date(date);
        
        if (format === 'relative') {
            const diffMs = now - target;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) return 'только что';
            if (diffMins < 60) return ${diffMins} мин. назад;
            if (diffHours < 24) return ${diffHours} ч. назад;
            if (diffDays === 1) return 'вчера';
            if (diffDays < 7) return ${diffDays} дн. назад;
        }
        
        return target.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: diffDays > 365 ? 'numeric' : undefined
        });
    }
    
    // Форматирование времени
    static formatTime(date) {
        return new Date(date).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Экранирование HTML
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Дебаунс функция
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

};
    }
    
    // Проверка поддержки WebRTC
    static supportsWebRTC() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
    
    // Проверка поддержки WebSocket
    static supportsWebSocket() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    }
    
    // Загрузка файла
    static readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    // Сжатие изображения
    static compressImage(file, maxWidth = 800, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
    
    // Уведомления
    static showNotification(title, options = {}) {
        if (!('Notification' in window)) {
            console.log('Браузер не поддерживает уведомления');
            return;
        }
        
        if (Notification.permission === 'granted') {
            new Notification(title, options);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, options);
                }
            });
        }
    }
    
    // Вибрация (для мобильных)
    static vibrate(pattern = 200) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
    
    // Копирование в буфер обмена
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    }
}

// Глобальные утилиты
window.utils = Utils;
