const CIRC = 2 * Math.PI * 54;
const $ = (s) => document.querySelector(s);
const ring = $('#ring'), timeEl = $('#time'), labelEl = $('#label'), startBtn = $('#start');
ring.style.strokeDasharray = CIRC;


const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const today = () => new Date().toISOString().slice(0, 10);

/* ---------- Timer ---------- */
let label = 'Foco', total = 25 * 60, left = total, endAt = null, timer = null;

function render() {
  const m = String(Math.floor(left / 60)).padStart(2, '0');
  const s = String(left % 60).padStart(2, '0');
  timeEl.textContent = `${m}:${s}`;
  labelEl.textContent = label;
  ring.style.strokeDashoffset = CIRC * (1 - left / total);
  document.title = timer ? `${m}:${s} · ${label}` : 'FocusFlow';
  startBtn.textContent = timer ? 'Pausar' : 'Iniciar';
}

function start() {
  endAt = Date.now() + left * 1000; // usa o relógio real, não perde precisão
  timer = setInterval(() => {
    left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
    render();
    if (left === 0) finish();
  }, 250);
  render();
}
function pause() { clearInterval(timer); timer = null; render(); }
function toggle() { timer ? pause() : start(); }
function reset() { pause(); left = total; render(); }

function finish() {
  pause(); beep();
  if (label === 'Foco') addSession();
  left = total; render();
}

function beep() {
  try {
    const ctx = new AudioContext(), o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    o.start(); o.stop(ctx.currentTime + 1);
  } catch {}
}

$('#modes').addEventListener('click', (e) => {
  const b = e.target.closest('.mode');
  if (!b) return;
  document.querySelectorAll('.mode').forEach((x) => x.classList.toggle('active', x === b));
  pause();
  label = b.dataset.label;
  total = left = Number(b.dataset.min) * 60;
  render();
});
startBtn.addEventListener('click', toggle);
$('#reset').addEventListener('click', reset);
document.addEventListener('keydown', (e) => {
  const tag = e.target.tagName;
  if (e.code === 'Space' && tag !== 'INPUT' && tag !== 'BUTTON') { e.preventDefault(); toggle(); }
});


function sessions() {
  const d = store.get('ff-sessions', {});
  return d.date === today() ? d.count : 0;
}
function addSession() {
  store.set('ff-sessions', { date: today(), count: sessions() + 1 });
  $('#sessions').textContent = sessions();
}


let tasks = store.get('ff-tasks', []);
const list = $('#list');

function save() { store.set('ff-tasks', tasks); renderTasks(); }

function renderTasks() {
  list.replaceChildren(...tasks.map((t) => {
    const li = document.createElement('li');
    li.className = t.done ? 'done' : '';
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = t.done;
    cb.onchange = () => { t.done = cb.checked; save(); };
    const span = document.createElement('span');
    span.textContent = t.text; // textContent evita injeção de HTML
    const del = document.createElement('button');
    del.textContent = '✕'; del.setAttribute('aria-label', 'Remover tarefa');
    del.onclick = () => { tasks = tasks.filter((x) => x !== t); save(); };
    li.append(cb, span, del);
    return li;
  }));
  $('#left').textContent = tasks.filter((t) => !t.done).length;
}

$('#form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#input');
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  input.value = '';
  save();
});


$('#sessions').textContent = sessions();
renderTasks();
render();
