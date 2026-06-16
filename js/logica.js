// ============== Jogo de Lógica (versão infantil 5-10 anos) ==============

const LOGIC_QUESTIONS = [
  {
    q: 'Qual desses animais é o MAIOR? 🦁',
    answer: '🐘',
    choices: ['🐭', '🐱', '🐘'],
    explain: 'O elefante é o maior de todos! 🐘'
  },
  {
    q: 'Qual é a fruta? 🍴',
    answer: '🍌',
    choices: ['🍌', '🚗', '⚽'],
    explain: 'A banana é uma fruta deliciosa! 🍌'
  },
  {
    q: 'Qual é o número MAIOR?',
    answer: '9',
    choices: ['3', '9', '5'],
    explain: '9 é maior que 5 e 3!'
  },
  {
    q: 'Qual NÃO voa? 🦋',
    answer: '🐟',
    choices: ['🐦', '🦋', '🐟'],
    explain: 'O peixe nada, não voa! 🐟'
  },
  {
    q: 'O que usamos para escrever? ✏️',
    answer: '✏️',
    choices: ['🍕', '✏️', '👟'],
    explain: 'O lápis serve para escrever e desenhar!'
  },
  {
    q: 'Qual é o número MENOR?',
    answer: '1',
    choices: ['7', '1', '4'],
    explain: '1 é o menor de todos!'
  },
  {
    q: 'Qual cor é o céu durante o dia? ☀️',
    answer: '🟦',
    choices: ['🟥', '🟦', '🟩'],
    explain: 'O céu é azul durante o dia!'
  },
  {
    q: 'Qual é um meio de transporte? 🚦',
    answer: '🚗',
    choices: ['🍎', '🚗', '📚'],
    explain: 'O carro é um meio de transporte!'
  }
];

const state = {
  idx: 0,
  hits: 0,
  points: 0,
  questions: shuffle(LOGIC_QUESTIONS),
  answered: false
};

const POINTS_PER_HIT = 15;

function render() {
  const q = state.questions[state.idx];
  document.getElementById('qNum').textContent = state.idx + 1;
  document.getElementById('qTotal').textContent = state.questions.length;
  document.getElementById('hits').textContent = state.hits;
  document.getElementById('points').textContent = state.points;
  document.getElementById('qText').textContent = q.q;
  document.getElementById('progressBar').style.width = `${(state.idx / state.questions.length) * 100}%`;

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
  document.getElementById('nextBtn').disabled = true;
  document.getElementById('questionBox').classList.remove('fade-in');
  void document.getElementById('questionBox').offsetWidth;
  document.getElementById('questionBox').classList.add('fade-in');
  state.answered = false;
}

function handleAnswer(btn, value, q) {
  if (state.answered) return;
  state.answered = true;
  document.querySelectorAll('.choice').forEach(b => {
    b.disabled = true;
    if (b.textContent === q.answer) b.classList.add('correct');
  });
  const fb = document.getElementById('feedback');
  if (value === q.answer) {
    btn.classList.add('correct');
    state.hits++;
    state.points += POINTS_PER_HIT;
    fb.className = 'feedback-area show ok';
    fb.innerHTML = `<i class="bi bi-check-circle-fill"></i> <strong>Acertou! 🎉</strong> ${q.explain}`;
  } else {
    btn.classList.add('wrong');
    document.getElementById('questionBox').classList.add('shake');
    setTimeout(() => document.getElementById('questionBox').classList.remove('shake'), 400);
    fb.className = 'feedback-area show err';
    fb.innerHTML = `<i class="bi bi-x-circle-fill"></i> <strong>Quase!</strong> ${q.explain}`;
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
  addScore('logica', state.points);
  const pct = (state.hits / state.questions.length) * 100;
  let title, msg, isWin;
  if (pct === 100) { title = 'Incrível! 🏆'; msg = 'Você é um(a) mestre da lógica!'; isWin = true; }
  else if (pct >= 70) { title = 'Muito bem! 🌟'; msg = 'Você pensou super bem!'; isWin = true; }
  else if (pct >= 40) { title = 'Bom esforço! 💪'; msg = 'Continue praticando que você vai longe!'; isWin = false; }
  else { title = 'Vamos jogar de novo! 🎮'; msg = 'Cada tentativa te deixa mais forte!'; isWin = false; }
  showResultModal(`${title} ${state.hits}/${state.questions.length}`, msg, state.points, isWin);
}

render();
