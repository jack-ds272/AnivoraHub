// Инициализация localStorage
if (!localStorage.getItem('likedAnime')) localStorage.setItem('likedAnime', JSON.stringify({}));
if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');
if (!localStorage.getItem('historyAnime')) localStorage.setItem('historyAnime', JSON.stringify([]));
if (!localStorage.getItem('lastAnime')) localStorage.setItem('lastAnime', '');
if (!localStorage.getItem('userStats')) localStorage.setItem('userStats', JSON.stringify({
  level: 1,
  xp: 0,
  totalWatchTime: 0,
  totalFavorites: 0,
  totalAnimeWatched: 0,
  achievements: {
    first_watch: false,
    favorite: false,
    hour_watched: false
  }
}));
if (!localStorage.getItem('userProfile')) localStorage.setItem('userProfile', JSON.stringify({
  username: 'Аниме-любитель',
  avatar: 'https://via.placeholder.com/100'
}));

// Элементы
const optionsBtn = document.getElementById('optionsBtn');
const optionsPanel = document.getElementById('optionsPanel');
const themeBtn = document.getElementById('themeBtn');
const catalogBtn = document.getElementById('catalogBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const historyBtn = document.getElementById('historyBtn');
const statsBtn = document.getElementById('statsBtn');
const burgerMenu = document.getElementById('burgerMenu');
const mobileMenu = document.getElementById('mobileMenu');
const mobileCatalogBtn = document.getElementById('mobileCatalogBtn');
const mobileFavoritesBtn = document.getElementById('mobileFavoritesBtn');
const mobileHistoryBtn = document.getElementById('mobileHistoryBtn');
const mobileStatsBtn = document.getElementById('mobileStatsBtn');
const mobileThemeBtn = document.getElementById('mobileThemeBtn');
const changeAvatarBtn = document.getElementById('changeAvatarBtn');
const avatarInput = document.getElementById('avatarInput');
const userAvatar = document.getElementById('userAvatar');
const usernameInput = document.getElementById('usernameInput');

const catalog = document.getElementById('catalog');
const favorites = document.getElementById('favorites');
const historyDiv = document.getElementById('history');
const statsPanel = document.getElementById('statsPanel');
const favoritesList = document.getElementById('favorites-list');
const historyList = document.getElementById('history-list');
const preloader = document.getElementById('preloader');
const userLevelEl = document.getElementById('userLevel');
const levelProgressEl = document.getElementById('levelProgress');
const statLevelEl = document.getElementById('statLevel');
const statLevelProgressEl = document.getElementById('statLevelProgress');
const achievementsList = document.getElementById('achievementsList');
const totalWatchedEl = document.getElementById('totalWatched');
const totalFavoritesEl = document.getElementById('totalFavorites');
const totalAnimeEl = document.getElementById('totalAnime');

const iframe = document.querySelector('.video-container iframe');

// Защита от быстрых многократных нажатий
let isButtonCooldown = false;
function buttonCooldown() {
  if (isButtonCooldown) return true;
  isButtonCooldown = true;
  setTimeout(() => { isButtonCooldown = false; }, 300);
  return false;
}

// Показать/скрыть прелоадер
function showPreloader(show) {
  preloader.style.opacity = show ? '1' : '0';
  preloader.style.pointerEvents = show ? 'all' : 'none';
  
  if (!show) {
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
}

// Применяем тему
function applyTheme(theme) {
    document.body.className = theme === 'light' ? 'light' : '';
    localStorage.setItem('theme', theme);
}
applyTheme(localStorage.getItem('theme'));

// Загрузка профиля пользователя
function loadUserProfile() {
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  userAvatar.src = userProfile.avatar;
  usernameInput.value = userProfile.username;
}

// Сохранение профиля пользователя
function saveUserProfile() {
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  userProfile.username = usernameInput.value;
  localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// Смена аватарки
changeAvatarBtn.addEventListener('click', () => {
  avatarInput.click();
});

avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      userAvatar.src = e.target.result;
      const userProfile = JSON.parse(localStorage.getItem('userProfile'));
      userProfile.avatar = e.target.result;
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    };
    reader.readAsDataURL(file);
  }
});

// Сохранение имени пользователя
usernameInput.addEventListener('blur', saveUserProfile);
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    saveUserProfile();
    usernameInput.blur();
  }
});

// Бургер меню
burgerMenu.addEventListener('click', () => {
  if (buttonCooldown()) return;
  burgerMenu.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  updateUserStatsDisplay();
});

// Мобильное меню
mobileCatalogBtn.addEventListener('click', () => {
  toggleCatalog(true);
  mobileMenu.classList.remove('active');
  burgerMenu.classList.remove('active');
});

mobileFavoritesBtn.addEventListener('click', () => {
  toggleFavorites(true);
  mobileMenu.classList.remove('active');
  burgerMenu.classList.remove('active');
});

mobileHistoryBtn.addEventListener('click', () => {
  toggleHistory(true);
  mobileMenu.classList.remove('active');
  burgerMenu.classList.remove('active');
});

mobileStatsBtn.addEventListener('click', () => {
  toggleStats(true);
  mobileMenu.classList.remove('active');
  burgerMenu.classList.remove('active');
});

mobileThemeBtn.addEventListener('click', () => {
  applyTheme(document.body.classList.contains('light') ? 'dark' : 'light');
  mobileMenu.classList.remove('active');
  burgerMenu.classList.remove('active');
});

// Опции
optionsBtn.addEventListener('click', () => {
  if (buttonCooldown()) return;
  optionsPanel.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!optionsPanel.contains(e.target) && !optionsBtn.contains(e.target)) {
        optionsPanel.classList.remove('show');
    }
});

themeBtn.addEventListener('click', () => {
  if (buttonCooldown()) return;
  applyTheme(document.body.classList.contains('light') ? 'dark' : 'light');
});

statsBtn.addEventListener('click', () => {
  if (buttonCooldown()) return;
  toggleStats(true);
});

// Каталог, Избранное, История, Профиль
catalogBtn.addEventListener('click', () => {
  if (buttonCooldown()) return;
  toggleCatalog(true);
});

favoritesBtn.addEventListener('click', () => {
  if (buttonCooldown()) return;
  toggleFavorites(true);
});

historyBtn.addEventListener('click', () => {
  if (buttonCooldown()) return;
  toggleHistory(true);
});

function toggleCatalog(show) { 
  catalog.classList.toggle('active', show); 
  if (show) {
    favorites.classList.remove('active');
    historyDiv.classList.remove('active');
    statsPanel.classList.remove('active');
  }
}

function toggleFavorites(show) { 
  favorites.classList.toggle('active', show); 
  if (show) {
    catalog.classList.remove('active');
    historyDiv.classList.remove('active');
    statsPanel.classList.remove('active');
    updateFavoritesList();
  }
}

function toggleHistory(show) { 
  historyDiv.classList.toggle('active', show); 
  if (show) {
    catalog.classList.remove('active');
    favorites.classList.remove('active');
    statsPanel.classList.remove('active');
    updateHistoryList();
  }
}

function toggleStats(show) { 
  statsPanel.classList.toggle('active', show); 
  if (show) {
    catalog.classList.remove('active');
    favorites.classList.remove('active');
    historyDiv.classList.remove('active');
    updateStatsPanel();
  }
}

function updateFavoritesList() {
    const liked = JSON.parse(localStorage.getItem('likedAnime'));
    favoritesList.innerHTML = '';
    let favoriteCount = 0;
    
    for (let anime in liked) {
        if (liked[anime]) {
            favoriteCount++;
            const btn = document.createElement('button');
            btn.textContent = anime;
            btn.className = 'catalog-btn';
            btn.onclick = () => {
              if (buttonCooldown()) return;
              switchAnimeByTitle(anime);
            };
            favoritesList.appendChild(btn);
        }
    }
    
    // Обновляем счетчик в статистике
    const userStats = JSON.parse(localStorage.getItem('userStats'));
    userStats.totalFavorites = favoriteCount;
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

function addToHistory(title) {
    let history = JSON.parse(localStorage.getItem('historyAnime'));
    if (!history.includes(title)) {
        history.unshift(title);
        if (history.length > 10) history.pop();
        localStorage.setItem('historyAnime', JSON.stringify(history));
        
        // Обновляем счетчик просмотренных аниме
        const userStats = JSON.parse(localStorage.getItem('userStats'));
        userStats.totalAnimeWatched = history.length;
        localStorage.setItem('userStats', JSON.stringify(userStats));
        
        // Проверяем достижения
        checkAchievements();
    }
}

function updateHistoryList() {
    const history = JSON.parse(localStorage.getItem('historyAnime'));
    historyList.innerHTML = '';
    history.forEach(title => {
        const btn = document.createElement('button');
        btn.textContent = title;
        btn.className = 'catalog-btn';
        btn.onclick = () => {
          if (buttonCooldown()) return;
          switchAnimeByTitle(title);
        };
        historyList.appendChild(btn);
    });
}

// Система пользовательской статистики и уровней
function addUserXp(amount) {
  const userStats = JSON.parse(localStorage.getItem('userStats'));
  userStats.xp += amount;
  userStats.totalWatchTime += amount;
  
  // Проверка повышения уровня (1000 XP за уровень)
  if (userStats.xp >= 1000) {
    userStats.level += 1;
    userStats.xp = userStats.xp % 1000;
    
    // Показываем уведомление о новом уровне
    showLevelUpNotification(userStats.level);
  }
  
  localStorage.setItem('userStats', JSON.stringify(userStats));
  updateUserStatsDisplay();
  
  // Проверяем достижения
  checkAchievements();
}

function updateUserStatsDisplay() {
  const userStats = JSON.parse(localStorage.getItem('userStats'));
  const progressPercent = (userStats.xp / 1000) * 100;
  
  // Обновляем элементы интерфейса
  if (userLevelEl) userLevelEl.textContent = userStats.level;
  if (levelProgressEl) levelProgressEl.style.width = `${progressPercent}%`;
  if (statLevelEl) statLevelEl.textContent = userStats.level;
  if (statLevelProgressEl) statLevelProgressEl.style.width = `${progressPercent}%`;
  
  // Обновляем статистику
  if (totalWatchedEl) totalWatchedEl.textContent = Math.floor(userStats.totalWatchTime / 60);
  if (totalFavoritesEl) totalFavoritesEl.textContent = userStats.totalFavorites;
  if (totalAnimeEl) totalAnimeEl.textContent = userStats.totalAnimeWatched;
}

function showLevelUpNotification(level) {
  // Создаем уведомление о повышении уровня
  const notification = document.createElement('div');
  notification.className = 'level-up-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid fa-trophy"></i>
      <h3>Поздравляем!</h3>
      <p>Вы достигли ${level} уровня!</p>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Удаляем уведомление через 5 секунд
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Система достижений
function checkAchievements() {
  const userStats = JSON.parse(localStorage.getItem('userStats'));
  const history = JSON.parse(localStorage.getItem('historyAnime'));
  
  // Первый просмотр
  if (history.length > 0 && !userStats.achievements.first_watch) {
    userStats.achievements.first_watch = true;
    addUserXp(50); // Бонус за достижение
  }
  
  // Добавление в избранное
  if (userStats.totalFavorites > 0 && !userStats.achievements.favorite) {
    userStats.achievements.favorite = true;
    addUserXp(30); // Бонус за достижение
  }
  
  // Час просмотра
  if (userStats.totalWatchTime >= 3600 && !userStats.achievements.hour_watched) {
    userStats.achievements.hour_watched = true;
    addUserXp(100); // Бонус за достижение
  }
  
  localStorage.setItem('userStats', JSON.stringify(userStats));
}

function updateAchievementsDisplay() {
  const achievements = [
    { id: 'first_watch', name: 'Первый просмотр', icon: 'fa-play', description: 'Посмотрите первое аниме' },
    { id: 'favorite', name: 'В избранном', icon: 'fa-heart', description: 'Добавьте аниме в избранное' },
    { id: 'hour_watched', name: 'Час просмотра', icon: 'fa-clock', description: 'Посмотрите 1 час аниме' }
  ];
  
  const userStats = JSON.parse(localStorage.getItem('userStats'));
  achievementsList.innerHTML = '';
  
  achievements.forEach(achievement => {
    const achieved = userStats.achievements && userStats.achievements[achievement.id];
    const achievementEl = document.createElement('div');
    achievementEl.className = `achievement ${achieved ? '' : 'locked'}`;
    achievementEl.innerHTML = `
      <i class="fa-solid ${achievement.icon}"></i>
      <h4>${achievement.name}</h4>
      <p>${achievement.description}</p>
      ${achieved ? '<span class="achievement-badge">✓</span>' : ''}
    `;
    achievementsList.appendChild(achievementEl);
  });
}

function updateStatsPanel() {
  updateUserStatsDisplay();
  updateAchievementsDisplay();
}

// Плавная анимация переключения видео и текста
function switchAnime(url, title, desc, btn) {
  showPreloader(true);
  
  iframe.classList.remove('show');

  setTimeout(() => {
      iframe.src = url;
      
      iframe.onload = () => {
        iframe.classList.add('show');
        showPreloader(false);
        
        // Добавляем в историю и начисляем XP
        addToHistory(title);
        addUserXp(10); // XP за начало просмотра
        
        // Отмечаем первое аниме как просмотренное
        const userStats = JSON.parse(localStorage.getItem('userStats'));
        if (userStats.totalAnimeWatched === 0) {
          userStats.totalAnimeWatched = 1;
          localStorage.setItem('userStats', JSON.stringify(userStats));
          checkAchievements();
        }
      };
      
      document.querySelectorAll('.catalog-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');

      toggleCatalog(false);
      toggleFavorites(false);
      toggleHistory(false);
      statsPanel.classList.remove('active');

      localStorage.setItem('lastAnime', title);
  }, 300);
}

function switchAnimeByTitle(title) {
    const buttons = document.querySelectorAll('.catalog-btn');
    buttons.forEach(b => {
        if (b.innerText === title) { 
          b.click(); 
        }
    });
}

// Свайп жесты для мобильных устройств
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  
  // Свайп слева направо для открытия меню
  if (touchEndX > touchStartX + swipeThreshold && touchStartX < 50) {
    burgerMenu.classList.add('active');
    mobileMenu.classList.add('active');
    updateUserStatsDisplay();
  }
  
  // Свайп справа налево для закрытия меню
  if (touchStartX > touchEndX + swipeThreshold && mobileMenu.classList.contains('active')) {
    burgerMenu.classList.remove('active');
    mobileMenu.classList.remove('active');
  }
  
  // Свайп справа налево для закрытия панелей
  if (touchStartX > touchEndX + swipeThreshold && 
      (catalog.classList.contains('active') || 
       favorites.classList.contains('active') || 
       historyDiv.classList.contains('active') ||
       statsPanel.classList.contains('active'))) {
    toggleCatalog(false);
    toggleFavorites(false);
    toggleHistory(false);
    toggleStats(false);
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Скрываем прелоадер после загрузки страницы
  setTimeout(() => {
    showPreloader(false);
    iframe.classList.add('show');
    
    // Загружаем профиль пользователя
    loadUserProfile();
    
    // Обновляем статистику пользователя
    updateUserStatsDisplay();
    
    // Проверяем достижения
    checkAchievements();
  }, 1000);
});

// Предотвращение масштабирования на мобильных устройствах
document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// Отключаем масштабирование на Android
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});