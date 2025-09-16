// Инициализация localStorage
if (!localStorage.getItem('likedAnime')) localStorage.setItem('likedAnime', JSON.stringify({}));
if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');
if (!localStorage.getItem('historyAnime')) localStorage.setItem('historyAnime', JSON.stringify([]));
if (!localStorage.getItem('lastAnime')) localStorage.setItem('lastAnime', '');
if (!localStorage.getItem('cacheData')) localStorage.setItem('cacheData', JSON.stringify({}));

// Элементы
const optionsBtn = document.getElementById('optionsBtn');
const optionsPanel = document.getElementById('optionsPanel');
const themeBtn = document.getElementById('themeBtn');
const likeBtn = document.getElementById('likeBtn');
const catalogBtn = document.getElementById('catalogBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const historyBtn = document.getElementById('historyBtn');
const resumeBtn = document.getElementById('resumeBtn');
const burgerMenu = document.getElementById('burgerMenu');
const mobileMenu = document.getElementById('mobileMenu');
const mobileCatalogBtn = document.getElementById('mobileCatalogBtn');
const mobileFavoritesBtn = document.getElementById('mobileFavoritesBtn');
const mobileHistoryBtn = document.getElementById('mobileHistoryBtn');
const mobileThemeBtn = document.getElementById('mobileThemeBtn');

const catalog = document.getElementById('catalog');
const favorites = document.getElementById('favorites');
const historyDiv = document.getElementById('history');
const favoritesList = document.getElementById('favorites-list');
const historyList = document.getElementById('history-list');
const preloader = document.getElementById('preloader');

const iframe = document.querySelector('.video-container iframe');
const animeInfo = document.querySelector('.anime-info');

// Защита от быстрых многократных нажатий
let isButtonCooldown = false;
function buttonCooldown() {
  if (isButtonCooldown) return true;
  isButtonCooldown = true;
  setTimeout(() => { isButtonCooldown = false; }, 300);
  return false;
}

// Применяем тему
function applyTheme(theme) {
    document.body.className = theme === 'light' ? 'light' : '';
    localStorage.setItem('theme', theme);
}
applyTheme(localStorage.getItem('theme'));

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

// Бургер меню
burgerMenu.addEventListener('click', () => {
  if (buttonCooldown()) return;
  burgerMenu.classList.toggle('active');
  mobileMenu.classList.toggle('active');
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

// Лайк / Избранное
likeBtn.addEventListener('click', () => {
  if (buttonCooldown()) return;
  const title = document.querySelector('.anime-title').innerText;
  let liked = JSON.parse(localStorage.getItem('likedAnime'));
  liked[title] = !liked[title];
  localStorage.setItem('likedAnime', JSON.stringify(liked));
  updateLikeBtn(title);
  updateFavoritesList();
});

function updateLikeBtn(title) {
    const liked = JSON.parse(localStorage.getItem('likedAnime'));
    likeBtn.classList.toggle('liked', liked[title]);
}

// Каталог, Избранное, История
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

resumeBtn.addEventListener('click', () => {
  if (buttonCooldown()) return;
  continueWatching();
});

function toggleCatalog(show) { 
  catalog.classList.toggle('active', show); 
  if (show) {
    favorites.classList.remove('active');
    historyDiv.classList.remove('active');
  }
}

function toggleFavorites(show) { 
  favorites.classList.toggle('active', show); 
  if (show) {
    catalog.classList.remove('active');
    historyDiv.classList.remove('active');
    updateFavoritesList();
  }
}

function toggleHistory(show) { 
  historyDiv.classList.toggle('active', show); 
  if (show) {
    catalog.classList.remove('active');
    favorites.classList.remove('active');
    updateHistoryList();
  }
}

function updateFavoritesList() {
    const liked = JSON.parse(localStorage.getItem('likedAnime'));
    favoritesList.innerHTML = '';
    for (let anime in liked) {
        if (liked[anime]) {
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
}

function addToHistory(title) {
    let history = JSON.parse(localStorage.getItem('historyAnime'));
    if (!history.includes(title)) {
        history.unshift(title);
        if (history.length > 10) history.pop();
        localStorage.setItem('historyAnime', JSON.stringify(history));
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

// Продолжить просмотр
function continueWatching() {
    const last = localStorage.getItem('lastAnime');
    if (last) switchAnimeByTitle(last);
}

// Кэширование данных
function cacheData(key, data) {
  const cache = JSON.parse(localStorage.getItem('cacheData'));
  cache[key] = {
    data: data,
    timestamp: Date.now()
  };
  localStorage.setItem('cacheData', JSON.stringify(cache));
}

function getCachedData(key, maxAge = 3600000) { // 1 час по умолчанию
  const cache = JSON.parse(localStorage.getItem('cacheData'));
  if (cache[key] && (Date.now() - cache[key].timestamp) < maxAge) {
    return cache[key].data;
  }
  return null;
}

// Плавная анимация переключения видео и текста
function switchAnime(url, title, desc, btn) {
  showPreloader(true);
  
  animeInfo.classList.remove('show');
  iframe.classList.remove('show');

  setTimeout(() => {
      iframe.src = url;
      document.querySelector('.anime-title').innerText = title;
      document.querySelector('.anime-description').innerText = desc;
      
      iframe.onload = () => {
        iframe.classList.add('show');
        animeInfo.classList.add('show');
        showPreloader(false);
      };
      
      document.querySelectorAll('.catalog-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');

      toggleCatalog(false);
      toggleFavorites(false);
      toggleHistory(false);

      updateLikeBtn(title);
      addToHistory(title);
      localStorage.setItem('lastAnime', title);
      
      // Кэшируем данные об аниме
      cacheData(`anime_${title}`, {url, desc});
  }, 300);
}

function switchAnimeByTitle(title) {
    const buttons = document.querySelectorAll('.catalog-btn');
    buttons.forEach(b => {
        if (b.innerText === title) { 
          // Проверяем кэш перед переключением
          const cachedData = getCachedData(`anime_${title}`);
          if (cachedData) {
            switchAnime(cachedData.url, title, cachedData.desc, b);
          } else {
            b.click(); 
          }
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
       historyDiv.classList.contains('active'))) {
    toggleCatalog(false);
    toggleFavorites(false);
    toggleHistory(false);
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Скрываем прелоадер после загрузки страницы
  setTimeout(() => {
    showPreloader(false);
    iframe.classList.add('show');
    animeInfo.classList.add('show');
    const currentTitle = document.querySelector('.anime-title').innerText;
    updateLikeBtn(currentTitle);
    addToHistory(currentTitle);
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

// Ленивая загрузка
document.addEventListener("DOMContentLoaded", function() {
  var lazyFrames = [].slice.call(document.querySelectorAll("iframe"));
  
  if ("IntersectionObserver" in window) {
    var lazyFrameObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var lazyFrame = entry.target;
          lazyFrame.src = lazyFrame.dataset.src;
          lazyFrameObserver.unobserve(lazyFrame);
        }
      });
    });

    lazyFrames.forEach(function(lazyFrame) {
      lazyFrameObserver.observe(lazyFrame);
    });
  }
});