// ============== Jogo do Robô Programável ==============

// 0 = livre, 1 = parede, R = robô, G = objetivo
const LEVELS = [
  {
    grid: [
      ['R', 0, 'G']
    ],
    optimalSteps: 2,
    hint: 'Aperte a seta da DIREITA duas vezes!'
  },
  {
    grid: [
      ['R', 0, 0],
      [0,   0, 0],
      [0,   0, 'G']
    ],
    optimalSteps: 4,
    hint: 'Vá para a direita e depois para baixo!'
  },
  {
    grid: [
      ['R', 0, 0, 0],
      [0,   1, 1, 0],
      [0,   0, 0, 'G']
    ],
    optimalSteps: 5,
    hint: 'Cuidado com as paredes pretas!'
  },
  {
    grid: [
      ['R', 0, 0, 0],
      [1,   1, 1, 0],
      [0,   0, 0, 0],
      ['G', 0, 0, 0]
    ],
    optimalSteps: 6,
    hint: 'Dê a volta nas paredes!'
  }
];

const state = {
  idx: 0,
  hits: 0,
  points: 0,
  commands: [],
  robotPos: null,
  goal: null,
  running: false,
  solved: false
};

const ICON = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };
const LABEL = { up: 'Cima', down: 'Baixo', left: 'Esq.', right: 'Dir.' };

function findCells(grid) {
  let robot = null, goal = null;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 'R') robot = { r, c };
      if (grid[r][c] === 'G') goal = { r, c };
    }
  }
  return { robot, goal };
}

function renderMaze() {
  const level = LEVELS[state.idx];
  const grid = level.grid;
  const rows = grid.length;
  const cols = grid[0].length;
  const m = document.getElementById('mazeGrid');
  m.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  m.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  m.innerHTML = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'maze-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      if (grid[r][c] === 1) cell.classList.add('wall');
      if (state.goal.r === r && state.goal.c === c) {
        cell.classList.add('goal');
        cell.textContent = '🎯';
      }
      if (state.robotPos.r === r && state.robotPos.c === c) {
        cell.classList.add('robot');
        cell.textContent = '🤖';
      }
      m.appendChild(cell);
    }
  }
}

function renderQueue() {
  const q = document.getElementById('cmdQueue');
  if (!state.commands.length) {
    q.innerHTML = '<span class="cmd-empty">Clique nos comandos para programar o robô...</span>';
  } else {
    q.innerHTML = state.commands.map((c, i) =>
      `<span class="cmd-chip">${i + 1}. ${ICON[c]} ${LABEL[c]}</span>`
    ).join('');
  }
  document.getElementById('cmdCount').textContent = `(${state.commands.length} comando${state.commands.length === 1 ? '' : 's'})`;
}

function loadLevel() {
  const level = LEVELS[state.idx];
  const { robot, goal } = findCells(level.grid);
  state.robotPos = { ...robot };
  state.goal = { ...goal };
  state.commands = [];
  state.solved = false;
  state.running = false;

  document.getElementById('phaseNum').textContent = state.idx + 1;
  document.getElementById('phaseTotal').textContent = LEVELS.length;
  document.getElementById('progressBar').style.width = `${(state.idx / LEVELS.length) * 100}%`;
  document.getElementById('hits').textContent = state.hits;
  document.getElementById('points').textContent = state.points;
  document.getElementById('feedback').className = 'feedback-area';
  document.getElementById('nextBtn').disabled = true;
  const hintEl = document.getElementById('levelHint');
  if (hintEl) hintEl.textContent = level.hint || '';
  setControlsEnabled(true);
  renderMaze();
  renderQueue();
}

function setControlsEnabled(en) {
  document.querySelectorAll('.cmd-btn').forEach(b => b.disabled = !en);
  document.getElementById('undoBtn').disabled = !en;
  document.getElementById('clearBtn').disabled = !en;
  document.getElementById('runBtn').disabled = !en;
}

document.querySelectorAll('.cmd-btn').forEach(b => {
  b.addEventListener('click', () => {
    if (state.running || state.solved) return;
    state.commands.push(b.dataset.cmd);
    renderQueue();
  });
});

document.getElementById('undoBtn').addEventListener('click', () => {
  if (state.running || state.solved) return;
  state.commands.pop();
  renderQueue();
});

document.getElementById('clearBtn').addEventListener('click', () => {
  if (state.running || state.solved) return;
  state.commands = [];
  renderQueue();
});

document.getElementById('runBtn').addEventListener('click', async () => {
  if (state.running || state.solved) return;
  if (!state.commands.length) {
    showFb('err', '<i class="bi bi-info-circle"></i> Adicione comandos antes de executar.');
    return;
  }
  state.running = true;
  setControlsEnabled(false);

  // Reset robot to start
  const { robot } = findCells(LEVELS[state.idx].grid);
  state.robotPos = { ...robot };
  renderMaze();

  let crashed = false;
  for (const cmd of state.commands) {
    await sleep(300);
    const next = { ...state.robotPos };
    if (cmd === 'up') next.r--;
    if (cmd === 'down') next.r++;
    if (cmd === 'left') next.c--;
    if (cmd === 'right') next.c++;

    const grid = LEVELS[state.idx].grid;
    if (next.r < 0 || next.r >= grid.length || next.c < 0 || next.c >= grid[0].length) {
      crashed = 'Saiu do mapa!';
      break;
    }
    if (grid[next.r][next.c] === 1) {
      crashed = 'Bateu em uma parede!';
      break;
    }
    state.robotPos = next;
    renderMaze();

    if (state.robotPos.r === state.goal.r && state.robotPos.c === state.goal.c) break;
  }

  state.running = false;

  if (crashed) {
    document.getElementById('mazeGrid').classList.add('shake');
    setTimeout(() => document.getElementById('mazeGrid').classList.remove('shake'), 400);
    showFb('err', `<i class="bi bi-x-circle-fill"></i> <strong>Ops! ${crashed}</strong> Tente outro caminho! 💪`);
    setControlsEnabled(true);
  } else if (state.robotPos.r === state.goal.r && state.robotPos.c === state.goal.c) {
    state.solved = true;
    state.hits++;
    const optimal = LEVELS[state.idx].optimalSteps;
    const used = state.commands.length;
    let bonus = 0;
    if (used <= optimal) bonus = 10;
    state.points += 25 + bonus;
    document.getElementById('hits').textContent = state.hits;
    document.getElementById('points').textContent = state.points;
    showFb('ok', `<i class="bi bi-check-circle-fill"></i> <strong>Boa! O robô chegou! 🎉</strong> ${bonus ? `Caminho perfeito: +${bonus} pontos de bônus!` : `Você usou ${used} setinhas.`}`);
    document.getElementById('nextBtn').disabled = false;
  } else {
    showFb('err', `<i class="bi bi-info-circle"></i> As setinhas acabaram, mas o robô não chegou! Tente de novo. 💪`);
    setControlsEnabled(true);
  }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (state.idx < LEVELS.length - 1) {
    state.idx++;
    loadLevel();
  } else {
    finish();
  }
});

function showFb(kind, html) {
  const fb = document.getElementById('feedback');
  fb.className = `feedback-area show ${kind}`;
  fb.innerHTML = html;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function finish() {
  document.getElementById('progressBar').style.width = '100%';
  addScore('robo', state.points);
  const pct = (state.hits / LEVELS.length) * 100;
  let title, msg, isWin;
  if (pct === 100) { title = 'Programador(a) nato(a)!'; msg = 'Você dominou o pensamento computacional!'; isWin = true; }
  else if (pct >= 50) { title = 'Boa programação!'; msg = 'Continue treinando para fechar todas as fases.'; isWin = true; }
  else { title = 'Quase lá!'; msg = 'Pensar em sequência leva tempo — tente de novo!'; isWin = false; }
  showResultModal(`${title} ${state.hits}/${LEVELS.length}`, msg, state.points, isWin);
}

loadLevel();
