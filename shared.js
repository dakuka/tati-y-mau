(() => {
 'use strict';
 const cfg=window.BODA;
 const $=s=>document.querySelector(s);
 const root=document.documentElement;
 const icons={play:'<svg viewBox="0 0 24 24" class="play" aria-hidden="true"><path d="m9 5 10 7-10 7Z"/></svg>',pause:'<svg viewBox="0 0 24 24" class="pause" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>'};
 document.body.insertAdjacentHTML('beforeend',`
 <button class="audio-toggle" aria-label="Reproducir música" aria-pressed="false" title="Piano instrumental original">${icons.play}${icons.pause}</button>
 <div class="toast" role="status" aria-live="polite"></div>
 <dialog id="rsvp" aria-labelledby="rsvp-title"><button class="close" aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><h2 id="rsvp-title">Contamos con vos</h2><p>Nos hace mucha ilusión compartir este día con vos.</p><form id="rsvp-form"><label for="guest">Tu nombre y apellido</label><input id="guest" name="guest" autocomplete="name" required maxlength="100"><label for="reply">Tu respuesta</label><select id="reply" name="reply" style="padding:12px;width:100%;background:transparent;color:inherit;border:1px solid #879182"><option value="si">Voy a acompañarlos</option><option value="no">No voy a poder asistir</option></select><label for="message">Mensaje para Tati y Mau</label><textarea id="message" readonly></textarea><p class="field-note" id="rsvp-note"></p><button class="btn" type="submit" id="rsvp-submit"></button></form></dialog>
 <dialog id="dress" aria-labelledby="dress-title"><button class="close" aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><h2 id="dress-title">Nuestro vestidor</h2><p>Tenida cocktail. Algunas ideas para acompañarnos.</p><div class="wardrobe"><img src="../assets/vestidor.webp" alt="Ilustraciones de un vestido midi verde, un enterito borgoña, un traje azul y un traje arena." width="1536" height="1024"><button class="wardrobe-opening" aria-label="Abrir las puertas del vestidor"><span class="closet-door left"><span></span></span><span class="closet-door right"><span></span></span><span class="closet-caption">Tocá para abrir</span></button></div><div class="look-picker" aria-label="Ideas de tenida"><button data-look="0" aria-pressed="true">Vestido</button><button data-look="1" aria-pressed="false">Enterito</button><button data-look="2" aria-pressed="false">Azul</button><button data-look="3" aria-pressed="false">Arena</button></div><p class="look-description" aria-live="polite">Vestido corto o midi, con sandalias o zapatos de vestir.</p><p class="dress-note">Son ideas para inspirarte. Elegí los colores y el estilo que más te gusten.</p></dialog>
 <dialog id="original" class="original-dialog" aria-label="Invitación original"><button class="close" aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><img src="../assets/invitacion.webp" alt="Invitación original de Tatiana y Mauricio. Boda civil, 7 de noviembre de 2026 a las 17:00, Castelar 779 c/ Venezuela. Tenida cocktail."></dialog>`);
 const looks=['Vestido corto o midi, con sandalias o zapatos de vestir.','Un enterito elegante o un conjunto de dos piezas.','Traje azul con camisa. Una opción clásica para celebrar.','Pantalón de vestir, camisa y saco en tonos claros.'];
 $('.wardrobe-opening').addEventListener('click',()=>$('.wardrobe').classList.add('opened'));
 document.querySelectorAll('[data-look]').forEach(b=>b.addEventListener('click',()=>{ $('.wardrobe').classList.add('opened'); document.querySelectorAll('[data-look]').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); $('.look-description').textContent=looks[Number(b.dataset.look)]; }));
 let toastTimer;
 function toast(message){$('.toast').textContent=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('.toast').textContent='',3500)}
 async function copy(text){try{await navigator.clipboard.writeText(text);return true}catch{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();return ok}}
 document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const ok=await copy(cfg[b.dataset.copy]);toast(ok?'Copiado. Ya podés pegarlo.':'No se pudo copiar. Mantené presionado el dato para seleccionarlo.')}));
 document.querySelectorAll('[data-map]').forEach(a=>a.href=cfg.mapsUrl);
 document.querySelectorAll('[data-value]').forEach(el=>el.textContent=cfg[el.dataset.value]);
 let lastFocus;
 document.querySelectorAll('[data-dialog]').forEach(b=>b.addEventListener('click',()=>{lastFocus=b;$('#'+b.dataset.dialog).showModal();if(b.dataset.dialog==='rsvp')updateMessage()}));
 document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});d.addEventListener('close',()=>lastFocus?.focus())});
 function updateMessage(){const name=$('#guest').value.trim();const yes=$('#reply').value==='si';$('#message').value=`Hola Tati y Mau, soy ${name||'[tu nombre]'}. ${yes?'Confirmo mi asistencia a':'No voy a poder acompañarlos en'} su boda del 7 de noviembre. ${yes?'Gracias por invitarme a compartir este día.':'Les deseo un día hermoso.'}`}
 $('#guest').addEventListener('input',updateMessage);$('#reply').addEventListener('change',updateMessage);
 const hasPhone=/^\d{10,15}$/.test(cfg.whatsapp);
 $('#rsvp-note').textContent=hasPhone?'Se abrirá el WhatsApp de Mau con tu respuesta. Revisala y tocá enviar.':'Copiá tu respuesta y compartila con Tati o Mau para confirmar.';
 $('#rsvp-submit').textContent=hasPhone?'Continuar en WhatsApp':'Copiar mi respuesta';
 $('#rsvp-form').addEventListener('submit',async e=>{e.preventDefault();updateMessage();if(hasPhone){window.open('https://wa.me/'+cfg.whatsapp+'?text='+encodeURIComponent($('#message').value),'_blank','noopener')}else{const ok=await copy($('#message').value);toast(ok?'Respuesta copiada. Compartila con Tati o Mau.':'Seleccioná el mensaje y copialo para enviarlo.')}});
 const target=new Date(cfg.date).getTime();
 function tick(){const diff=Math.max(0,target-Date.now());const units=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];document.querySelectorAll('[data-count]').forEach((el)=>{el.textContent=String(units[Number(el.dataset.count)]).padStart(2,'0')});if(!diff){document.querySelectorAll('[data-count-title]').forEach(el=>el.textContent='Llegó nuestro día')}}tick();setInterval(tick,1000);
 const guest=new URLSearchParams(location.search).get('para');if(guest){document.querySelectorAll('[data-guest]').forEach(el=>{el.textContent='Para vos, '+guest.slice(0,80);el.hidden=false})}
 document.querySelectorAll('[data-calendar]').forEach(b=>b.addEventListener('click',()=>{const date=new Date(cfg.date);const compact=d=>d.toISOString().replace(/[-:]/g,'').replace('.000','');const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Tati y Mau//Invitacion//ES','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:20261107-boda-tati-mau@invitacion','DTSTAMP:20261030T120000Z','DTSTART:'+compact(date),'SUMMARY:Boda civil de Tati y Mau','LOCATION:'+cfg.address,'DESCRIPTION:Tenida cocktail. Boda civil de Tatiana y Mauricio.','END:VEVENT','END:VCALENDAR'];const blob=new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='boda-tati-y-mau.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Se descargó la fecha para tu calendario.')}));
 const audio=new Audio(cfg.music);audio.loop=true;audio.preload='auto';audio.volume=.4;audio.muted=new URLSearchParams(location.search).has('silencio');
 const musicButton=$('.audio-toggle');let musicReady=false;
 async function loadAudio(){if(musicReady)return;try{const response=await fetch(cfg.music);if(!response.ok)throw Error('audio');const blobUrl=URL.createObjectURL(await response.blob());if(audio.paused&&!audio.currentTime)audio.src=blobUrl;musicReady=true}catch{/* El archivo local sigue disponible como respaldo. */}}
 loadAudio();
 const syncMusic=()=>{const playing=!audio.paused;musicButton.setAttribute('aria-pressed',String(playing));musicButton.setAttribute('aria-label',playing?'Pausar música':'Reproducir música')};
 async function playMusic(){try{await audio.play();syncMusic()}catch{syncMusic();toast('Tocá el botón de música para escuchar.')}}
 musicButton.addEventListener('click',()=>{if(audio.paused)playMusic();else{audio.pause();syncMusic()}});audio.addEventListener('pause',syncMusic);audio.addEventListener('play',syncMusic);audio.addEventListener('error',()=>{musicButton.setAttribute('aria-pressed','false')});
 const opener=$('[data-open]');
 const intro=$('.intro');
 const main=$('main');
 const skip=$('[data-skip]');
 let opening=false;
 let openingId=0;
 function finishOpening(){
  if(!opening)return;
  opening=false;
  intro.hidden=true;
  document.body.classList.remove('is-opening');
  document.body.classList.add('is-open');
  main.removeAttribute('inert');
  skip.hidden=true;
  main.focus({preventScroll:true});
 }
 async function openInvitation(){
  if(opening)return;
  opening=true;
  const thisOpening=++openingId;
  opener.disabled=true;
  opener.setAttribute('aria-expanded','true');
  skip.hidden=false;
  document.body.classList.add('is-opening');
  playMusic();
  const sequence=intro.getAnimations({subtree:true}).filter(a=>Number.isFinite(a.effect.getTiming().iterations));
  await Promise.allSettled(sequence.map(a=>a.finished));
  if(thisOpening===openingId)finishOpening();
 }
 if(opener){opener.addEventListener('click',openInvitation);skip.addEventListener('click',finishOpening)}
 document.querySelectorAll('[data-replay]').forEach(button=>button.addEventListener('click',()=>{
  openingId++;
  opening=false;
  intro.hidden=false;
  document.body.classList.remove('is-open','is-opening');
  main.setAttribute('inert','');
  opener.disabled=false;
  opener.setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'instant'});
  opener.focus({preventScroll:true});
 }));
})();
