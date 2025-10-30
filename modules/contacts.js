class ContactManager {
    constructor() {
        this.contacts = [];
        this.countries = [
            { code: '7', name: 'Россия', flag: '🇷🇺' },
            { code: '375', name: 'Беларусь', flag: '🇧🇾' },
            { code: '380', name: 'Украина', flag: '🇺🇦' },
            { code: '77', name: 'Казахстан', flag: '🇰🇿' },
            { code: '374', name: 'Армения', flag: '🇦🇲' },
            { code: '994', name: 'Азербайджан', flag: '🇦🇿' },
            { code: '995', name: 'Грузия', flag: '🇬🇪' },
            { code: '998', name: 'Узбекистан', flag: '🇺🇿' },
            { code: '1', name: 'США', flag: '🇺🇸' },
            { code: '44', name: 'Великобритания', flag: '🇬🇧' },
            { code: '49', name: 'Германия', flag: '🇩🇪' },
            { code: '33', name: 'Франция', flag: '🇫🇷' },
            { code: '39', name: 'Италия', flag: '🇮🇹' },
            { code: '34', name: 'Испания', flag: '🇪🇸' },
            { code: '86', name: 'Китай', flag: '🇨🇳' },
            { code: '91', name: 'Индия', flag: '🇮🇳' }
        ];
    }
    
    async loadContacts() {
        try {
            const response = await fetch('/api/users');
            this.contacts = await response.json();
            this.renderContacts();
        } catch (error) {
            console.error('Error loading contacts:', error);
            this.loadSampleContacts();
        }
    }
    
    loadSampleContacts() {
        this.contacts = [
            {
                id: '1',
                phone: '+375291234567',
                firstName: 'Анна',
                lastName: 'Иванова',
                countryCode: '375',
                online: true,
                lastSeen: new Date()
            },
            {
                id: '2', 
                phone: '+380501234567',
                firstName: 'Иван',
                lastName: 'Петров',
                countryCode: '380',
                online: false,
                lastSeen: new Date(Date.now() - 3600000)
            },
            {
                id: '3',
                phone: '+77471234567',
                firstName: 'Алия',
                lastName: 'Калиева',
                countryCode: '77',
                online: true,
                lastSeen: new Date()
            },
            {
                id: '4',
                phone: '+37477123456',
                firstName: 'Армен',
                lastName: 'Саргсян',
                countryCode: '374', 
                online: false,
                lastSeen: new Date(Date.now() - 7200000)
            }
        ];
        this.renderContacts();
    }
    
    renderContacts() {
        const container = document.getElementById('contacts-list');
        if (!container) return;
        
        container.innerHTML = this.contacts.map(contact => 
            this.createContactElement(contact)
        ).join('');
    }
    
    createContactElement(contact) {
        const country = this.countries.find(c => c.code === contact.countryCode);
        const flag = country ? country.flag : '🌐';
        const onlineStatus = contact.online ? 'online' : 'offline';
        const lastSeen = contact.online ? 'online' : this.formatLastSeen(contact.lastSeen);
        
        return `
            <div class="contact-item" onclick="contactManager.startChat('${contact.id}')">
                <div class="contact-avatar">
                    <div class="avatar">${contact.firstName[0]}${contact.lastName[0]}</div>
                    <div class="online-indicator ${onlineStatus}"></div>
                </div>
                <div class="contact-info">
                    <div class="contact-name">${contact.firstName} ${contact.lastName}</div>
                    <div class="contact-details">
                        <span class="contact-flag">${flag}</span>

<span class="contact-phone">${contact.phone}</span>
                        <span class="contact-status">${lastSeen}</span>
                    </div>
                </div>
            </div>
        ;
    }
    
    formatLastSeen(timestamp) {
        const now = new Date();
        const lastSeen = new Date(timestamp);
        const diffMs = now - lastSeen;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'только что';
        if (diffMins < 60) return был(а) ${diffMins} мин. назад;
        if (diffHours < 24) return был(а) ${diffHours} ч. назад;
        if (diffDays < 7) return был(а) ${diffDays} дн. назад;
        return был(а) в ${lastSeen.toLocaleDateString('ru-RU')};
    }
    
    async startChat(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;
        
        // Создаем или находим чат
        const chatId = await this.getOrCreateChat(contactId);
        
        // Переключаемся на чат
        if (window.chatManager) {
            window.chatManager.openChat(chatId, contact);
        }
    }
    
    async getOrCreateChat(contactId) {
        // В реальном приложении делаем запрос к API
        // Пока возвращаем фиктивный ID
        return chat_${authManager.getCurrentUser().id}_${contactId}`;
    }
    
    searchContacts(query) {
        const searchTerm = query.toLowerCase();
        const filtered = this.contacts.filter(contact =>
            contact.firstName.toLowerCase().includes(searchTerm) ||
            contact.lastName.toLowerCase().includes(searchTerm) ||
            contact.phone.includes(searchTerm)
        );
        
        this.renderFilteredContacts(filtered);
    }
    
    renderFilteredContacts(filteredContacts) {
        const container = document.getElementById('contacts-list');
        container.innerHTML = filteredContacts.map(contact =>
            this.createContactElement(contact)
        ).join('');
    }
}

window.contactManager = new ContactManager();
