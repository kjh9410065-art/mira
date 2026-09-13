// MIRA 홈 운세 UI 최종 고정
// 출생년도/심리테스트를 되살리는 이전 보정 코드를 제거하고 이 파일에서만 홈 운세 UI를 관리합니다.
(function(){
  const animals=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
  const home=()=>location.pathname.replace(/\/+$/,'')==='';
  let ready=false;
  function animal(y){return animals[((y-2020)%12+12)%12];}
  function hideTests(){if(home())document.querySelectorAll('.tests,[href="#tests"],[href="/test/"],[href="/test"]').forEach(e=>e.remove());}
  function pending(){const o=document.querySelector('.overview');if(!o)return;o.classList.add('mira-pending');o.querySelectorAll('.card').forEach(c=>c.style.visibility='visible');o.querySelectorAll('.card>*').forEach(e=>e.style.visibility='hidden');}
  function show(year,month,day){
    const o=document.querySelector('.overview');if(!o)return;o.classList.remove('mira-pending');o.querySelectorAll('.card>*').forEach(e=>e.style.visibility='visible');
    const seed=year*31+month*17+day*13+new Date().getDate()*7+new Date().getMonth()*11,score=76+(seed%20),i=year%4;
    const main=o.querySelector('.main');
    if(main){const b=main.querySelector('.badge'),h=main.querySelector('h3'),p=main.querySelector('p'),s=main.querySelector('.score b');if(b)b.textContent=['좋은 흐름','안정적인 흐름','기회가 오는 흐름','차분한 흐름'][i];if(h)h.textContent=['작은 변화가 좋은 흐름을 만들어요.','천천히 움직일수록 결과가 좋아요.','새로운 기회를 놓치지 마세요.','정리와 집중이 행운을 불러요.'][i];if(p)p.textContent=['눈앞의 일을 하나씩 정리하면 생각보다 수월하게 풀리는 날이에요.','서두르기보다 순서를 정하면 오늘의 운이 안정적으로 이어져요.','평소와 다른 선택 하나가 오늘의 분위기를 바꿔줄 수 있어요.','해야 할 일을 가볍게 정리하면 마음도 한결 편안해져요.'][i];if(s)s.textContent=score;}
    o.parentElement?.querySelectorAll('.four .fortune').forEach((c,n)=>{const s=c.querySelector('strong'),p=c.querySelector('small');if(s)s.textContent=['상승','좋음','활기','안정'][n];if(p)p.textContent=['계획적인 소비에 집중하세요.','솔직한 대화가 좋은 분위기를 만들어요.','미뤄둔 일을 하나씩 정리해보세요.','무리하지 말고 충분히 쉬어주세요.'][n];});
  }
  function setup(){
    if(!home())return;hideTests();const old=document.getElementById('birthForm');if(!old)return;
    if(!ready){old.replaceWith(old.cloneNode(true));ready=true;}
    const f=document.getElementById('birthForm'),input=f.querySelector('#birthYear')||f.querySelector('input');if(!input)return;
    let r=document.getElementById('birthResult');if(!r){r=document.createElement('span');r.id='birthResult';r.className='birth-result';}
    let reset=f.querySelector('.birth-reset');if(!reset){reset=document.createElement('button');reset.type='button';reset.className='birth-reset';reset.textContent='초기화';f.appendChild(reset);}
    input.type='date';input.min='1900-01-01';input.max=new Date().toISOString().slice(0,10);input.setAttribute('aria-label','생년월일');input.classList.add('mira-home-date');f.insertBefore(r,input);
    const head=f.closest('.section')?.querySelector('.head h2');if(head)head.textContent='오늘의 운세';
    if(!f.dataset.miraBound){
      f.dataset.miraBound='1';
      input.addEventListener('change',()=>{if(!input.value){r.textContent='';return;}const y=+input.value.slice(0,4);r.classList.remove('birth-warning');r.textContent=y+'년생 · '+animal(y);});
      f.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();if(!input.value){r.textContent='생년월일을 입력해주세요.';r.classList.add('birth-warning');return;}const [y,m,d]=input.value.split('-').map(Number);r.classList.remove('birth-warning');r.textContent=y+'년생 · '+animal(y);try{localStorage.setItem('mira_birth_date',input.value);localStorage.removeItem('mira_birth_year');}catch(x){}show(y,m,d);},true);
      reset.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();input.value='';r.textContent='';r.classList.remove('birth-warning');try{localStorage.removeItem('mira_birth_date');localStorage.removeItem('mira_birth_year');}catch(x){}pending();},true);
    }
    try{const saved=localStorage.getItem('mira_birth_date');if(saved&&/^\d{4}-\d{2}-\d{2}$/.test(saved)){input.value=saved;const y=+saved.slice(0,4);r.textContent=y+'년생 · '+animal(y);}}catch(x){}
    if(!f.dataset.miraInitial){f.dataset.miraInitial='1';pending();}style();
  }
  function style(){if(document.getElementById('mira-final-style'))return;const s=document.createElement('style');s.id='mira-final-style';s.textContent=`
    .birth-form{display:grid!important;grid-template-columns:82px minmax(190px,1fr) auto 64px!important;gap:7px!important;align-items:center!important;width:min(470px,100%)!important;min-width:0!important}.birth-form .birth-result{grid-column:1!important;grid-row:1!important;position:static!important;width:82px!important;min-width:82px!important;max-width:82px!important;margin:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important;font-size:11px!important;font-weight:900!important;color:#5c8d71!important}.birth-form .birth-result.birth-warning{color:#a15b4c!important;overflow:visible!important}.birth-form .mira-home-date,.birth-form input{grid-column:2!important;grid-row:1!important;width:100%!important;min-width:0!important;height:38px!important;box-sizing:border-box!important}.birth-form button[type="submit"]{grid-column:3!important;grid-row:1!important;height:38px!important;white-space:nowrap!important}.birth-form .birth-reset{grid-column:4!important;grid-row:1!important;width:64px!important;min-width:64px!important;height:38px!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#587062!important;font-size:12px!important;font-weight:900!important;cursor:pointer!important}.mira-pending .card>*{visibility:hidden!important}.mira-pending .card{visibility:visible!important}@media(max-width:760px) and (hover:none) and (pointer:coarse){.tests{display:none!important}.birth-form{grid-template-columns:72px minmax(0,1fr) auto 60px!important;width:100%!important;gap:5px!important}.birth-form .birth-result{grid-column:1!important;width:72px!important;min-width:72px!important;max-width:72px!important;font-size:10px!important}.birth-form .mira-home-date,.birth-form input{grid-column:2!important}.birth-form button[type="submit"]{grid-column:3!important;padding:0 10px!important}.birth-form .birth-reset{grid-column:4!important;width:60px!important;min-width:60px!important;font-size:11px!important}}
  `;document.head.appendChild(s);}
  function boot(){hideTests();setup();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  const observer=new MutationObserver(()=>{if(home()){hideTests();setup();}});const start=()=>{if(document.body)observer.observe(document.body,{childList:true,subtree:true});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
