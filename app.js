// Flaming Word starter.
const SUPABASE_URL = "https://yvdohftrcjuqqszjxbxb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_h8x4smqO00LR8d08sjZx2Q_11UoYr0g";
const configured = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_");
const db = configured && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const $ = s => document.querySelector(s);
let devotionals = [];
let current = null;
let user = null;
const todayISO = () => new Date().toLocaleDateString('en-CA');
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sample = [{id:'sample-1',title:'Faith That Overcomes',scripture:'1 John 5:4',date:todayISO(),body:'Faith is more than positive thinking; it is a confident response to the character and promises of God. The believer who trusts God learns to stand firm even when circumstances appear uncertain.\\n\\nThe world presents challenges that can weaken the heart, but the Word of God reminds us that victory begins with a life anchored in Christ. Faith does not deny the existence of difficulty; it declares that God is greater than every difficulty.\\n\\nAs you walk with God today, let His promises shape your decisions, your words, and your expectations. Take the next step in obedience, knowing that the One who called you is faithful.\\n\\nDo not measure God's faithfulness by the speed of your answers. Keep trusting, keep obeying, and keep growing in His Word.',reflection:'Where is God asking you to trust Him more deeply today? What promise from Scripture can guide your response?',takeaway:'Choose one practical step of obedience today, and take it in faith.',prayer:'Heavenly Father, strengthen my faith and help me to trust Your Word above my circumstances. Give me grace to obey You with courage today, in Jesus’ name. Amen.',status:'published'}];
async function loadData(){
  $('#todayDate').textContent = new Date().toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  $('#year').textContent = new Date().getFullYear();
  if(db){
    const {data,error}=await db.from('devotionals').select('*').in('status',['published','scheduled']).lte('publish_at',new Date().toISOString()).order('publish_at',{ascending:false});
    if(!error) devotionals=data||[];
  } else devotionals=JSON.parse(localStorage.getItem('flamingWordDemo')||'null')||sample;
  render();
}
function render(){
  const today = devotionals.find(d=>d.date===todayISO()) || devotionals[0];
  $('#featured').innerHTML = today ? `<span class="eyebrow">WORD FOR TODAY</span><h3>${esc(today.title)}</h3><div class="scripture">${esc(today.scripture)}</div><p class="preview">${esc((today.body||'').slice(0,260))}${(today.body||'').length>260?'…':''}</p><button class="read-link" data-read="${esc(today.id)}">Read full devotional →</button>` : '<p>No devotional has been published for today yet. Please check the archive again soon.</p>';
  const q=($('#searchInput').value||'').toLowerCase();
  const list=devotionals.filter(d=>[d.title,d.scripture,d.body].join(' ').toLowerCase().includes(q));
  $('#archiveList').innerHTML=list.length?list.map(d=>`<article class="archive-item"><span class="eyebrow">${esc(d.date||'')}</span><h3>${esc(d.title)}</h3><div class="scripture">${esc(d.scripture)}</div><p>${esc((d.body||'').slice(0,115))}…</p><button data-read="${esc(d.id)}">Read devotional →</button></article>`).join(''):'<p class="muted">No matching devotionals found.</p>';
}
function openReader(id){
  current=devotionals.find(d=>String(d.id)===String(id)); if(!current)return;
  $('#readerContent').innerHTML=`<span class="eyebrow">${esc(current.date||'FLAMING WORD')}</span><h2>${esc(current.title)}</h2><div class="scripture">${esc(current.scripture)}</div><h3>Body</h3><p>${esc(current.body)}</p><h3>Reflection</h3><p>${esc(current.reflection)}</p><h3>Takeaway</h3><p>${esc(current.takeaway)}</p><h3>Prayer</h3><p>${esc(current.prayer)}</p><p class="author">Pastor Emmanuel Adikwu</p>`;
  $('#bookmarkBtn').textContent=isSaved(current.id)?'★ Saved devotional':'☆ Save devotional';
  $('#readerModal').classList.remove('hidden');
}
function saved(){return JSON.parse(localStorage.getItem('flamingWordSaved')||'[]')}
function isSaved(id){return saved().includes(String(id))}
function toggleSave(){if(!current)return;let a=saved();a=isSaved(current.id)?a.filter(x=>x!==String(current.id)):[...a,String(current.id)];localStorage.setItem('flamingWordSaved',JSON.stringify(a));$('#bookmarkBtn').textContent=isSaved(current.id)?'★ Saved devotional':'☆ Save devotional'}
function share(){if(!current)return;const t=`${current.title}\\n${current.scripture}\\n\\n${current.body}\\n\\nReflection: ${current.reflection}\\n\\nTakeaway: ${current.takeaway}\\n\\nPrayer: ${current.prayer}\\n\\nFlaming Word — Pastor Emmanuel Adikwu`;if(navigator.share)navigator.share({title:current.title,text:t}).catch(()=>{});else navigator.clipboard?.writeText(t).then(()=>alert('Devotional copied. You can now share it.'))}
document.addEventListener('click',e=>{const r=e.target.closest('[data-read]');if(r)openReader(r.dataset.read);const c=e.target.closest('[data-close]');if(c)$('#'+c.dataset.close).classList.add('hidden')});
$('#menuBtn').onclick=()=>$('#nav').classList.toggle('open');
$('#adminOpen').onclick=()=>$('#adminModal').classList.remove('hidden');
$('#searchBtn').onclick=render;$('#searchInput').oninput=render;$('#bookmarkBtn').onclick=toggleSave;$('#shareBtn').onclick=share;
$('#loginForm').onsubmit=async e=>{e.preventDefault();if(!db){$('#loginMsg').textContent='Connect Supabase first. See README for setup instructions.';return}const f=new FormData(e.target);const {data,error}=await db.auth.signInWithPassword({email:f.get('email'),password:f.get('password')});if(error){$('#loginMsg').textContent=error.message;return}user=data.user;showAdmin()};
async function showAdmin(){
  const {data}=await db.from('devotionals').select('*').order('publish_at',{ascending:false});
  $('#adminContent').innerHTML=`<span class="eyebrow">CONTENT MANAGEMENT</span><h2>Devotional dashboard</h2><p class="muted">Signed in as ${esc(user.email)}</p><form id="devForm" class="admin-tools"><input name="id" type="hidden"><label>Devotional title<input name="title" required placeholder="Enter title"></label><div class="two"><label>Scripture reference<input name="scripture" required placeholder="e.g. Psalm 23:1"></label><label>Devotional date<input name="date" type="date" required value="${todayISO()}"></label></div><label>Body<textarea name="body" required placeholder="Write the devotional body (four paragraphs recommended)"></textarea></label><label>Reflection<textarea name="reflection" required></textarea></label><label>Takeaway<textarea name="takeaway" required></textarea></label><label>Prayer<textarea name="prayer" required></textarea></label><div class="two"><label>Publish date & time<input name="publish_at" type="datetime-local" required value="${new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16)}"></label><label>Status<select name="status"><option value="published">Published</option><option value="scheduled">Scheduled</option><option value="draft">Draft</option></select></label></div><button class="gold-btn" type="submit">Save devotional</button><button type="button" id="clearForm" class="outline-btn">Clear form</button><p id="saveMsg" class="form-msg"></p></form><div class="admin-list"><h3>Existing devotionals</h3>${(data||[]).map(d=>`<div class="admin-row"><span><b>${esc(d.title)}</b><br>${esc(d.status)} · ${esc(d.date)}</span><span><button data-edit="${esc(d.id)}">Edit</button> <button data-delete="${esc(d.id)}">Delete</button></span></div>`).join('')||'No entries yet.'}</div><button id="logoutBtn" class="outline-btn">Sign out</button>`;
  $('#devForm').onsubmit=saveDevotional;$('#clearForm').onclick=()=>$('#devForm').reset();$('#logoutBtn').onclick=async()=>{await db.auth.signOut();user=null;$('#adminContent').innerHTML='<h2>Signed out</h2><p>You have safely signed out.</p>'};
  $('#adminContent').onclick=async e=>{if(e.target.dataset.edit){const d=(data||[]).find(x=>String(x.id)===e.target.dataset.edit);const f=$('#devForm');Object.keys(d).forEach(k=>{if(f.elements[k])f.elements[k].value=k==='publish_at'?new Date(d[k]).toISOString().slice(0,16):d[k]??''});f.scrollIntoView({behavior:'smooth'})}if(e.target.dataset.delete&&confirm('Delete this devotional?')){await db.from('devotionals').delete().eq('id',e.target.dataset.delete);showAdmin()}};
}
async function saveDevotional(e){e.preventDefault();const f=new FormData(e.target);const row=Object.fromEntries(f.entries());delete row.id;row.publish_at=new Date(row.publish_at).toISOString();const id=e.target.elements.id.value;const result=id?await db.from('devotionals').update(row).eq('id',id):await db.from('devotionals').insert(row);$('#saveMsg').textContent=result.error?result.error.message:'Devotional saved successfully.';if(!result.error){await showAdmin();await loadData()}}
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
loadData();
