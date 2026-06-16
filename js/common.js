// ============== LogicPlay - Common JS ==============

// Score helpers (localStorage)
const LP_STORAGE_KEY = 'logicplay_progress';
const LP_MAX_TOTAL_SCORE = 99999;
const LP_MAX_HIGH_SCORE = 9999;
const LP_MAX_PLAYS = 999;

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(LP_STORAGE_KEY)) || {
      totalScore: 0,
      games: {},
      stars: 0
    };
  } catch (e) {
    return { totalScore: 0, games: {}, stars: 0 };
  }
}

function saveProgress(progress) {
  localStorage.setItem(LP_STORAGE_KEY, JSON.stringify(progress));
}

function addScore(gameId, points) {
  const p = getProgress();
  p.totalScore = Math.min((p.totalScore || 0) + points, LP_MAX_TOTAL_SCORE);
  if (!p.games[gameId]) p.games[gameId] = { highScore: 0, plays: 0 };
  p.games[gameId].plays = Math.min((p.games[gameId].plays || 0) + 1, LP_MAX_PLAYS);
  if (points > p.games[gameId].highScore) {
    p.games[gameId].highScore = Math.min(points, LP_MAX_HIGH_SCORE);
  }
  saveProgress(p);
  updateNavbarScore();
  return p;
}

function updateNavbarScore() {
  const el = document.getElementById('navTotalScore');
  if (el) {
    const p = getProgress();
    const s = p.totalScore || 0;
    el.textContent = s >= LP_MAX_TOTAL_SCORE ? LP_MAX_TOTAL_SCORE + '+' : s;
  }
}

function resetProgress() {
  localStorage.removeItem(LP_STORAGE_KEY);
  updateNavbarScore();
}

// Show victory modal
function showResultModal(title, message, score, isWin = true) {
  const modal = document.getElementById('resultModal');
  if (!modal) return;
  document.getElementById('resultTrophy').textContent = isWin ? '🏆' : '💡';
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultMessage').textContent = message;
  document.getElementById('resultScore').textContent = score;
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

// Highlight active nav link
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.lp-navbar .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
  updateNavbarScore();
});

// Shuffle helper
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
