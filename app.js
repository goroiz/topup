const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const rupiah = n => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n).replace(",00","");

/* ===== Data ===== */
const GAMES = [
  { id:'ml', name:'Mobile Legends', tags:['popular','moba'], img:'assets/img/game-placeholder.jpg' },
  { id:'ff', name:'Free Fire', tags:['popular','battle-royale'], img:'assets/img/game-placeholder.jpg' },
  { id:'genshin', name:'Genshin Impact', tags:['popular','rpg'], img:'assets/img/game-placeholder.jpg' },
  { id:'roblox', name:'Roblox', tags:['popular','sandbox'], img:'assets/img/game-placeholder.jpg' },
  { id:'valorant', name:'VALORANT', tags:['new','fps'], img:'assets/img/game-placeholder.jpg' },
  { id:'pubg', name:'PUBG Mobile', tags:['battle-royale'], img:'assets/img/game-placeholder.jpg' },
  { id:'hsr', name:'Honkai: Star Rail', tags:['new','rpg'], img:'assets/img/game-placeholder.jpg' },
  { id:'codm', name:'Call of Duty: Mobile', tags:['fps'], img:'assets/img/game-placeholder.jpg' },
  { id:'steam', name:'Voucher Steam', tags:['voucher'], img:'assets/img/game-placeholder.jpg' },
  { id:'ps', name:'PSN Wallet', tags:['voucher'], img:'assets/img/game-placeholder.jpg' },
];

/* Denoms & payments */
const DENOMS = [
  {label:'50', value:50, price:15000},
  {label:'100', value:100, price:28000},
  {label:'140', value:140, price:39000},
  {label:'210', value:210, price:56000},
  {label:'355', value:355, price:89000},
  {label:'500', value:500, price:125000},
  {label:'720', value:720, price:175000},
  {label:'860', value:860, price:199000},
  {label:'1000', value:1000, price:229000},
];
const PAYMENTS = [
  {id:'qris', label:'QRIS'},
  {id:'dana', label:'DANA'},
  {id:'ovo', label:'OVO'},
  {id:'gopay', label:'GoPay'},
  {id:'spay', label:'ShopeePay'},
  {id:'va', label:'VA Bank'}
];

/* ===== Lightweight particles ===== */
(function particles(){
  const c = document.getElementById('bgParticles');
  const ctx = c.getContext('2d', { alpha: true });
  let w, h, dpi = window.devicePixelRatio || 1, nodes = [];
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  function resize(){ w = c.width = innerWidth * dpi; h = c.height = innerHeight * dpi; }
  function init(){
    nodes = [];
    const count = isMobile ? Math.min(48, Math.floor(innerWidth/16)) : Math.min(120, Math.floor(innerWidth/12));
    for(let i=0;i<count;i++){ nodes.push({ x: Math.random()*w, y: Math.random()*h, vx:(Math.random()-.5)*0.18*dpi, vy:(Math.random()-.5)*0.18*dpi, r: Math.random()*2+0.6 }); }
  }
  function loop(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for(const n of nodes){
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>w) n.vx*=-1; if(n.y<0||n.y>h) n.vy*=-1;
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  resize(); init(); loop();
  addEventListener('resize', ()=>{ resize(); init(); }, {passive:true});
})();

/* ===== Render Games ===== */
const grid = $('#gamesGrid');
function renderGames(list){
  grid.innerHTML = '';
  list.forEach(g=>{
    const card = document.createElement('div');
    card.className = 'game-card tilt';
    card.dataset.id = g.id;
    card.innerHTML = `
      <img src="${g.img}" alt="${g.name}">
      <div class="meta"><h4>${g.name}</h4>${g.tags.slice(0,2).map(t=>`<span class="tag">#${t}</span>`).join('')}</div>`;
    card.addEventListener('click', ()=> openModal(g), {passive:true});
    grid.appendChild(card);
  });
  attachTilt();
}
renderGames(GAMES);

/* ===== Search & Filter ===== */
$('#searchInput').addEventListener('input', (e)=>{
  const q = e.target.value.toLowerCase();
  const filtered = GAMES.filter(g=> g.name.toLowerCase().includes(q));
  renderGames(filtered);
}, {passive:true});

$('#categoryChips').addEventListener('click', (e)=>{
  if(!e.target.classList.contains('chip')) return;
  $$('.chip').forEach(c=>c.classList.remove('active'));
  e.target.classList.add('active');
  const cat = e.target.dataset.cat;
  renderGames(cat === 'all' ? GAMES : GAMES.filter(g=> g.tags.includes(cat)));
}, {passive:true});

/* ===== Modal Logic ===== */
const modal = $('#modal');
const modalClose = $('#modalClose');
const modalTitle = $('#modalTitle');
const modalSub = $('#modalSub');
const modalImg = $('#modalImg');
const denomsBox = $('#denoms');
const paymentsBox = $('#payments');
const totalPrice = $('#totalPrice');

let selectedDenom = null;
let selectedPay = null;

function openModal(game){
  modalTitle.textContent = `Top Up — ${game.name}`;
  modalSub.textContent = 'Masukin data player kamu dulu ya.';
  modalImg.src = game.img;
  modal.classList.remove('hidden');
  buildDenoms(); buildPayments();
  totalPrice.textContent = rupiah(0);
  document.body.style.overflow = 'hidden';
}
function closeModal(){ modal.classList.add('hidden'); document.body.style.overflow=''; }
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal() }, {passive:true});

function pill(){ const el = document.createElement('div'); el.className = 'pill'; return el; }
function buildDenoms(){
  denomsBox.innerHTML=''; selectedDenom=null;
  for(const d of DENOMS){
    const el = pill(); el.textContent = d.label;
    el.addEventListener('click', ()=>{ selectedDenom = d; updateSelections(); }, {passive:true});
    denomsBox.appendChild(el);
  }
}
function buildPayments(){
  paymentsBox.innerHTML=''; selectedPay=null;
  for(const p of PAYMENTS){
    const el = pill(); el.textContent = p.label;
    el.addEventListener('click', ()=>{ selectedPay = p; updateSelections(); }, {passive:true});
    paymentsBox.appendChild(el);
  }
}
function updateSelections(){
  $$('.denoms .pill', $('.modal-body')).forEach((el,i)=> el.classList.toggle('active', selectedDenom && DENOMS[i]===selectedDenom));
  $$('.payments .pill', $('.modal-body')).forEach((el,i)=> el.classList.toggle('active', selectedPay && PAYMENTS[i]===selectedPay));
  totalPrice.textContent = rupiah(selectedDenom ? selectedDenom.price : 0);
}

$('#orderForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const id = e.target.playerId.value.trim();
  if(!id || !selectedDenom || !selectedPay){ showToast('Lengkapi data dulu ya 🤝'); return; }
  closeModal(); showToast('Pesanan dibuat! Proses pembayaran dibuka 🎉');
});

/* ===== Toast ===== */
function showToast(text){
  const t = $('#toast'); t.textContent = text; t.classList.remove('hidden');
  setTimeout(()=> t.classList.add('hidden'), 3200);
}

/* ===== Tilt effect (desktop only) ===== */
function attachTilt(){
  if(!window.matchMedia('(pointer: fine)').matches) return;
  $$('.tilt').forEach(el=>{
    const r = 12;
    function move(e){
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - .5) * -r;
      const ry = (x - .5) * r;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    function leave(){ el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)'; }
    el.addEventListener('mousemove', move, {passive:true});
    el.addEventListener('mouseleave', leave, {passive:true});
  });
}

document.getElementById('year').textContent = new Date().getFullYear();