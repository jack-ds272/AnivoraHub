// Инициализация localStorage
if (!localStorage.getItem('likedAnime')) localStorage.setItem('likedAnime', JSON.stringify({}));
if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');
if (!localStorage.getItem('historyAnime')) localStorage.setItem('historyAnime', JSON.stringify([]));
if (!localStorage.getItem('userStats')) localStorage.setItem('userStats', JSON.stringify({
  level: 1,
  xp: 0,
  totalWatchTime: 0,
  totalFavorites: 0,
  totalAnimeWatched: 0,
  achievements: {
    first_watch: false,
    favorite: false,
    hour_watched: false,
    explorer: false
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
const playerOverlay = document.getElementById('playerOverlay');
const playerFrame = document.getElementById('playerFrame');
const playerTitle = document.getElementById('playerTitle');
const playerDescription = document.getElementById('playerDescription');
const playerLikeBtn = document.getElementById('playerLikeBtn');
const closePlayerBtn = document.querySelector('.close-player-btn');

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
const currentLevelEl = document.getElementById('currentLevel');
const currentXpEl = document.getElementById('currentXP');
const achievementsList = document.getElementById('achievementsList');
const totalWatchedEl = document.getElementById('totalWatched');
const totalFavoritesEl = document.getElementById('totalFavorites');
const totalAnimeEl = document.getElementById('totalAnime');

// Переменные
let currentAnime = null;
let isButtonCooldown = false;
let watchTimer = null;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    showPreloader(false);
    loadUserProfile();
    updateUserStatsDisplay();
    checkAchievements();
    updateFavoritesList();
    updateHistoryList();
    initAnimeItems();
  }, 1000);
});

// Защита от быстрых нажатий
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
  if (!show) setTimeout(() => { preloader.style.display = 'none'; }, 500);
}

// Загрузка профиля
function loadUserProfile() {
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  userAvatar.src = userProfile.avatar;
  usernameInput.value = userProfile.username;
}

// Сохранение профиля
function saveUserProfile() {
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  userProfile.username = usernameInput.value;
  localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// Смена аватарки
changeAvatarBtn.addEventListener('click', () => avatarInput.click());
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

// Сохранение имени
usernameInput.addEventListener('blur', saveUserProfile);
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    saveUserProfile();
    usernameInput.blur();
  }
});

// Навигация
burgerMenu.addEventListener('click', () => {
  if (buttonCooldown()) return;
  burgerMenu.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  updateUserStatsDisplay();
});

[mobileCatalogBtn, mobileFavoritesBtn, mobileHistoryBtn, mobileStatsBtn].forEach(btn => {
  btn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    burgerMenu.classList.remove('active');
  });
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

[catalogBtn, favoritesBtn, historyBtn, statsBtn].forEach(btn => {
  btn.addEventListener('click', () => optionsPanel.classList.remove('show'));
});

// Тема
function applyTheme(theme) {
  document.body.className = theme === 'light' ? 'light' : '';
  localStorage.setItem('theme', theme);
}
applyTheme(localStorage.getItem('theme'));

// Переключение разделов
catalogBtn.addEventListener('click', () => toggleCatalog(true));
favoritesBtn.addEventListener('click', () => toggleFavorites(true));
historyBtn.addEventListener('click', () => toggleHistory(true));
statsBtn.addEventListener('click', () => toggleStats(true));

mobileCatalogBtn.addEventListener('click', () => toggleCatalog(true));
mobileFavoritesBtn.addEventListener('click', () => toggleFavorites(true));
mobileHistoryBtn.addEventListener('click', () => toggleHistory(true));
mobileStatsBtn.addEventListener('click', () => toggleStats(true));

function toggleCatalog(show) { 
  catalog.classList.toggle('active', show); 
  if (show) hideOtherPanels();
}

function toggleFavorites(show) { 
  favorites.classList.toggle('active', show); 
  if (show) {
    hideOtherPanels();
    updateFavoritesList();
  }
}

function toggleHistory(show) { 
  historyDiv.classList.toggle('active', show); 
  if (show) {
    hideOtherPanels();
    updateHistoryList();
  }
}

function toggleStats(show) { 
  statsPanel.classList.toggle('active', show); 
  if (show) {
    hideOtherPanels();
    updateStatsPanel();
  }
}

function hideOtherPanels() {
  [catalog, favorites, historyDiv, statsPanel].forEach(panel => {
    if (panel !== this) panel.classList.remove('active');
  });
}

// Инициализация аниме-items
function initAnimeItems() {
  document.querySelectorAll('.anime-like-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const animeItem = this.closest('.anime-item');
      const title = animeItem.querySelector('h3').textContent;
      toggleLike(title, this);
    });
  });
}

// Лайки
function toggleLike(title, btn = null) {
  const liked = JSON.parse(localStorage.getItem('likedAnime'));
  liked[title] = !liked[title];
  localStorage.setItem('likedAnime', JSON.stringify(liked));
  
  if (btn) {
    btn.classList.toggle('liked', liked[title]);
    btn.innerHTML = `<i class="fa-solid fa-heart${liked[title] ? '' : ''}"></i>`;
  }
  
  if (playerLikeBtn && currentAnime === title) {
    playerLikeBtn.classList.toggle('liked', liked[title]);
  }
  
  updateFavoritesList();
  checkAchievements();
}

// Обновление избранного
function updateFavoritesList() {
  const liked = JSON.parse(localStorage.getItem('likedAnime'));
  favoritesList.innerHTML = '';
  let favoriteCount = 0;
  
  for (let anime in liked) {
    if (liked[anime]) {
      favoriteCount++;
      const animeItem = createAnimeItem(anime, liked[anime]);
      favoritesList.appendChild(animeItem);
    }
  }
  
  if (favoriteCount === 0) {
    favoritesList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Здесь пока пусто</p>';
  }
  
  // Обновляем счетчик
  const userStats = JSON.parse(localStorage.getItem('userStats'));
  userStats.totalFavorites = favoriteCount;
  localStorage.setItem('userStats', JSON.stringify(userStats));
}

// История
function addToHistory(title) {
  let history = JSON.parse(localStorage.getItem('historyAnime'));
  if (!history.includes(title)) {
    history.unshift(title);
    if (history.length > 10) history.pop();
    localStorage.setItem('historyAnime', JSON.stringify(history));
    
    const userStats = JSON.parse(localStorage.getItem('userStats'));
    userStats.totalAnimeWatched = new Set(history).size;
    localStorage.setItem('userStats', JSON.stringify(userStats));
    
    checkAchievements();
  }
}

function updateHistoryList() {
  const history = JSON.parse(localStorage.getItem('historyAnime'));
  historyList.innerHTML = '';
  
  if (history.length === 0) {
    historyList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Здесь пока пусто</p>';
    return;
  }
  
  history.forEach(title => {
    const animeItem = createAnimeItem(title, false);
    historyList.appendChild(animeItem);
  });
}

function createAnimeItem(title, isLiked) {
  const item = document.createElement('div');
  item.className = 'anime-item';
  item.innerHTML = `
    <h3>${title}</h3>
    <button class="watch-btn" onclick="openAnime('${title}')">
      <i class="fa-solid fa-play"></i> Смотреть
    </button>
  `;
  return item;
}

// Система уровней
function addUserXp(amount) {
  const userStats = JSON.parse(localStorage.getItem('userStats'));
  const oldLevel = userStats.level;
  
  userStats.xp += amount;
  userStats.totalWatchTime += amount;
  
  // Проверка уровня
  if (userStats.xp >= 1000) {
    userStats.level = Math.floor(userStats.xp / 1000) + 1;
    userStats.xp = userStats.xp % 1000;
    
    if (userStats.level > oldLevel) {
      showLevelUpNotification(userStats.level);
    }
  }
  
  localStorage.setItem('userStats', JSON.stringify(userStats));
  updateUserStatsDisplay();
  checkAchievements();
}

function updateUserStatsDisplay() {
  const userStats = JSON.parse(localStorage.getItem('userStats'));
  const progressPercent = (userStats.xp / 1000) * 100;
  
  // Обновляем элементы
  [userLevelEl, statLevelEl, currentLevelEl].forEach(el => {
    if (el) el.textContent = userStats.level;
  });
  
  [levelProgressEl, statLevelProgressEl].forEach(el => {
    if (el) el.style.width = `${progressPercent}%`;
  });
  
  if (currentXpEl) currentXpEl.textContent = Math.floor(userStats.xp);
  if (totalWatchedEl) totalWatchedEl.textContent = Math.floor(userStats.totalWatchTime / 60);
  if (totalFavoritesEl) totalFavoritesEl.textContent = userStats.totalFavorites;
  if (totalAnimeEl) totalAnimeEl.textContent = userStats.totalAnimeWatched;
}

function showLevelUpNotification(level) {
  const notification = document.createElement('div');
  notification.className = 'level-up-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid fa-trophy"></i>
      <h3>Новый уровень!</h3>
      <p>Вы достигли ${level} уровня!</p>
    </div>
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Достижения
function checkAchievements() {
  const userStats = JSON.parse(localStorage.getItem('userStats'));
  const history = JSON.parse(localStorage.getItem('historyAnime'));
  const liked = JSON.parse(localStorage.getItem('likedAnime'));
  
  const achievements = {
    first_watch: history.length > 0,
    favorite: Object.values(liked).some(l => l),
    hour_watched: userStats.totalWatchTime >= 3600,
    explorer: new Set(history).size >= 3
  };
  
  let earnedXp = 0;
  Object.entries(achievements).forEach(([key, achieved]) => {
    if (achieved && !userStats.achievements[key]) {
      userStats.achievements[key] = true;
      earnedXp += 50;
    }
  });
  
  if (earnedXp > 0) {
    addUserXp(earnedXp);
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }
}

function updateAchievementsDisplay() {
  const achievements = [
    { id: 'first_watch', name: 'Первый просмотр', icon: 'fa-play', description: 'Посмотрите первое аниме' },
    { id: 'favorite', name: 'Фанат', icon: 'fa-heart', description: 'Добавьте аниме в избранное' },
    { id: 'hour_watched', name: 'Киноман', icon: 'fa-clock', description: 'Посмотрите 1 час аниме' },
    { id: 'explorer', name: 'Исследователь', icon: 'fa-compass', description: 'Посмотрите 3+ разных аниме' }
  ];
  
  const userStats = JSON.parse(localStorage.getItem('userStats'));
  achievementsList.innerHTML = '';
  
  achievements.forEach(achievement => {
    const achieved = userStats.achievements[achievement.id];
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

// Плеер
function switchAnime(animeElement) {
  const src = animeElement.dataset.src;
  const title = animeElement.dataset.title;
  const desc = animeElement.dataset.desc;
  
  currentAnime = title;
  playerFrame.src = src;
  playerTitle.textContent = title;
  playerDescription.textContent = desc;
  
  // Обновляем лайк
  const liked = JSON.parse(localStorage.getItem('likedAnime'));
  playerLikeBtn.classList.toggle('liked', liked[title]);
  
  // Показываем плеер
  playerOverlay.classList.add('active');
  
  // Добавляем в историю и начисляем XP
  addToHistory(title);
  addUserXp(10);
  
  // Запускаем таймер просмотра
  startWatchTimer();
}

function openAnime(title) {
  const animeItem = document.querySelector(`.anime-item h3:contains("${title}")`)?.closest('.anime-item');
  if (animeItem) switchAnime(animeItem);
}

function closePlayer() {
  playerOverlay.classList.remove('active');
  playerFrame.src = '';
  stopWatchTimer();
}

playerLikeBtn.addEventListener('click', () => {
  if (currentAnime) {
    toggleLike(currentAnime);
  }
});

function startWatchTimer() {
  stopWatchTimer();
  watchTimer = setInterval(() => {
    addUserXp(1); // 1 XP за секунду просмотра
  }, 1000);
}

function stopWatchTimer() {
  if (watchTimer) {
    clearInterval(watchTimer);
    watchTimer = null;
  }
}

// Обновление статистики
function updateStatsPanel() {
  updateUserStatsDisplay();
  updateAchievementsDisplay();
}

// Свайп жесты
let touchStartX = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].screenX;
  handleSwipe(touchEndX);
}, { passive: true });

function handleSwipe(touchEndX) {
  const swipeThreshold = 50;
  
  if (touchEndX > touchStartX + swipeThreshold && touchStartX < 50) {
    burgerMenu.classList.add('active');
    mobileMenu.classList.add('active');
  }
  
  if (touchStartX > touchEndX + swipeThreshold) {
    if (mobileMenu.classList.contains('active')) {
      burgerMenu.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
    hideAllPanels();
  }
}

function hideAllPanels() {
  [catalog, favorites, historyDiv, statsPanel, playerOverlay].forEach(panel => {
    panel.classList.remove('active');
  });
}

// Предотвращение масштабирования
document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) event.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) event.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

// Вспомогательная функция для поиска по тексту
Element.prototype.contains = function(text) {
  return this.textContent.includes(text);
};