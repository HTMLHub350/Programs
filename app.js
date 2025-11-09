// Minimal interactive logic for the Programs gallery
// Features: search, theme toggle (persisted), preview, copy, download, toast notifications

const programs = [
  {
    id: "p1",
    title: "Hello World (HTML)",
    description: "A simple HTML document demonstrating structure.",
    lang: "HTML",
    code: `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Hello</title></head>
  <body><h1>Hello, world!</h1></body>
</html>`
  },
  {
    id: "p2",
    title: "Counter (JS)",
    description: "A tiny JavaScript counter example.",
    lang: "JavaScript",
    code: `let count = 0;
function increment(){
  count++;
  console.log('Count:', count);
}
increment();`
  },
  {
    id: "p3",
    title: "Styles Example (CSS)",
    description: "A small CSS snippet for a card.",
    lang: "CSS",
    code: `.card{
  background:#fff;
  border-radius:12px;
  padding:16px;
  box-shadow:0 6px 18px rgba(0,0,0,0.06);
}`
  }
];

const cardsEl = document.getElementById('cards');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const preview = document.getElementById('preview');
const previewCode = document.getElementById('previewCode');
const closePreview = document.getElementById('closePreview');
const copyBtn = document.getElementById('copyBtn');
const downloadLink = document.getElementById('downloadLink');
const toast = document.getElementById('toast');

function renderCards(list){
  cardsEl.innerHTML = '';
  if(list.length === 0){
    cardsEl.innerHTML = `<div class="card"><h3>No results</h3><p>Try a different search term.</p></div>`;
    return;
  }
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role','listitem');
    card.innerHTML = `
      <h3>${escapeHTML(p.title)}</h3>
      <p>${escapeHTML(p.description)}</p>
      <div class="meta">
        <span class="lang">${escapeHTML(p.lang)}</span>
        <div class="actions">
          <button class="btn open" data-id="${p.id}">Open</button>
          <button class="btn small" data-id="${p.id}" data-action="download">Save</button>
        </div>
      </div>
    `;
    cardsEl.appendChild(card);
  });
}

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function showPreview(program){
  previewCode.textContent = program.code;
  preview.classList.remove('hidden');
  preview.setAttribute('aria-hidden','false');
  downloadLink.href = `data:text/plain;charset=utf-8,${encodeURIComponent(program.code)}`;
  downloadLink.download = `${program.title.replace(/\s+/g,'_')}.txt`;
}

function hidePreview(){
  preview.classList.add('hidden');
  preview.setAttribute('aria-hidden','true');
}

function showToast(message, timeout = 2000){
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(()=> {
    toast.style.display = 'none';
  }, timeout);
}

// Search
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = programs.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.lang.toLowerCase().includes(q)
  );
  renderCards(filtered);
});

// Card actions (open / download)
cardsEl.addEventListener('click', (e) => {
  const openBtn = e.target.closest('button.open');
  if(openBtn){
    const id = openBtn.dataset.id;
    const program = programs.find(p=>p.id===id);
    if(program) showPreview(program);
    return;
  }
  const dlBtn = e.target.closest('button[data-action="download"]');
  if(dlBtn){
    const id = dlBtn.dataset.id;
    const program = programs.find(p=>p.id===id);
    if(program){
      const blob = new Blob([program.code], {type: 'text/plain;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${program.title.replace(/\s+/g,'_')}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Downloaded');
    }
  }
});

// Preview close / copy
closePreview.addEventListener('click', hidePreview);

copyBtn.addEventListener('click', async () => {
  try{
    await navigator.clipboard.writeText(previewCode.textContent);
    showToast('Code copied');
  }catch(e){
    showToast('Copy failed');
  }
});

// Theme toggle
function setTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  themeToggle.setAttribute('aria-pressed', String(t === 'dark'));
  themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', t);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
});

// init
(function init(){
  renderCards(programs);
  // restore theme
  const stored = localStorage.getItem('theme');
  if(stored === 'dark') setTheme('dark'); else setTheme('light');
})();
