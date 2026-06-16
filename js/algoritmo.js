// ============== Jogo de Construção de Algoritmos ==============

const ALGO_PUZZLES = [
  {
    title: '🦷 Escovar os dentes',
    desc: 'Coloque na ordem certa o jeito de escovar os dentinhos.',
    steps: [
      'Pegar a escova 🪥',
      'Colocar pasta de dente',
      'Escovar os dentes',
      'Bochechar com água 💧'
    ]
  },
  {
    title: '🥪 Fazer um sanduíche',
    desc: 'Como fazer um lanche gostoso?',
    steps: [
      'Pegar 2 fatias de pão 🍞',
      'Colocar o queijo 🧀',
      'Colocar o presunto 🥓',
      'Juntar as duas fatias'
    ]
  },
  {
    title: '🌱 Plantar uma flor',
    desc: 'Aprenda a sequência para plantar uma florzinha.',
    steps: [
      'Cavar um buraco no chão',
      'Colocar a semente 🌰',
      'Cobrir com terra',
      'Regar com água 💧'
    ]
  },
  {
    title: '👕 Se vestir',
    desc: 'Qual a ordem certa para colocar a roupa?',
    steps: [
      'Vestir a roupa de baixo',
      'Colocar a camiseta 👕',
      'Vestir a calça 👖',
      'Calçar os sapatos 👟'
    ]
  },
  {
    title: '🎂 Fazer um bolo',
    desc: 'Os passos para preparar um bolo delicioso!',
    steps: [
      'Misturar os ingredientes 🥣',
      'Colocar no forno 🔥',
      'Esperar assar ⏰',
      'Comer com a família 🎉'
    ]
  }
];

const state = {
  idx: 0,
  hits: 0,
  points: 0,
  puzzles: shuffle(ALGO_PUZZLES),
  current: [],
  checked: false
};

let dragSrc = null;

function getCorrect() { return state.puzzles[state.idx].steps; }

function render() {
  const p = state.puzzles[state.idx];
  document.getElementById('qNum').textContent = state.idx + 1;
  document.getElementById('qTotal').textContent = state.puzzles.length;
  document.getElementById('algoTitle').textContent = p.title;
  document.getElementById('algoDesc').textContent = p.desc;
  document.getElementById('hits').textContent = state.hits;
  document.getElementById('points').textContent = state.points;
  document.getElementById('progressBar').style.width = `${(state.idx / state.puzzles.length) * 100}%`;

  state.current = [];
  state.checked = false;
  document.getElementById('nextBtn').disabled = true;
  document.getElementById('feedback').className = 'feedback-area';

  // populate pool with shuffled steps
  const pool = document.getElementById('poolCol');
  pool.innerHTML = '';
  shuffle(p.steps).forEach(step => {
    pool.appendChild(makeItem(step, 'pool'));
  });

  document.getElementById('seqList').innerHTML = '';
  document.getElementById('seqEmpty').style.display = 'block';

  document.getElementById('dndArea').classList.remove('fade-in');
  void document.getElementById('dndArea').offsetWidth;
  document.getElementById('dndArea').classList.add('fade-in');
}

function makeItem(text, origin) {
  const div = document.createElement('div');
  div.className = 'dnd-item';
  div.draggable = true;
  div.dataset.text = text;
  div.dataset.origin = origin;
  div.innerHTML = `<span class="num"><i class="bi bi-grip-vertical"></i></span><span>${text}</span>`;
  div.addEventListener('dragstart', e => {
    dragSrc = div;
    div.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  div.addEventListener('dragend', () => {
    div.classList.remove('dragging');
    document.querySelectorAll('.drop-over').forEach(el => el.classList.remove('drop-over'));
  });
  div.addEventListener('click', () => {
    if (state.checked) return;
    if (div.dataset.origin === 'pool') {
      moveToSeq(div);
    } else {
      moveToPool(div);
    }
  });
  return div;
}

function setupDropZones() {
  ['poolCol', 'seqList'].forEach(id => {
    const zone = document.getElementById(id);
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.parentElement.classList.add('drop-over');
    });
    zone.addEventListener('dragleave', () => zone.parentElement.classList.remove('drop-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.parentElement.classList.remove('drop-over');
      if (!dragSrc || state.checked) return;
      if (id === 'seqList') {
        moveToSeq(dragSrc);
      } else {
        moveToPool(dragSrc);
      }
    });
  });
}

function moveToSeq(item) {
  const seq = document.getElementById('seqList');
  item.dataset.origin = 'seq';
  seq.appendChild(item);
  document.getElementById('seqEmpty').style.display = 'none';
  renumber();
}

function moveToPool(item) {
  document.getElementById('poolCol').appendChild(item);
  item.dataset.origin = 'pool';
  const num = item.querySelector('.num');
  num.innerHTML = '<i class="bi bi-grip-vertical"></i>';
  if (!document.getElementById('seqList').children.length) {
    document.getElementById('seqEmpty').style.display = 'block';
  }
}

function renumber() {
  document.querySelectorAll('#seqList .dnd-item').forEach((el, i) => {
    el.querySelector('.num').textContent = i + 1;
  });
}

function check() {
  const userOrder = Array.from(document.querySelectorAll('#seqList .dnd-item')).map(el => el.dataset.text);
  const correct = getCorrect();
  if (userOrder.length !== correct.length) {
    const fb = document.getElementById('feedback');
    fb.className = 'feedback-area show err';
    fb.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> <strong>Faltam passos!</strong> Use todos os ${correct.length} passos antes de verificar.`;
    return;
  }
  state.checked = true;
  const isCorrect = userOrder.every((v, i) => v === correct[i]);
  const fb = document.getElementById('feedback');
  if (isCorrect) {
    state.hits++;
    state.points += 20;
    fb.className = 'feedback-area show ok';
    fb.innerHTML = `<i class="bi bi-check-circle-fill"></i> <strong>Sequência correta!</strong> Você construiu o algoritmo certinho.`;
    document.querySelectorAll('#seqList .dnd-item').forEach(el => el.classList.add('dnd-item'));
  } else {
    fb.className = 'feedback-area show err';
    fb.innerHTML = `<i class="bi bi-x-circle-fill"></i> <strong>Ordem incorreta.</strong> A sequência correta é:<br><br>` +
      correct.map((s, i) => `<span class="d-block"><strong>${i + 1}.</strong> ${s}</span>`).join('');
    document.getElementById('dndArea').classList.add('shake');
    setTimeout(() => document.getElementById('dndArea').classList.remove('shake'), 400);
  }
  document.getElementById('points').textContent = state.points;
  document.getElementById('hits').textContent = state.hits;
  document.getElementById('nextBtn').disabled = false;
  document.querySelectorAll('.dnd-item').forEach(el => { el.draggable = false; el.style.cursor = 'default'; });
}

document.getElementById('checkBtn').addEventListener('click', check);
document.getElementById('resetBtn').addEventListener('click', () => {
  if (state.checked) return;
  render();
});
document.getElementById('nextBtn').addEventListener('click', () => {
  if (state.idx < state.puzzles.length - 1) {
    state.idx++;
    render();
  } else {
    finish();
  }
});

function finish() {
  document.getElementById('progressBar').style.width = '100%';
  addScore('algoritmo', state.points);
  const pct = (state.hits / state.puzzles.length) * 100;
  let title, msg, isWin;
  if (pct === 100) { title = 'Algoritmo perfeito!'; msg = 'Você pensou como um(a) programador(a) de verdade!'; isWin = true; }
  else if (pct >= 60) { title = 'Bom trabalho!'; msg = 'Você domina a estrutura sequencial.'; isWin = true; }
  else { title = 'Continue praticando!'; msg = 'Pensar passo a passo é a base de qualquer algoritmo.'; isWin = false; }
  showResultModal(`${title} ${state.hits}/${state.puzzles.length}`, msg, state.points, isWin);
}

setupDropZones();
render();
