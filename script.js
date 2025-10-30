// База данных стран
const countries = [
    { code: '7', name: 'Россия', flag: '🇷🇺', pattern: /^(\d{3})(\d{3})(\d{2})(\d{2})$/ },
    { code: '375', name: 'Беларусь', flag: '🇧🇾', pattern: /^(\d{2})(\d{3})(\d{2})(\d{2})$/ },
    { code: '380', name: 'Украина', flag: '🇺🇦', pattern: /^(\d{2})(\d{3})(\d{2})(\d{2})$/ },
    { code: '77', name: 'Казахстан', flag: '🇰🇿', pattern: /^(\d{3})(\d{3})(\d{2})(\d{2})$/ },
    { code: '374', name: 'Армения', flag: '🇦🇲', pattern: /^(\d{2})(\d{3})(\d{2})(\d{2})$/ },
    { code: '994', name: 'Азербайджан', flag: '🇦🇿', pattern: /^(\d{2})(\d{3})(\d{2})(\d{2})$/ },
    { code: '995', name: 'Грузия', flag: '🇬🇪', pattern: /^(\d{3})(\d{3})(\d{2})(\d{2})$/ },
    { code: '998', name: 'Узбекистан', flag: '🇺🇿', pattern: /^(\d{2})(\d{3})(\d{2})(\d{2})$/ }
];

// Текущий пользователь
let currentUser = null;
let contacts = [];

// Обновление флага страны
function updateCountryFlag() {
    const select = document.getElementById('country-code');
    const flag = document.getElementById('country-flag');
    const selectedOption = select.options[select.selectedIndex];
    flag.textContent = selectedOption.getAttribute('data-flag');
}

// Форматирование номера телефона
function formatPhoneNumber() {
    const countryCode = document.getElementById('country-code').value;
    const phoneInput = document.getElementById('phone-number');
    let phone = phoneInput.value.replace(/\D/g, '');
    
    const country = countries.find(c => c.code === countryCode);
    if (country && country.pattern) {
        phone = phone.replace(country.pattern, '$1 $2 $3 $4');
    }
    
    phoneInput.value = phone;
}

// Отправка кода подтверждения
function sendCode() {
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone-number').value.replace(/\D/g, '');
    const username = document.getElementById('username').value;
    
    if (!phoneNumber) {
        alert('Введите номер телефона');
        return;
    }
    
    const fullPhone = +${countryCode}${phoneNumber};
    
    // Сохраняем данные для верификации
    sessionStorage.setItem('pendingPhone', fullPhone);
    sessionStorage.setItem('pendingUsername', username);
    
    // Показываем экран подтверждения
    document.getElementById('verify-phone').textContent = fullPhone;
    showScreen('verify-screen');
    
    // Генерируем тестовый код (в реальном приложении отправляем SMS)
    const testCode = '12345';
    sessionStorage.setItem('verificationCode', testCode);
    alert(Тестовый код: ${testCode});
}

// Подтверждение кода
function verifyCode() {
    const enteredCode = getEnteredCode();
    const expectedCode = sessionStorage.getItem('verificationCode');
    
    if (enteredCode === expectedCode) {
        showScreen('profile-screen');
    } else {
        alert('Неверный код подтверждения');
    }
}

// Завершение регистрации
function completeRegistration() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = sessionStorage.getItem('pendingPhone');
    const username = sessionStorage.getItem('pendingUsername') || user${Date.now()};
    
    currentUser = {
        id: Date.now(),
        phone: phone,
        username: username,
        firstName: firstName,
        lastName: lastName,
        countryCode: phone.split('+')[1].split(' ')[0]
    };
    
    // Сохраняем пользователя
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Загружаем тестовые контакты
    loadSampleContacts();
    
    showScreen('main-screen');
    updateUserInfo();
}

// Загрузка тестовых контактов из разных стран
function loadSampleContacts() {
    contacts = [
        { id: 1, phone: '+375291234567', name: 'Анна (Беларусь)', countryCode: '375', online: true },

{ id: 2, phone: '+380501234567', name: 'Иван (Украина)', countryCode: '380', online: false },
        { id: 3, phone: '+77471234567', name: 'Алия (Казахстан)', countryCode: '77', online: true },
        { id: 4, phone: '+37477123456', name: 'Армен (Армения)', countryCode: '374', online: false },
        { id: 5, phone: '+994501234567', name: 'Лейла (Азербайджан)', countryCode: '994', online: true }
    ];
    
    renderContacts();
}

// Отображение контактов с флагами
function renderContacts() {
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';
    
    contacts.forEach(contact => {
        const country = countries.find(c => c.code === contact.countryCode);
        const flag = country ? country.flag : '🌐';
        
        const contactElement = document.createElement('div');
        contactElement.className = 'contact-item';
        contactElement.innerHTML = 
            <div class="contact-flag">${flag}</div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-phone">${contact.phone}</div>
            </div>
            <div class="online-indicator ${contact.online ? 'online' : 'offline'}"></div>
        ;
        
        contactElement.onclick = () => startChat(contact);
        contactsList.appendChild(contactElement);
    });
}

// Вспомогательные функции
function getEnteredCode() {
    return [
        document.getElementById('code-1').value,
        document.getElementById('code-2').value,
        document.getElementById('code-3').value,
        document.getElementById('code-4').value,
        document.getElementById('code-5').value
    ].join('');
}

function moveToNext(current) {
    if (document.getElementById(code-${current}).value.length === 1) {
        if (current < 5) {
            document.getElementById(code-${current + 1}).focus();
        }
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function updateUserInfo() {
    if (currentUser) {
        document.getElementById('current-user-name').textContent = 
            ${currentUser.firstName} ${currentUser.lastName};
        document.getElementById('current-user-phone').textContent = currentUser.phone;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loadSampleContacts();
        showScreen('main-screen');
        updateUserInfo();
    } else {
        showScreen('auth-screen');
    }
    
    updateCountryFlag();
});
