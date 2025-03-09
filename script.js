
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('#menu');

// Открытие/закрытие меню
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Закрытие меню при клике вне области
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Закрытие меню при ресайзе
window.addEventListener('resize', () => {
    if (window.innerWidth > 600) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});



