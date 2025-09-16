// Инициализация localStorage
if(!localStorage.getItem('likedAnime')) localStorage.setItem('likedAnime', JSON.stringify({}));
if(!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');

// Элементы
const optionsBtn = document.getElementById('optionsBtn');
const optionsPanel = document.getElementById('optionsPanel');
const themeBtn = document.getElementById('themeBtn');
const likeBtn = document.getElementById('likeBtn');
const catalogBtn = document.getElementById('catalogBtn');
const favoritesBtn = document.getElementById('favoritesBtn');

const catalog = document.getElementById('catalog');
const favorites = document.getElementById('favorites');
const favoritesList = document.getElementById('favorites-list');

const iframe = document.querySelector('.video-container iframe');
const animeInfo = document.querySelector('.anime-info');

// Применяем тему
function applyTheme(theme){
  document.body.className = theme === 'light' ? 'light' : '';
  localStorage.setItem('theme', theme);
}
applyTheme(localStorage.getItem('theme'));

// Опции
optionsBtn.addEventListener('click', ()=> optionsPanel.classList.toggle('show'));
document.addEventListener('click', (e)=>{
  if(!optionsPanel.contains(e.target) && !optionsBtn.contains(e.target)){
    optionsPanel.classList.remove('show');
  }
});
themeBtn.addEventListener('click', ()=> applyTheme(document.body.classList.contains('light') ? 'dark' : 'light'));

// Лайк
likeBtn.addEventListener('click', () => {
  const title = document.querySelector('.anime-title').innerText;
  let liked = JSON.parse(localStorage.getItem('likedAnime'));
  liked[title] = !liked[title];
  localStorage.setItem('likedAnime', JSON.stringify(liked));
  updateLikeBtn(title);
  updateFavoritesList();
});

function updateLikeBtn(title){
  const liked = JSON.parse(localStorage.getItem('likedAnime'));
  likeBtn.classList.toggle('liked', liked[title]);
}

// Каталог и Избранное
catalogBtn.addEventListener('click', ()=> toggleCatalog(true));
favoritesBtn.addEventListener('click', ()=> toggleFavorites(true));

function toggleCatalog(show){ catalog.classList.toggle('active', show); }
function toggleFavorites(show){ favorites.classList.toggle('active', show); updateFavoritesList(); }

function updateFavoritesList(){
  const liked = JSON.parse(localStorage.getItem('likedAnime'));
  favoritesList.innerHTML = '';
  for(let anime in liked){
    if(liked[anime]){
      const btn = document.createElement('button');
      btn.textContent = anime;
      btn.className = 'catalog-btn';
      btn.onclick = ()=> switchAnimeByTitle(anime);
      favoritesList.appendChild(btn);
    }
  }
}

// Плавная анимация переключения видео
function switchAnime(url, title, desc, btn){
  animeInfo.classList.remove('show');
  iframe.classList.remove('show');

  setTimeout(()=>{
    iframe.src = url;
    document.querySelector('.anime-title').innerText = title;
    document.querySelector('.anime-description').innerText = desc;
    iframe.onload = ()=> iframe.classList.add('show');
    animeInfo.classList.add('show');

    document.querySelectorAll('.catalog-btn').forEach(b=>b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    toggleCatalog(false);
    toggleFavorites(false);
    updateLikeBtn(title);
  }, 300);
}

function switchAnimeByTitle(title){
  const buttons = document.querySelectorAll('.catalog-btn');
  buttons.forEach(b=>{
    if(b.innerText === title){ b.click(); }
  });
}

// Инициализация
document.addEventListener('DOMContentLoaded', ()=>{
  iframe.classList.add('show');
  animeInfo.classList.add('show');
  updateLikeBtn(document.querySelector('.anime-title').innerText);
});
