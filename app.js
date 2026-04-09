// GameAppCeLu Hub - Logic Engine

// Initial State
const DEFAULT_GAMES = [
    {
        id: 'mutant-city',
        title: 'Mutant City',
        desc: 'Un mundo post-apocalíptico donde la supervivencia es el único objetivo. Explora las ruinas de la civilización.',
        url: 'https://mutancyti.example.com',
        thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'neon-runner',
        title: 'Neon Runner',
        desc: 'Velocidad y reflejos en una ciudad futurista. Corre contra el tiempo y los obstáculos cibernéticos.',
        url: 'https://neonrunner.example.com',
        thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800'
    }
];

let games = JSON.parse(localStorage.getItem('gameappcelu_games')) || DEFAULT_GAMES;
let isLoggedIn = localStorage.getItem('gameappcelu_admin') === 'true';

// DOM Elements
const gameGrid = document.getElementById('game-grid');
const uploadModal = document.getElementById('upload-modal');
const modalTitle = document.getElementById('modal-title');
const loginView = document.getElementById('login-view');
const uploadView = document.getElementById('upload-view');
const openUploadBtn = document.getElementById('open-upload');
const closeModalBtn = document.querySelector('.close-modal');
const loginForm = document.getElementById('login-form');
const uploadForm = document.getElementById('upload-form');
const logoutBtn = document.getElementById('admin-logout');
const searchInput = document.getElementById('game-search');

// Functions
function updateModalView() {
    if (isLoggedIn) {
        modalTitle.textContent = 'Subir Nuevo Juego';
        loginView.classList.add('hidden');
        uploadView.classList.remove('hidden');
    } else {
        modalTitle.textContent = 'Acceso de Administrador';
        loginView.classList.remove('hidden');
        uploadView.classList.add('hidden');
    }
}

function renderGames(filterTerm = '') {
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(filterTerm.toLowerCase()) ||
        game.desc.toLowerCase().includes(filterTerm.toLowerCase())
    );

    gameGrid.innerHTML = filteredGames.map((game, index) => `
        <article class="game-card" style="animation-delay: ${index * 0.1}s">
            <img src="${game.thumb || 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=800'}" alt="${game.title}" class="game-thumb">
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>${game.desc}</p>
                <a href="${game.url}" target="_blank" class="game-link">
                    Jugar Ahora <i data-lucide="external-link"></i>
                </a>
            </div>
        </article>
    `).join('');

    // Re-initialize icons for new content
    if (window.lucide) {
        lucide.createIcons();
    }
}

function saveGames() {
    localStorage.setItem('gameappcelu_games', JSON.stringify(games));
}

// Event Listeners
openUploadBtn.addEventListener('click', () => {
    updateModalView();
    uploadModal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
    uploadModal.classList.remove('active');
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
        uploadModal.classList.remove('active');
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    if (user === 'admin' && pass === 'admin1231') {
        isLoggedIn = true;
        localStorage.setItem('gameappcelu_admin', 'true');
        updateModalView();
        // Feedback visual simple
        const btn = loginForm.querySelector('button');
        btn.textContent = '¡Acceso Concedido!';
        btn.style.background = '#22c55e';
        setTimeout(() => {
            btn.textContent = 'Verificar Identidad';
            btn.style.background = '';
        }, 2000);
    } else {
        alert('Credenciales incorrectas');
    }
});

logoutBtn.addEventListener('click', () => {
    isLoggedIn = false;
    localStorage.removeItem('gameappcelu_admin');
    updateModalView();
    uploadModal.classList.remove('active');
});

uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newGame = {
        id: Date.now().toString(),
        title: document.getElementById('game-title').value,
        url: document.getElementById('game-url').value,
        thumb: document.getElementById('game-thumb').value,
        desc: document.getElementById('game-desc').value
    };

    games.unshift(newGame);
    saveGames();
    renderGames();
    
    uploadForm.reset();
    uploadModal.classList.remove('active');

    // Simple success feedback
    alert('¡Juego subido con éxito!');
});

searchInput.addEventListener('input', (e) => {
    renderGames(e.target.value);
});

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderGames();
});
