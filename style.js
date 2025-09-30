/* -------------------------
  Mini Projects Hub — Complete Professional Implementation
  Notes:
  - Put your OpenWeather key via "Set API Key" button (stored in localStorage key mph_openweather_key)
  - To use local mp3s, change the 'src' values in teluguSongs to local file paths
 ------------------------- */

/* ---------- small notification helper ---------- */
function showNotification(text, ms=1800){
  const el = document.createElement('div');
  el.className = 'mph-notify';
  el.textContent = text;
  document.body.appendChild(el);
  // slide in
  requestAnimationFrame(()=> el.style.transform = 'translateX(0)');
  setTimeout(()=> {
    el.style.transform = 'translateX(110%)';
    setTimeout(()=> el.remove(), 350);
  }, ms);
}

/* ---------- NAV ---------- */
document.querySelectorAll('.nav-card').forEach(card=>{
  card.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-card').forEach(c=>c.classList.remove('active'));
    card.classList.add('active');
    const id = card.dataset.project;
    document.querySelectorAll('main section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    // refresh some content when opened
    if(id === 'p-crypto') fetchCrypto();
    if(id === 'p-clock') updateClock(); // refresh immediately
    if(id === 'p-music') renderPlaylist();
  });
});

/* ---------- 2. MUSIC (improved) ---------- */
const teluguSongs = [
  { title:"Nuvvostanante Nenoddantana", movie:"Nuvvostanante Nenoddantana", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title:"Cheliya Cheliya", movie:"Devadas", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title:"Ninnu Kori Varnam", movie:"Gharshana", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title:"Vintunnava", movie:"Ye Maaya Chesave", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
];

let mIndex = 0, mShuffle=false, mRepeat=false;
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const vol = document.getElementById('vol');
const playlistEl = document.getElementById('playlist');
const nowPlaying = document.getElementById('nowPlaying');
const curTime = document.getElementById('curTime');
const dur = document.getElementById('dur');
const seek = document.getElementById('seek');
const progBar = document.getElementById('progBar');

function renderPlaylist(){
  if(!playlistEl) return;
  playlistEl.innerHTML = '';
  teluguSongs.forEach((s,i)=>{
    const li = document.createElement('li');
    li.tabIndex = 0;
    li.innerHTML = `<div><strong>${s.title}</strong><div class="small">${s.movie||''}</div></div><div class="small">${s.duration? s.duration : ''}</div>`;
    li.addEventListener('click', ()=> {
      playIndex(i);
    });
    li.addEventListener('keydown', e => { if(e.key==='Enter') playIndex(i); });
    if(i === mIndex) li.classList.add('active');
    playlistEl.appendChild(li);
  });
}

function playIndex(i){
  mIndex = i;
  loadAndPlay();
  renderPlaylist(); // ensure active class updates
}

async function loadAndPlay(){
  const s = teluguSongs[mIndex];
  if(!s) return;
  nowPlaying.textContent = `${s.title}${s.movie ? ' — ' + s.movie : ''}`;
  audio.src = s.src;
  try{
    await audio.play(); // will throw if not allowed until user interacts
    playBtn.textContent = '⏸';
  }catch(err){
    // not allowed to autoplay — show play icon and prompt user interaction
    playBtn.textContent = '▶';
    showNotification('Tap Play (browser blocked autoplay)');
  }
}

playBtn?.addEventListener('click', async ()=>{
  if(!audio.src) {
    // lazy load current song
    audio.src = teluguSongs[mIndex].src;
  }
  if(audio.paused){
    try { await audio.play(); playBtn.textContent = '⏸'; } catch(e){ showNotification('Play blocked — interact with the page'); }
  } else {
    audio.pause(); playBtn.textContent = '▶';
  }
});

prevBtn?.addEventListener('click', ()=> {
  if(mShuffle) mIndex = Math.floor(Math.random() * teluguSongs.length);
  else mIndex = (mIndex - 1 + teluguSongs.length) % teluguSongs.length;
  loadAndPlay(); renderPlaylist();
});

nextBtn?.addEventListener('click', ()=> {
  if(mShuffle) mIndex = Math.floor(Math.random() * teluguSongs.length);
  else mIndex = (mIndex + 1) % teluguSongs.length;
  loadAndPlay(); renderPlaylist();
});

shuffleBtn?.addEventListener('click', ()=> { 
  mShuffle = !mShuffle; 
  shuffleBtn.classList.toggle('active', mShuffle); 
  showNotification('Shuffle ' + (mShuffle? 'On':'Off')); 
});

repeatBtn?.addEventListener('click', ()=> { 
  mRepeat = !mRepeat; 
  repeatBtn.classList.toggle('active', mRepeat); 
  showNotification('Repeat ' + (mRepeat? 'On':'Off')); 
});

vol?.addEventListener('input', ()=> { audio.volume = vol.value / 100; });

audio.addEventListener('loadedmetadata', ()=> {
  if(seek) seek.max = Math.floor(audio.duration || 0);
  if(dur) dur.textContent = formatTime(Math.floor(audio.duration || 0));
});

audio.addEventListener('timeupdate', ()=> {
  if(seek) seek.value = Math.floor(audio.currentTime || 0);
  if(curTime) curTime.textContent = formatTime(Math.floor(audio.currentTime || 0));
  const pct = ((audio.currentTime || 0) / (audio.duration || 1)) * 100;
  if(progBar) progBar.style.width = pct + '%';
});

seek?.addEventListener('input', ()=> { audio.currentTime = seek.value; });

audio.addEventListener('ended', ()=> {
  if(mRepeat) { audio.currentTime = 0; audio.play(); }
  else nextBtn?.click();
});

// ensure playlist renders
renderPlaylist();

/* ---------- 3. CALCULATOR (safe-ish) ---------- */
let calcExpr = '';
const display = document.getElementById('calcDisplay');
const calcBtns = document.querySelectorAll('.calc');
const calcEquals = document.getElementById('calcEquals');
const calcClear = document.getElementById('calcClear');
const calcDel = document.getElementById('calcDel');
const calcHistory = document.getElementById('calcHistory');
const clearHistory = document.getElementById('clearHistory');
const historyCount = document.getElementById('historyCount');
const CALC_KEY = 'mph_calcHistory';

calcBtns.forEach(b => b.addEventListener('click', ()=>{
  const v = b.dataset.val;
  calcExpr += v;
  if(display) display.value = calcExpr;
}));

calcEquals?.addEventListener('click', ()=>{
  try{
    if(!calcExpr) return;
    if(!/^[0-9+\-*/().\s]+$/.test(calcExpr)) throw 'Invalid characters';
    // use Function to evaluate (guarded by regex above)
    const res = Function('"use strict";return (' + calcExpr + ')')();
    addHistory(calcExpr + ' = ' + res);
    calcExpr = String(res);
    if(display) display.value = calcExpr;
  }catch(e){
    if(display) display.value = 'Error';
    calcExpr = '';
  }
});

calcClear?.addEventListener('click', ()=> { 
  calcExpr=''; 
  if(display) display.value = ''; 
});

calcDel?.addEventListener('click', ()=> { 
  calcExpr = calcExpr.slice(0, -1); 
  if(display) display.value = calcExpr; 
});

function addHistory(text){
  const arr = JSON.parse(localStorage.getItem(CALC_KEY) || '[]');
  arr.unshift({text, ts: Date.now()});
  localStorage.setItem(CALC_KEY, JSON.stringify(arr.slice(0, 80)));
  renderHistory();
}

function renderHistory(){
  if(!calcHistory) return;
  const arr = JSON.parse(localStorage.getItem(CALC_KEY) || '[]');
  calcHistory.innerHTML = arr.map(a => `<div style="padding:6px;border-bottom:1px solid #eee">${a.text}<div class="muted small">${new Date(a.ts).toLocaleString()}</div></div>`).join('') || '<div class="muted small">No history</div>';
  if(historyCount) historyCount.textContent = arr.length + ' items';
}

clearHistory?.addEventListener('click', ()=> { 
  localStorage.removeItem(CALC_KEY); 
  renderHistory(); 
});

renderHistory();

/* ---------- 4. TODO (namespaced) ---------- */
const TASKS_KEY = 'mph_tasks';
const tasksEl = document.getElementById('tasks');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const clearCompleted = document.getElementById('clearCompleted');
const todoStats = document.getElementById('todoStats');

addTaskBtn?.addEventListener('click', addTask);
taskInput?.addEventListener('keypress', e => { if(e.key==='Enter') addTask(); });

function loadTasks(){ return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'); }
function saveTasks(arr){ localStorage.setItem(TASKS_KEY, JSON.stringify(arr)); }

function addTask(){
  if(!taskInput) return;
  const text = taskInput.value.trim(); 
  if(!text) return;
  const arr = loadTasks();
  arr.unshift({text, done:false, ts: Date.now()});
  saveTasks(arr); 
  taskInput.value=''; 
  renderTasks();
}

function renderTasks(){
  if(!tasksEl) return;
  const arr = loadTasks();
  if(arr.length === 0) {
    tasksEl.innerHTML = '<div class="muted small">No tasks</div>';
  } else {
    tasksEl.innerHTML = arr.map((t,i) => 
      `<li><label><input type="checkbox" data-index="${i}" ${t.done?'checked':''}/> ${escapeHtml(t.text)}</label> <button data-del="${i}" class="btn">Delete</button></li>`
    ).join('');
  }
  
  // bind events
  tasksEl.querySelectorAll('[data-del]').forEach(b=> b.addEventListener('click', e=>{
    const i = +b.getAttribute('data-del'); 
    const arr = loadTasks(); 
    arr.splice(i,1); 
    saveTasks(arr); 
    renderTasks();
  }));
  
  tasksEl.querySelectorAll('input[type=checkbox]').forEach(cb => cb.addEventListener('change', e=>{
    const i = +cb.getAttribute('data-index'); 
    const arr = loadTasks(); 
    if(arr[i]) arr[i].done = cb.checked; 
    saveTasks(arr); 
    renderTasks();
  }));
  
  const total = arr.length;
  const done = arr.filter(t => t.done).length;
  const pending = total - done;
  if(todoStats) {
    todoStats.innerHTML = `<div class="stat"><strong>${total}</strong><div class="small">Total</div></div><div class="stat"><strong>${done}</strong><div class="small">Completed</div></div><div class="stat"><strong>${pending}</strong><div class="small">Pending</div></div>`;
  }
}

clearCompleted?.addEventListener('click', ()=> {
  const arr = loadTasks().filter(t => !t.done);
  saveTasks(arr); 
  renderTasks();
});

renderTasks();

/* ---------- 5. WEATHER (OpenWeather) ---------- */
const WEATHER_KEY = 'mph_openweather_key';
const fetchWeatherBtn = document.getElementById('fetchWeatherBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const autoLocate = document.getElementById('autoLocate');
const setApiKeyBtn = document.getElementById('setApiKey');
const apiKeyStatus = document.getElementById('apiKeyStatus');

const HARDCODED_API_KEY = '8539cd2b5d17ad94d30afa6b2eb8ebdd';
localStorage.setItem(WEATHER_KEY, HARDCODED_API_KEY);
if(apiKeyStatus) apiKeyStatus.textContent = 'set';

setApiKeyBtn?.addEventListener('click', ()=> {
  const key = prompt('Enter your OpenWeather API key (get free at openweathermap.org):', localStorage.getItem(WEATHER_KEY) || '');
  if(key){
    localStorage.setItem(WEATHER_KEY, key.trim());
    if(apiKeyStatus) apiKeyStatus.textContent = 'set';
    showNotification('API key saved');
  }
});

fetchWeatherBtn?.addEventListener('click', ()=> {
  if(!cityInput) return;
  const city = cityInput.value.trim(); 
  if(!city) { alert('Enter a city'); return; }
  fetchWeatherByCity(city);
});

autoLocate?.addEventListener('click', ()=> {
  if(!navigator.geolocation) { alert('Geolocation unsupported'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
  }, err => { alert('Unable to get location: ' + err.message); });
});

async function fetchWeatherByCity(city){
  const key = localStorage.getItem(WEATHER_KEY) || '';
  if(!key) { alert('Set OpenWeather API key first'); return; }
  if(weatherResult) weatherResult.innerHTML = 'Loading...';
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${encodeURIComponent(key)}`);
    const data = await res.json();
    if(!res.ok) throw data;
    renderWeather(data);
  }catch(err){
    let msg = (err && err.message) ? err.message : (err && err.msg) ? err.msg : 'Failed to fetch weather';
    if(weatherResult) weatherResult.innerHTML = `<div class="muted small">⚠ ${escapeHtml(String(msg))}</div>`;
  }
}

async function fetchWeatherByCoords(lat, lon){
  const key = localStorage.getItem(WEATHER_KEY) || '';
  if(!key) { alert('Set OpenWeather API key first'); return; }
  if(weatherResult) weatherResult.innerHTML = 'Loading...';
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${encodeURIComponent(key)}`);
    const data = await res.json();
    if(!res.ok) throw data;
    renderWeather(data);
  }catch(err){
    let msg = (err && err.message) ? err.message : (err && err.msg) ? err.msg : 'Failed to fetch weather';
    if(weatherResult) weatherResult.innerHTML = `<div class="muted small">⚠ ${escapeHtml(String(msg))}</div>`;
  }
}

function renderWeather(d){
  if(!weatherResult) return;
  const icon = d.weather && d.weather[0] && d.weather[0].icon ? `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png` : '';
  weatherResult.innerHTML = `
    <div style="display:flex;gap:12px;align-items:center">
      ${icon ? `<img src="${icon}" alt="icon" style="width:64px;height:64px">` : ''}
      <div>
        <div style="font-weight:700">${escapeHtml(d.name || '')} — ${escapeHtml(d.weather?.[0]?.main || '')}</div>
        <div class="small">${escapeHtml(d.weather?.[0]?.description || '')}</div>
        <div class="small">🌡 Temp: <strong>${d.main?.temp ?? '--'}°C</strong> (feels ${d.main?.feels_like ?? '--'}°C)</div>
        <div class="small">💧 Humidity: ${d.main?.humidity ?? '--'}% • 💨 Wind: ${d.wind?.speed ?? '--'} m/s</div>
      </div>
    </div>
  `;
}

/* ---------- 6. FORM ---------- */
const validationForm = document.getElementById('validationForm');
validationForm?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('v-name')?.value.trim() || '';
  const email = document.getElementById('v-email')?.value.trim() || '';
  const phone = document.getElementById('v-phone')?.value.trim() || '';
  let ok = true;
  
  const nameErr = document.getElementById('nameErr');
  const emailErr = document.getElementById('emailErr');
  const phoneErr = document.getElementById('phoneErr');
  
  if(nameErr) nameErr.textContent = '';
  if(emailErr) emailErr.textContent = '';
  if(phoneErr) phoneErr.textContent = '';
  
  if(name.length < 2) { 
    if(nameErr) nameErr.textContent = 'Name too short'; 
    ok=false; 
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ 
    if(emailErr) emailErr.textContent = 'Invalid email'; 
    ok=false; 
  }
  if(!/^\+?[\d\s\-\(\)]{7,}$/.test(phone)){ 
    if(phoneErr) phoneErr.textContent = 'Invalid phone'; 
    ok=false; 
  }
  if(ok) showNotification('Form valid ✅');
});

/* ---------- 7. DROPDOWN ---------- */
function showDropdown(){
  const country = document.getElementById('d-country')?.value || '';
  const cat = document.getElementById('d-cat')?.value || '';
  const dropdownOut = document.getElementById('dropdownOut');
  if(dropdownOut) {
    dropdownOut.innerHTML = `
      ${country ? `<div><strong>Country:</strong> ${escapeHtml(country)}</div>` : ''}
      ${cat ? `<div><strong>Category:</strong> ${escapeHtml(cat)}</div>` : ''}
    `;
  }
}

document.getElementById('d-country')?.addEventListener('change', showDropdown);
document.getElementById('d-cat')?.addEventListener('change', showDropdown);

/* ---------- 8. PROGRESS ---------- */
let progInterval = null;
const linearFill = document.getElementById('linearFill');
const circProg = document.getElementById('circProg');

document.getElementById('startProg')?.addEventListener('click', ()=> {
  let pct = 0; 
  clearInterval(progInterval);
  progInterval = setInterval(()=> {
    pct += 2; 
    if(pct > 100) { 
      clearInterval(progInterval); 
      return; 
    }
    if(linearFill) linearFill.style.width = pct + '%';
    if(circProg) {
      circProg.style.background = `conic-gradient(#4facfe ${pct*3.6}deg,#e0e0e0 0deg)`;
      circProg.textContent = pct + '%';
    }
  }, 120);
});

document.getElementById('stopProg')?.addEventListener('click', ()=> clearInterval(progInterval));

document.getElementById('resetProg')?.addEventListener('click', ()=> {
  clearInterval(progInterval); 
  if(linearFill) linearFill.style.width='0%'; 
  if(circProg) {
    circProg.style.background='conic-gradient(#4facfe 0deg,#e0e0e0 0deg)'; 
    circProg.textContent='0%';
  }
});

/* ---------- 9. CART ---------- */
let cartCount = Number(localStorage.getItem('mph_cart') || 0);
const cartInfo = document.getElementById('cartInfo');
if(cartInfo) cartInfo.textContent = 'Cart: ' + cartCount;

document.getElementById('addCart')?.addEventListener('click', ()=> {
  const qty = parseInt(document.getElementById('prodQty')?.value || 1);
  cartCount += qty; 
  localStorage.setItem('mph_cart', cartCount);
  if(cartInfo) cartInfo.textContent = 'Cart: ' + cartCount;
  showNotification('Added to cart');
});

/* ---------- 10. CRYPTO (CoinGecko) ---------- */
const cryptoResult = document.getElementById('cryptoResult');

async function fetchCrypto(){
  if(!cryptoResult) return;
  const id = document.getElementById('cryptoIds')?.value || 'bitcoin';
  cryptoResult.innerHTML = 'Loading...';
  try{
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(id)}`);
    if(!res.ok) throw new Error('API response ' + res.status);
    const d = await res.json();
    if(!d || !d[0]) throw new Error('No data');
    const coin = d[0];
    const time = new Date().toLocaleTimeString();
    cryptoResult.innerHTML = `
      <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
      <p class="small">Price: <strong>${coin.current_price.toLocaleString()}</strong></p>
      <p class="small">24h change: <strong style="color:${coin.price_change_percentage_24h>=0? '#1b8f34':'#c82333'}">${coin.price_change_percentage_24h?.toFixed(2) ?? '--'}%</strong></p>
      <p class="small">Market cap: ${(coin.market_cap || 0).toLocaleString()}</p>
      <div class="muted small">Updated: ${time}</div>
    `;
  }catch(err){
    // fallback simulated values when API fails
    console.error('crypto error', err);
    cryptoResult.innerHTML = `<div class="muted small">Failed to load live data — showing simulated values.</div>
      <div style="margin-top:8px"><strong>Price (sim):</strong> ${(Math.random()*50000+1000).toFixed(2)}</div>`;
  }
}

document.getElementById('refreshCrypto')?.addEventListener('click', fetchCrypto);
fetchCrypto();

/* ---------- 11. QUIZ (fixed & robust) ---------- */
const questions = [
  { q:"What is the capital of France?", opts:["London","Berlin","Paris","Madrid"], a:2 },
  { q:"Which planet is closest to the Sun?", opts:["Venus","Mercury","Earth","Mars"], a:1 },
  { q:"What is 15 × 8?", opts:["110","120","130","140"], a:1 },
  { q:"Who painted the Mona Lisa?", opts:["Van Gogh","Picasso","Da Vinci","Michelangelo"], a:2 },
  { q:"Largest mammal?", opts:["Elephant","Blue Whale","Giraffe","Hippo"], a:1 }
];

let qi = 0, qscore = 0, selected = null;
const qQuestion = document.getElementById('q-question');
const qOptions = document.getElementById('q-options');
const qScore = document.getElementById('q-score');
const qNext = document.getElementById('q-next');

function loadQ(){
  if(!qQuestion || !qOptions) return;
  const Q = questions[qi];
  qQuestion.textContent = Q.q;
  qOptions.innerHTML = Q.opts.map((o,i)=>`<div tabindex="0" data-i="${i}" style="padding:8px;border:1px solid #eee;margin:6px 0;cursor:pointer">${escapeHtml(o)}</div>`).join('');
  qOptions.querySelectorAll('div').forEach(d => {
    d.addEventListener('click', ()=> selectOption(d));
    d.addEventListener('keydown', e => { if(e.key==='Enter') selectOption(d); });
  });
}

function selectOption(div){
  if(!qOptions) return;
  qOptions.querySelectorAll('div').forEach(x => x.style.background = '');
  div.style.background = '#e8f4ff';
  selected = Number(div.dataset.i);
}

function handleNext(){
  if(selected === null){ alert('Select an option'); return; }
  if(selected === questions[qi].a) qscore++;
  qi++;
  selected = null;
  if(qi >= questions.length){
    // show results and change button to Restart
    if(qQuestion) qQuestion.textContent = `Quiz complete — Score: ${qscore}/${questions.length}`;
    if(qOptions) qOptions.innerHTML = '';
    if(qScore) qScore.textContent = qscore;
    if(qNext) {
      qNext.textContent = 'Restart';
      qNext.removeEventListener('click', handleNext);
      qNext.addEventListener('click', restartQuiz);
    }
    return;
  }
  if(qScore) qScore.textContent = qscore;
  loadQ();
}

function restartQuiz(){
  qi = 0; qscore = 0; selected = null;
  if(qNext) {
    qNext.textContent = 'Next';
    qNext.removeEventListener('click', restartQuiz);
    qNext.addEventListener('click', handleNext);
  }
  loadQ();
  if(qScore) qScore.textContent = qscore;
}

qNext?.addEventListener('click', handleNext);
loadQ();

/* ---------- 12. CLOCK ---------- */
const clockTime = document.getElementById('clockTime');
const clockDate = document.getElementById('clockDate');

function updateClock(){
  if(!clockTime || !clockDate) return;
  const now = new Date();
  clockTime.textContent = now.toLocaleTimeString();
  clockDate.textContent = now.toLocaleDateString();
}

setInterval(updateClock, 1000);
updateClock();

/* ---------- 13. TTS ---------- */
const voiceSelect = document.getElementById('voiceSelect');
const rate = document.getElementById('rate');
const rateVal = document.getElementById('rateVal');
const speakBtn = document.getElementById('speakBtn');
const stopSpeak = document.getElementById('stopSpeak');
let voices = [];

function loadVoices(){
  if(!voiceSelect) return;
  voices = window.speechSynthesis.getVoices();
  if(!voices || voices.length===0) return;
  voiceSelect.innerHTML = voices.map((v,i)=>`<option value="${i}">${escapeHtml(v.name)} (${escapeHtml(v.lang)})</option>`).join('');
}

if('speechSynthesis' in window){
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
  // call once
  setTimeout(loadVoices, 200);
}

rate?.addEventListener('input', ()=> {
  if(rateVal) rateVal.textContent = rate.value;
});

speakBtn?.addEventListener('click', ()=> {
  const ttsText = document.getElementById('ttsText');
  if(!ttsText) return;
  const txt = ttsText.value.trim(); 
  if(!txt) return;
  const utt = new SpeechSynthesisUtterance(txt);
  const sel = Number(voiceSelect?.value || 0);
  if(voices[sel]) utt.voice = voices[sel];
  if(rate) utt.rate = parseFloat(rate.value);
  window.speechSynthesis.speak(utt);
});

stopSpeak?.addEventListener('click', ()=> window.speechSynthesis.cancel());

/* ---------- 14. QR ---------- */
const qrOut = document.getElementById('qrOut');
const genQR = document.getElementById('genQR');
const downloadQR = document.getElementById('downloadQR');

genQR?.addEventListener('click', ()=> {
  const qrText = document.getElementById('qrText');
  if(!qrText || !qrOut) return;
  const text = qrText.value.trim(); 
  if(!text){ alert('Enter text'); return; }
  const size = 300;
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  qrOut.innerHTML = `<img id="qrImg" src="${url}" alt="qr" style="max-width:100%"/>`;
});

downloadQR?.addEventListener('click', ()=> {
  const img = document.getElementById('qrImg'); 
  if(!img){ alert('Generate first'); return; }
  const a = document.createElement('a'); 
  a.href = img.src; 
  a.download = 'qr.png'; 
  a.click();
});

/* ---------- 15. PASSWORD ---------- */
const pwLen = document.getElementById('pwLen');
const pwLenVal = document.getElementById('pwLenVal');
const pU = document.getElementById('pU');
const pL = document.getElementById('pL');
const pN = document.getElementById('pN');
const pS = document.getElementById('pS');
const genPw = document.getElementById('genPw');
const copyPw = document.getElementById('copyPw');
const pwOut = document.getElementById('pwOut');

pwLen?.addEventListener('input', ()=> {
  if(pwLenVal) pwLenVal.textContent = pwLen.value;
});

genPw?.addEventListener('click', ()=> {
  if(!pwOut) return;
  const len = +(pwLen?.value || 12);
  let chars = '';
  if(pU?.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if(pL?.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
  if(pN?.checked) chars += '0123456789';
  if(pS?.checked) chars += '!@#$%^&*()_+[]{}|;:,.<>?';
  if(!chars){ alert('Select character sets'); return; }
  let pw = '';
  for(let i=0;i<len;i++) pw += chars[Math.floor(Math.random()*chars.length)];
  pwOut.textContent = pw;
});

copyPw?.addEventListener('click', ()=> {
  if(!pwOut) return;
  const p = pwOut.textContent; 
  if(!p) return;
  navigator.clipboard.writeText(p).then(()=> showNotification('Password copied'));
});

/* ---------- UTIL ---------- */
function formatTime(sec){ 
  if(!isFinite(sec)) return '0:00'; 
  sec = Math.floor(sec); 
  const m = Math.floor(sec/60); 
  const s = String(sec%60).padStart(2,'0'); 
  return `${m}:${s}`; 
}

function escapeHtml(s){ 
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c])); 
}

/* ---------- INITIAL (user interaction enable) ---------- */
document.addEventListener('click', function firstClickInit(){
  if(audio && !audio.src) audio.src = teluguSongs[0].src; // lazy-load default
  document.removeEventListener('click', firstClickInit);
});

// Space toggles play when music tab active
document.addEventListener('keydown', e => {
  if(e.code === 'Space' && document.getElementById('p-music')?.classList.contains('active')){
    e.preventDefault(); 
    playBtn?.click();
  }
});