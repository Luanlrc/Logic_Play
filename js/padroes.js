// ============== Jogo de Padrões (versão infantil 5-10 anos) ==============

const PATTERN_QUESTIONS = [
  {
    seq: '🍎 🍎 🍎 ?',
    explain: 'Sempre maçãs! 🍎',
    answer: '🍎',
    choices: ['🍎', '🍌', '🍇']
  },
  {
    seq: '🔴 🔵 🔴 🔵 ?',
    explain: 'Vermelho e azul se alternam.',
    answer: '🔴',
    choices: ['🔴', '🔵', '🟢']
  },
  {
    seq: '1, 2, 3, ?',
    explain: 'Estamos contando: 1, 2, 3, 4!',
    answer: '4',
    choices: ['4', '5', '6']
  },
  {
    seq: '⭐ ⭐⭐ ?',
    explain: 'Cada vez aparece uma estrelinha a mais.',
    answer: '⭐⭐⭐',
    choices: ['⭐', '⭐⭐⭐', '⭐⭐⭐⭐']
  },
  {
    seq: '🐶 🐱 🐶 🐱 ?',
    explain: 'Cachorro e gato se revezam!',
    answer: '🐶',
    choices: ['🐶', '🐱', '🐭']
  },
  {
    seq: '2, 4, 6, ?',
    explain: 'Vamos pulando de 2 em 2: 2, 4, 6, 8!',
    answer: '8',
    choices: ['7', '8', '9']
  },
  {
    seq: '🟦🟦🟨🟦🟦?',
    explain: 'A cada 2 azuis aparece 1 amarelo.',
    answer: '🟨',
    choices: ['🟦', '🟨', '🟥']
  },
  {
    seq: '5, 4, 3, ?',
    explain: 'Estamos contando para trás: 5, 4, 3, 2!',
    answer: '2',
    choices: ['1', '2', '6']
  },
  {
    seq: '☀️ 🌙 ☀️ 🌙 ?',
    explain: 'Dia e noite, um depois do outro.',
    answer: '☀️',
    choices: ['☀️', '🌙', '⭐']
  },
  {
    seq: 'A B A B ?',
    explain: 'Sempre A depois B, então volta o A!',
    answer: 'A',
    choices: ['A', 'B', 'C']
  }
];

const state = {
  idx: 0,
  hits: 0,
  points: 0,
  questions: shuffle(PATTERN_QUESTIONS),
  answered: false
};

const POINTS_PER_HIT = 10;

function render() {
  const q = state.questions[state.idx];
  document.getElementById('qNum').textContent = state.idx + 1;
  document.getElementById('qTotal').textContent = state.questions.length;
  document.getElementById('hits').textContent = state.hits;
  document.getElementById('points').textContent = state.points;
  document.getElementById('qSeq').textContent = q.seq;
  document.getElementById('progressBar').style.width = `${((state.idx) / state.questions.length) * 100}%`;

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  shuffle(q.choices).forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = c;
    btn.onclick = () => handleAnswer(btn, c, q);
    choicesEl.appendChild(btn);
  });

  document.getElementById('feedback').className = 'feedback-area';
  document.getElementById('feedback').textContent = '';
  document.getElementById('nextBtn').disabled = true;
  document.getElementById('questionBox').classList.remove('fade-in');
  void document.getElementById('questionBox').offsetWidth;
  document.getElementById('questionBox').classList.add('fade-in');
  state.answered = false;
}

function handleAnswer(btn, value, q) {
  if (state.answered) return;
  state.answered = true;
  const buttons = document.querySelectorAll('.choice');
  buttons.forEach(b => {
    b.disabled = true;
    if (b.textContent === q.answer) b.classList.add('correct');
  });

  const fb = document.getElementById('feedback');
  if (value === q.answer) {
    btn.classList.add('correct');
    state.hits++;
    state.points += POINTS_PER_HIT;
    fb.className = 'feedback-area show ok';
    fb.innerHTML = `<i class="bi bi-check-circle-fill"></i> <strong>Muito bem! 🎉</strong> ${q.explain}`;
  } else {
    btn.classList.add('wrong');
    document.getElementById('questionBox').classList.add('shake');
    setTimeout(() => document.getElementById('questionBox').classList.remove('shake'), 400);
    fb.className = 'feedback-area show err';
    fb.innerHTML = `<i class="bi bi-x-circle-fill"></i> <strong>Quase! A resposta certa é ${q.answer}.</strong> ${q.explain}`;
  }

  document.getElementById('points').textContent = state.points;
  document.getElementById('hits').textContent = state.hits;
  document.getElementById('nextBtn').disabled = false;
}

document.getElementById('nextBtn').addEventListener('click', () => {
  if (state.idx < state.questions.length - 1) {
    state.idx++;
    render();
  } else {
    finish();
  }
});

function finish() {
  document.getElementById('progressBar').style.width = '100%';
  addScore('padroes', state.points);
  const pct = (state.hits / state.questions.length) * 100;
  let title, msg, isWin;
  if (pct === 100) { title = 'Uau! Você é demais! 🏆'; msg = 'Acertou tudo! Você é um(a) campeão(ã) dos padrões!'; isWin = true; }
  else if (pct >= 70) { title = 'Muito bem! 🌟'; msg = 'Você está mandando super bem!'; isWin = true; }
  else if (pct >= 40) { title = 'Continue tentando! 💪'; msg = 'Você está aprendendo, isso é o mais importante!'; isWin = false; }
  else { title = 'Vamos jogar de novo! 🎮'; msg = 'A prática faz a gente melhorar!'; isWin = false; }
  showResultModal(`${title} ${state.hits}/${state.questions.length}`, msg, state.points, isWin);
}

render();
