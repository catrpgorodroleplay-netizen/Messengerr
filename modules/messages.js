class MessageManager {
    constructor() {
        this.socket = null;
        this.currentChat = null;
        this.messages = new Map(); // chatId -> messages[]
    }
    
    connectSocket() {
        this.socket = io();
        
        this.socket.on('new_message', (message) => {
            this.addMessage(message);
            this.updateChatList(message);
        });
        
        this.socket.on('user_typing', (data) => {
            this.showTypingIndicator(data);
        });
        
        this.socket.on('user_stop_typing', (data) => {
            this.hideTypingIndicator(data);
        });
    }
    
    async sendMessage(chatId, text) {
        if (!text.trim()) return;
        
        const message = {
            chatId,
            senderId: authManager.getCurrentUser().id,
            text: text.trim(),
            timestamp: new Date()
        };
        
        // Оптимистичное обновление UI
        this.addMessage({
            ...message,
            id: temp-${Date.now()},
            read: false
        });
        
        // Отправка на сервер
        this.socket.emit('send_message', message);
        
        // Очистка поля ввода
        document.getElementById('message-input').value = '';
    }
    
    addMessage(message) {
        if (!this.messages.has(message.chatId)) {
            this.messages.set(message.chatId, []);
        }
        
        const chatMessages = this.messages.get(message.chatId);
        
        // Удаляем временное сообщение если есть
        const tempIndex = chatMessages.findIndex(m => m.id === message.id);
        if (tempIndex > -1) {
            chatMessages.splice(tempIndex, 1);
        }
        
        chatMessages.push(message);
        this.sortMessages(message.chatId);
        
        // Обновляем UI если это текущий чат
        if (this.currentChat === message.chatId) {
            this.renderMessages(message.chatId);
        }
    }
    
    async loadMessages(chatId) {
        try {
            const response = await fetch(/api/messages/${chatId});
            const messages = await response.json();
            
            this.messages.set(chatId, messages);
            this.sortMessages(chatId);
            this.renderMessages(chatId);
            
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }
    
    sortMessages(chatId) {
        const messages = this.messages.get(chatId);
        if (messages) {
            messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        }
    }
    
    renderMessages(chatId) {
        const container = document.getElementById('messages-container');
        const messages = this.messages.get(chatId) || [];
        
        container.innerHTML = messages.map(message => 
            this.createMessageElement(message)
        ).join('');
        
        // Скролл вниз
        container.scrollTop = container.scrollHeight;
    }
    
    createMessageElement(message) {
        const currentUser = authManager.getCurrentUser();
        const isOutgoing = message.senderId === currentUser.id;
        
        return 
            <div class="message ${isOutgoing ? 'message-outgoing' : 'message-incoming'}">
                ${!isOutgoing ? <div class="message-sender">${this.getSenderName(message.senderId)}</div> : ''}
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                <div class="message-time">${this.formatTime(message.timestamp)}</div>
            </div>
        ;
    }
    
    getSenderName(senderId) {
        // В реальном приложении получаем из базы данных
        const users = {
            '1': 'Анна (Беларусь)',
            '2': 'Иван (Украина)', 
            '3': 'Алия (Казахстан)'
        };

return users[senderId] || 'Unknown User';
    }
    
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    startTyping(chatId) {
        this.socket.emit('typing_start', {
            chatId,
            userId: authManager.getCurrentUser().id
        });
    }
    
    stopTyping(chatId) {
        this.socket.emit('typing_stop', {
            chatId,
            userId: authManager.getCurrentUser().id
        });
    }
    
    showTypingIndicator(data) {
        if (this.currentChat === data.chatId) {
            const container = document.getElementById('messages-container');
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.id = typing-${data.userId};
            indicator.textContent = ${this.getSenderName(data.userId)} печатает...;
            container.appendChild(indicator);
            container.scrollTop = container.scrollHeight;
        }
    }
    
    hideTypingIndicator(data) {
        if (this.currentChat === data.chatId) {
            const indicator = document.getElementById(typing-${data.userId});
            if (indicator) {
                indicator.remove();
            }
        }
    }
    
    updateChatList(message) {
        // Обновляем список чатов при новом сообщении
        if (window.chatManager) {
            window.chatManager.loadChats();
        }
    }
}

window.messageManager = new MessageManager();
