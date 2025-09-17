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
const playerFrame = document.getElementById('playerFrame');
const fullscreenLikeBtn = document.getElementById('fullscreenLikeBtn');
const fullscreenTitle = document.getElementById('fullscreenTitle');
const fullscreenAnimeTitle = document.getElementById('fullscreenAnimeTitle');
const fullscreenAnimeDesc = document.getElementById('fullscreenAnimeDesc');
const mainScreen = document.getElementById('mainScreen');
const playerScreen = document.getElementById('playerScreen');
const ctaButton = document.querySelector('.cta-button');

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
let touchStartX = 0;
let currentPanel = null;

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
    initEventListeners();
    applyTheme(localStorage.getItem('theme') || 'dark');
  }, 1000);
});

// Инициализация всех обработчиков событий
function initEventListeners() {
  // Бургер меню
  burgerMenu.addEventListener('click', toggleMobileMenu);
  
  // Мобильное меню
  mobileCatalogBtn.addEventListener('click', () => {
    toggleCatalog(true);
    toggleMobileMenu();
  });
  
  mobileFavoritesBtn.addEventListener('click', () => {
    toggleFavorites(true);
    toggleMobileMenu();
  });
  
  mobileHistoryBtn.addEventListener('click', () => {
    toggleHistory(true);
    toggleMobileMenu();
  });
  
  mobileStatsBtn.addEventListener('click', () => {
    toggleStats(true);
    toggleMobileMenu();
  });
  
  mobileThemeBtn.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('light') ? 'dark' : 'light');
    toggleMobileMenu();
  });
  
  // Кнопка CTA
  ctaButton.addEventListener('click', () => toggleCatalog(true));
  
  // Опции
  optionsBtn.addEventListener('click', toggleOptions);
  
  // Кнопки опций
  themeBtn.addEventListener('click', toggleTheme);
  catalogBtn.addEventListener('click', () => toggleCatalog(true));
  favoritesBtn.addEventListener('click', () => toggleFavorites(true));
  historyBtn.addEventListener('click', () => toggleHistory(true));
  statsBtn.addEventListener('click', () => toggleStats(true));
  
  // Закрытие при клике вне области
  document.addEventListener('click', handleOutsideClick);
  
  // Профиль
  changeAvatarBtn.addEventListener('click', () => avatarInput.click());
  avatarInput.addEventListener('change', handleAvatarChange);
  usernameInput.addEventListener('blur', saveUserProfile);
  usernameInput.addEventListener('keypress', handleUsernameEnter);
  
  // Плеер
  fullscreenLikeBtn.addEventListener('click', handlePlayerLike);
  
  // Свайпы для панелей
  initSwipeListeners();
  
  // Предотвращение масштабирования
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('touchstart', handleTouchStart, { passive: false });
  document.addEventListener('touchend', handleTouchEnd, { passive: false });
}

// Инициализация свайпов для панелей
function initSwipeListeners() {
  [catalog, favorites, historyDiv, statsPanel].forEach(panel => {
    if (panel) {
      panel.addEventListener('touchstart', handlePanelTouchStart, { passive: true });
      panel.addEventListener('touchmove', handlePanelTouchMove, { passive: false });
      panel.addEventListener('touchend', handlePanelTouchEnd, { passive: true });
    }
  });
}

// Обработчики свайпов для панелей
function handlePanelTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  currentPanel = e.currentTarget;
}

function handlePanelTouchMove(e) {
  if (!currentPanel) return;
  
  const touchX = e.touches[0].clientX;
  const diff = touchX - touchStartX;
  
  // Блокируем вертикальный скролл при горизонтальном свайпе
  if (Math.abs(diff) > 10) {
    e.preventDefault();
  }
}

function handlePanelTouchEnd(e) {
  if (!currentPanel) return;
  
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchEndX - touchStartX;
  
  // Свайп влево для закрытия
  if (diff < -50) {
    closeCurrentPanel();
  }
  
  currentPanel = null;
}

function closeCurrentPanel() {
  if (currentPanel === catalog) toggleCatalog(false);
  else if (currentPanel === favorites) toggleFavorites(false);
  else if (currentPanel === historyDiv) toggleHistory(false);
  else if (currentPanel === statsPanel) toggleStats(false);
}

// Защита от быстрых нажатий
function buttonCooldown() {
  if (isButtonCooldown) return true;
  isButtonCooldown = true;
  setTimeout(() => { isButtonCooldown = false; }, 300);
  return false;
}

// Показать/скрыть прелоадер
function showPreloader(show) {
  if (!preloader) return;
  preloader.style.opacity = show ? '1' : '0';
  preloader.style.pointerEvents = show ? 'all' : 'none';
  if (!show) setTimeout(() => { 
    if (preloader) preloader.style.display = 'none'; 
  }, 500);
}

// Загрузка профиля
function loadUserProfile() {
  try {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (userAvatar) userAvatar.src = userProfile.avatar || 'https://via.placeholder.com/100';
    if (usernameInput) usernameInput.value = userProfile.username || 'Аниме-любитель';
  } catch (e) {
    console.error('Ошибка загрузки профиля:', e);
  }
}

// Сохранение профиля
function saveUserProfile() {
  try {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    userProfile.username = usernameInput?.value || 'Аниме-любитель';
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  } catch (e) {
    console.error('Ошибка сохранения профиля:', e);
  }
}

// Смена аватарки
function handleAvatarChange(e) {
  const file = e.target.files[0];
  if (file && userAvatar) {
    const reader = new FileReader();
    reader.onload = function(e) {
      userAvatar.src = e.target.result;
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      userProfile.avatar = e.target.result;
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    };
    reader.readAsDataURL(file);
  }
}

// Сохранение имени по Enter
function handleUsernameEnter(e) {
  if (e.key === 'Enter') {
    saveUserProfile();
    if (usernameInput) usernameInput.blur();
  }
}

// Мобильное меню
function toggleMobileMenu() {
  if (buttonCooldown()) return;
  burgerMenu.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  updateUserStatsDisplay();
}

// Опции
function toggleOptions() {
  if (buttonCooldown()) return;
  optionsPanel.classList.toggle('show');
}

// Обработка клика вне области
function handleOutsideClick(e) {
  // Закрытие опций
  if (optionsPanel && optionsPanel.classList.contains('show') && 
      !optionsPanel.contains(e.target) && 
      !optionsBtn.contains(e.target)) {
    optionsPanel.classList.remove('show');
  }
  
  // Закрытие мобильного меню
  if (mobileMenu && mobileMenu.classList.contains('active') && 
      !mobileMenu.contains(e.target) && 
      !burgerMenu.contains(e.target) &&
      e.target !== burgerMenu) {
    toggleMobileMenu();
  }
}

// Тема
function toggleTheme() {
  if (buttonCooldown()) return;
  applyTheme(document.body.classList.contains('light') ? 'dark' : 'light');
}

function applyTheme(theme) {
  document.body.className = theme === 'light' ? 'light' : '';
  localStorage.setItem('theme', theme);
}

// Переключение разделов
function toggleCatalog(show) { 
  if (!catalog) return;
  catalog.classList.toggle('active', show); 
  if (show) hideOtherPanels(catalog);
}

function toggleFavorites(show) { 
  if (!favorites) return;
  favorites.classList.toggle('active', show); 
  if (show) {
    hideOtherPanels(favorites);
    updateFavoritesList();
  }
}

function toggleHistory(show) { 
  if (!historyDiv) return;
  historyDiv.classList.toggle('active', show); 
  if (show) {
    hideOtherPanels(historyDiv);
    updateHistoryList();
  }
}

function toggleStats(show) { 
  if (!statsPanel) return;
  statsPanel.classList.toggle('active', show); 
  if (show) {
    hideOtherPanels(statsPanel);
    updateStatsPanel();
  }
}

function hideOtherPanels(currentPanel) {
  [catalog, favorites, historyDiv, statsPanel].forEach(panel => {
    if (panel && panel !== currentPanel) {
      panel.classList.remove('active');
    }
  });
  optionsPanel.classList.remove('show');
}

// Инициализация аниме-items
function initAnimeItems() {
  document.querySelectorAll('.anime-like-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const animeItem = this.closest('.anime-item');
      if (animeItem) {
        const title = animeItem.querySelector('h3')?.textContent;
        if (title) toggleLike(title, this);
      }
    });
  });
}

// Лайки
function toggleLike(title, btn = null) {
  try {
    const liked = JSON.parse(localStorage.getItem('likedAnime') || '{}');
    liked[title] = !liked[title];
    localStorage.setItem('likedAnime', JSON.stringify(liked));
    
    if (btn) {
      btn.classList.toggle('liked', liked[title]);
    }
    
    if (fullscreenLikeBtn && currentAnime === title) {
      fullscreenLikeBtn.classList.toggle('liked', liked[title]);
    }
    
    updateFavoritesList();
    checkAchievements();
  } catch (e) {
    console.error('Ошибка переключения лайка:', e);
  }
}

// Обновление избранного
function updateFavoritesList() {
  if (!favoritesList) return;
  
  try {
    const liked = JSON.parse(localStorage.getItem('likedAnime') || '{}');
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
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    userStats.totalFavorites = favoriteCount;
    localStorage.setItem('userStats', JSON.stringify(userStats));
    updateUserStatsDisplay();
  } catch (e) {
    console.error('Ошибка обновления избранного:', e);
  }
}

// История
function addToHistory(title) {
  try {
    let history = JSON.parse(localStorage.getItem('historyAnime') || '[]');
    if (!history.includes(title)) {
      history.unshift(title);
      if (history.length > 10) history.pop();
      localStorage.setItem('historyAnime', JSON.stringify(history));
      
      const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
      userStats.totalAnimeWatched = new Set(history).size;
      localStorage.setItem('userStats', JSON.stringify(userStats));
      
      checkAchievements();
    }
  } catch (e) {
    console.error('Ошибка добавления в историю:', e);
  }
}

function updateHistoryList() {
  if (!historyList) return;
  
  try {
    const history = JSON.parse(localStorage.getItem('historyAnime') || '[]');
    historyList.innerHTML = '';
    
    if (history.length === 0) {
      historyList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Здесь пока пусто</p>';
      return;
    }
    
    history.forEach(title => {
      const animeItem = createAnimeItem(title, false);
      historyList.appendChild(animeItem);
    });
  } catch (e) {
    console.error('Ошибка обновления истории:', e);
  }
}

function createAnimeItem(title, isLiked) {
  const item = document.createElement('div');
  item.className = 'anime-item';
  item.innerHTML = `
    <h3>${title}</h3>
    <button class="watch-btn" onclick="openAnime('${title.replace(/'/g, "\\'")}')">
      <i class="fa-solid fa-play"></i> Смотреть
    </button>
  `;
  return item;
}

// Система уровней
function addUserXp(amount) {
  try {
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    const oldLevel = userStats.level || 1;
    
    userStats.xp = (userStats.xp || 0) + amount;
    userStats.totalWatchTime = (userStats.totalWatchTime || 0) + amount;
    
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
  } catch (e) {
    console.error('Ошибка добавления XP:', e);
  }
}

function updateUserStatsDisplay() {
  try {
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    const progressPercent = ((userStats.xp || 0) / 1000) * 100;
    
    // Обновляем элементы
    [userLevelEl, statLevelEl, currentLevelEl].forEach(el => {
      if (el) el.textContent = userStats.level || 1;
    });
    
    [levelProgressEl, statLevelProgressEl].forEach(el => {
      if (el) el.style.width = `${progressPercent}%`;
    });
    
    if (currentXpEl) currentXpEl.textContent = Math.floor(userStats.xp || 0);
    if (totalWatchedEl) totalWatchedEl.textContent = Math.floor((userStats.totalWatchTime || 0) / 60);
    if (totalFavoritesEl) totalFavoritesEl.textContent = userStats.totalFavorites || 0;
    if (totalAnimeEl) totalAnimeEl.textContent = userStats.totalAnimeWatched || 0;
  } catch (e) {
    console.error('Ошибка обновления статистики:', e);
  }
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
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Достижения
function checkAchievements() {
  try {
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    const history = JSON.parse(localStorage.getItem('historyAnime') || '[]');
    const liked = JSON.parse(localStorage.getItem('likedAnime') || '{}');
    
    const achievements = {
      first_watch: history.length > 0,
      favorite: Object.values(liked).some(l => l),
      hour_watched: (userStats.totalWatchTime || 0) >= 3600,
      explorer: new Set(history).size >= 3
    };
    
    let earnedXp = 0;
    Object.entries(achievements).forEach(([key, achieved]) => {
      if (achieved && !userStats.achievements?.[key]) {
        if (!userStats.achievements) userStats.achievements = {};
        userStats.achievements[key] = true;
        earnedXp += 50;
      }
    });
    
    if (earnedXp > 0) {
      addUserXp(earnedXp);
      localStorage.setItem('userStats', JSON.stringify(userStats));
    }
  } catch (e) {
    console.error('Ошибка проверки достижений:', e);
  }
}

function updateAchievementsDisplay() {
  if (!achievementsList) return;
  
  try {
    const achievements = [
      { id: 'first_watch', name: 'Первый просмотр', icon: 'fa-play', description: 'Посмотрите первое аниме' },
      { id: 'favorite', name: 'Фанат', icon: 'fa-heart', description: 'Добавьте аниме в избранное' },
      { id: 'hour_watched', name: 'Киноман', icon: 'fa-clock', description: 'Посмотрите 1 час аниме' },
      { id: 'explorer', name: 'Исследователь', icon: 'fa-compass', description: 'Посмотрите 3+ разных аниме' }
    ];
    
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    achievementsList.innerHTML = '';
    
    achievements.forEach(achievement => {
      const achieved = userStats.achievements?.[achievement.id] || false;
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
  } catch (e) {
    console.error('Ошибка обновления достижений:', e);
  }
}

// Плеер - полноэкранный режим
function switchAnime(animeElement) {
  try {
    const src = animeElement.dataset.src;
    const title = animeElement.dataset.title;
    const desc = animeElement.dataset.desc;
    
    if (!src || !title) return;
    
    currentAnime = title;
    
    // Обновляем информацию в плеере
    if (fullscreenTitle) fullscreenTitle.textContent = title;
    if (fullscreenAnimeTitle) fullscreenAnimeTitle.textContent = title;
    if (fullscreenAnimeDesc) fullscreenAnimeDesc.textContent = desc;
    
    // Обновляем лайк
    const liked = JSON.parse(localStorage.getItem('likedAnime') || '{}');
    if (fullscreenLikeBtn) {
      fullscreenLikeBtn.classList.toggle('liked', liked[title]);
    }
    
    // Переключаемся на экран плеера
    if (mainScreen) mainScreen.classList.add('hidden');
    if (playerScreen) playerScreen.classList.remove('hidden');
    
    // Загружаем видео
    if (playerFrame) {
      playerFrame.src = src;
    }
    
    // Добавляем в историю и начисляем XP
    addToHistory(title);
    addUserXp(10);
    
    // Запускаем таймер просмотра
    startWatchTimer();
  } catch (e) {
    console.error('Ошибка переключения аниме:', e);
  }
}

function openAnime(title) {
  const animeItems = document.querySelectorAll('.anime-item');
  for (let item of animeItems) {
    const itemTitle = item.querySelector('h3')?.textContent;
    if (itemTitle === title) {
      switchAnime(item);
      break;
    }
  }
}

function closePlayer() {
  if (mainScreen) mainScreen.classList.remove('hidden');
  if (playerScreen) playerScreen.classList.add('hidden');
  if (playerFrame) playerFrame.src = '';
  stopWatchTimer();
}

function handlePlayerLike() {
  if (currentAnime) {
    toggleLike(currentAnime);
  }
}

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

// Touch события для основного контента
function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
  const touchEndX = e.changedTouches[0].clientX;
  handleSwipe(touchEndX);
}

function handleSwipe(touchEndX) {
  const swipeThreshold = 50;
  
  // Свайп слева направо для открытия меню
  if (touchEndX > touchStartX + swipeThreshold && touchStartX < 50) {
    if (burgerMenu && mobileMenu) {
      burgerMenu.classList.add('active');
      mobileMenu.classList.add('active');
      updateUserStatsDisplay();
    }
  }
  
  // Свайп справа налево для закрытия меню
  if (touchStartX > touchEndX + swipeThreshold && mobileMenu.classList.contains('active')) {
    toggleMobileMenu();
  }
}

// Глобальные функции для onclick
window.toggleCatalog = toggleCatalog;
window.toggleFavorites = toggleFavorites;
window.toggleHistory = toggleHistory;
window.switchAnime = switchAnime;
window.openAnime = openAnime;
window.closePlayer = closePlayer;