const $=(s,el=document)=>el.querySelector(s);
const all=(s,el=document)=>[...el.querySelectorAll(s)];
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const menu=$('.menu-toggle'),nav=$('#navigation');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
all('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}});
all('[role=tablist]').forEach(list=>{const tabs=all('[role=tab]',list);const activate=tab=>{tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;$('#'+t.dataset.tab).hidden=!selected;});};tabs.forEach((t,i)=>{t.addEventListener('click',()=>activate(t));t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activate(tabs[next]);tabs[next].focus();}});});});
function timeline(rows){return rows.map(r=>`<div class="timeline-row"><div class="timeline-date">${escapeHtml(r[0])}</div><div><h3>${escapeHtml(r[1])}</h3><p>${escapeHtml(r[2])}</p></div></div>`).join('');}
function safeUrl(raw){try{let u=new URL(raw,location.href);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
fetch('profile.json?v=profile-2').then(r=>{if(!r.ok)throw Error('profile');return r.json();}).then(d=>{
 $('#summary').textContent=d.summary;
 $('#career').innerHTML=timeline(d.employment)+'<p class="secondments">Secondments through DKHA: Standard Chartered Bank — property (2023–2024); finance and banking products (2024–2026).</p>';
 $('#qualifications').innerHTML=timeline(d.qualifications);$('#education').innerHTML=timeline(d.education);
 $('#memberships').textContent=d.memberships;$('#languages').textContent=d.languages;$('#innovation').textContent=d.innovation;
 $('#last-updated').textContent='Updated '+d.updated;
 const items=d.groups.flatMap(g=>g.items.map(x=>({...x,category:g.id,categoryTitle:g.title})));
 let filter='all',query='',limit=6;
 function renderWork(){const filtered=items.filter(x=>(filter==='all'||x.category===filter)&&(!query||[x.title,x.meta,x.text,x.categoryTitle].join(' ').toLowerCase().includes(query)));const shown=filtered.slice(0,limit);
  $('#work-list').innerHTML=shown.length?shown.map((x,i)=>`<details class="matter"><summary><span class="matter-number">${String(i+1).padStart(2,'0')}</span><span><h3>${escapeHtml(x.title)}</h3><span class="matter-meta">${escapeHtml(x.meta)}</span></span><span class="matter-plus" aria-hidden="true">+</span></summary><div class="matter-body"><p>${escapeHtml(x.text)}</p></div></details>`).join(''):'<p class="empty">No matching experience. Try another keyword or category.</p>';
  $('#result-count').textContent=filtered.length+' '+(filtered.length===1?'matter':'matters');$('#show-more').hidden=shown.length>=filtered.length;
 }
 all('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;limit=6;all('[data-filter]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});renderWork();}));
 $('#work-search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();limit=6;renderWork();});
 $('#show-more').addEventListener('click',()=>{const count=all('.matter').length;limit+=8;renderWork();const next=all('.matter summary')[count];if(next)next.focus();});renderWork();
 $('#writing').innerHTML=d.writing.map(x=>{const url=x.url?safeUrl(x.url):null;const body=`<div class="meta">${escapeHtml(x.type)} · ${escapeHtml(x.publisher)} · ${escapeHtml(x.date)}</div><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.description)}</p>`;return `<article class="writing-item">${url?`<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="Read ${escapeHtml(x.title)} on ${escapeHtml(x.publisher)} (opens in a new tab)">${body}</a><a class="arrow" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="Open article">↗</a>`:`<div>${body}</div><span></span>`}</article>`;}).join('');
 if(!d.videos.length){$('#videos').innerHTML='<div class="video-empty"><div class="play-icon" aria-hidden="true">▷</div><div><h3>Conversations to follow.</h3><p>New talks and video reflections will appear here.</p></div></div>';}else{
  d.videos.forEach(v=>{const url=safeUrl(v.url);if(!url)return;const article=document.createElement('article');article.className='video-item';article.innerHTML=`<div class="eyebrow">${escapeHtml(v.date||'VIDEO')}</div><h3>${escapeHtml(v.title)}</h3><p>${escapeHtml(v.description||'')}</p>`;const a=document.createElement('a');a.href=url;a.textContent='Watch video ↗';a.className='text-link';a.target='_blank';a.rel='noopener noreferrer';article.append(a);$('#videos').append(article);});
 }
}).catch(()=>{ $('#summary').textContent='Advocate of the Supreme Court of Bangladesh and Barrister-at-Law, Lincoln’s Inn. For the full professional profile, please download the CV.';$('#work-list').innerHTML='<p class="empty">The experience list could not load. Please refresh the page or download the CV.</p>';$('#show-more').hidden=true; });
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){all('a',nav).forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -65% 0px'});all('main section[id]').forEach(x=>observer.observe(x));

// A short informational notice once per browser session; the full notice is always visible below.
const professionalNotice=$('#professional-notice');
if(professionalNotice&&typeof professionalNotice.showModal==='function'){
 const noticeKey='asif-professional-notice-v1';
 const rememberNotice=()=>{try{sessionStorage.setItem(noticeKey,'seen');}catch{}};
 const dismissNotice=()=>{rememberNotice();professionalNotice.close();};
 $('#notice-continue').addEventListener('click',dismissNotice);
 $('#notice-read').addEventListener('click',dismissNotice);
 professionalNotice.addEventListener('close',rememberNotice);
 professionalNotice.addEventListener('cancel',rememberNotice);
 let seen=false;try{seen=sessionStorage.getItem(noticeKey)==='seen';}catch{}
 if(!seen)professionalNotice.showModal();
}
