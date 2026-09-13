// MIRA 최종 홈 화면 패치
// 이전 상세 띠/별자리 기능을 불러온 뒤 index.html의 오래된 출생년도/심리테스트 로직이 덮어쓰지 못하게 마지막 상태를 적용합니다.
(function(){
  const legacy='https://raw.githubusercontent.com/kjh9410065-art/mira/2ab57f0a5c532f7203a71e73ace6283a174a1e94/assets/zodiac-links.js';
  const script=document.createElement('script');
  script.src=legacy;
  script.onload=()=>{
    const run=()=>setTimeout(finalFix,80);
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
    setTimeout(finalFix,700);
    setTimeout(finalFix,1600);
  };
  script.onerror=()=>console.error('Mira fortune legacy script failed to load.');
  document.head.appendChild(script);

  function finalFix(){
    const form=document.getElementById('birthForm'),input=document.getElementById('birthYear'),result=document.getElementById('birthResult'),fortune=document.getElementById('fortune');
    if(!form||!input||!result||!fortune)return;
    document.querySelectorAll('.tests,[href="#tests"]').forEach(el=>el.remove());
    if(form.dataset.miraFinal==='1'){applyBlankState(fortune);return;}
    const fresh=form.cloneNode(true);form.replaceWith(fresh);
    const f=document.getElementById('birthForm'),oldInput=f.querySelector('#birthYear'),r=document.getElementById('birthResult');
    if(!oldInput||!r)return;
    f.dataset.miraFinal='1';
    oldInput.type='date';oldInput.removeAttribute('min');oldInput.min='1900-01-01';oldInput.max=new Date().toISOString().slice(0,10);oldInput.placeholder='생년월일';oldInput.setAttribute('aria-label','생년월일');oldInput.classList.add('mira-final-date');
    f.insertBefore(r,oldInput);r.textContent='';r.className='birth-result';
    let reset=f.querySelector('.birth-reset');
    if(!reset){reset=document.createElement('button');reset.type='button';reset.className='birth-reset';reset.textContent='초기화';f.appendChild(reset);}
    try{localStorage.removeItem('mira_birth_year')}catch(e){}
    const saved=localStorage.getItem('mira_birth_date');if(saved&&/^\d{4}-\d{2}-\d{2}$/.test(saved)&&saved<=oldInput.max)oldInput.value=saved;

    const style=document.createElement('style');style.textContent=`
      .birth-box{position:relative!important;overflow:visible!important}.birth-form{display:grid!important;grid-template-columns:82px minmax(170px,1fr) auto 64px!important;align-items:center!important;gap:7px!important;width:min(100%,470px)!important;margin:0 0 0 auto!important}.birth-form .birth-result{grid-column:1!important;position:static!important;width:auto!important;min-width:0!important;max-width:none!important;margin:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:11px!important;font-weight:900!important;color:#5c8d71!important;text-align:left!important}.birth-form .mira-final-date{grid-column:2!important;width:100%!important;min-width:0!important;height:46px!important;box-sizing:border-box!important}.birth-form button[type="submit"]{grid-column:3!important;height:38px!important;white-space:nowrap!important}.birth-form .birth-reset{grid-column:4!important;width:64px!important;min-width:64px!important;height:38px!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#587062!important;font-size:12px!important;font-weight:900!important;cursor:pointer!important}
      #fortune.mira-pending .overview .card>*{visibility:hidden!important}#fortune.mira-pending .four .card>*{visibility:hidden!important}#fortune.mira-pending .overview .card,#fortune.mira-pending .four .card{visibility:visible!important}#fortune.mira-pending .overview{min-height:208px!important}#fortune.mira-pending .four .fortune{min-height:91px!important}
      @media(max-width:760px) and (hover:none) and (pointer:coarse){body{min-width:0!important;overflow-x:hidden!important}.birth-box{display:block!important;padding:14px!important;min-height:76px!important}.birth-copy{display:none!important}.birth-form{display:grid!important;grid-template-columns:72px minmax(70px,1fr) auto 60px!important;width:100%!important;max-width:none!important;margin:0!important;gap:5px!important}.birth-form .birth-result{grid-column:1!important;font-size:10px!important}.birth-form .mira-final-date{grid-column:2!important;height:38px!important;font-size:12px!important;padding:0 7px!important}.birth-form button[type="submit"]{grid-column:3!important;height:38px!important;padding:0 10px!important;font-size:11px!important}.birth-form .birth-reset{grid-column:4!important;width:60px!important;min-width:60px!important;height:38px!important;font-size:11px!important}.overview{grid-template-columns:1fr!important;gap:8px!important}.four{grid-template-columns:repeat(2,1fr)!important;gap:8px!important}}
    `;document.head.appendChild(style);

    f.addEventListener('submit',e=>{e.preventDefault();if(!oldInput.value){r.textContent='생년월일을 입력해주세요.';r.classList.add('birth-warning');return}showPersonalFortune(oldInput.value)});
    oldInput.addEventListener('change',()=>{if(!oldInput.value){r.textContent='';return}const y=Number(oldInput.value.slice(0,4));r.classList.remove('birth-warning');r.textContent=`${y}년생 · ${animalForYear(y)}`});
    reset.addEventListener('click',()=>{oldInput.value='';r.textContent='';r.classList.remove('birth-warning');try{localStorage.removeItem('mira_birth_date')}catch(e){}applyBlankState(fortune)});
    applyBlankState(fortune);
  }
  function applyBlankState(fortune){fortune.classList.add('mira-pending');const title=document.getElementById('fortune-title');if(title)title.textContent='오늘의 운세'}
  function animalForYear(year){const animals=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];return animals[((year-2020)%12+12)%12]}
  function showPersonalFortune(value){const p=value.split('-').map(Number),year=p[0],month=p[1],day=p[2];if(!year||!month||!day)return;const seed=year*31+month*17+day*13+new Date().getDate()*7+new Date().getMonth()*11,score=76+(Math.abs(seed)%20);const title=score>=90?'오늘은 흐름을 적극적으로 잡아보세요.':score>=84?'차분하게 움직이면 좋은 흐름이 이어져요.':'작은 선택 하나가 오늘의 분위기를 바꿔요.';const desc=score>=90?'준비해 둔 일을 실제 행동으로 옮기기 좋은 날이에요. 작은 기회라도 지나치지 말고 우선순위를 정해 움직여보세요.':score>=84?'서두르기보다 순서를 정해 움직이면 예상보다 안정적으로 일이 풀려요. 주변의 의견도 적절히 활용해보세요.':'복잡한 일을 한꺼번에 해결하려 하지 말고 눈앞의 한 가지부터 정리해보세요. 작은 진전이 다음 흐름을 만들어줍니다.';const result=document.getElementById('birthResult');result.classList.remove('birth-warning');result.textContent=`${year}년생 · ${animalForYear(year)}`;document.getElementById('fortune').classList.remove('mira-pending');const badge=document.querySelector('#fortune .badge');if(badge)badge.textContent='오늘의 흐름';const h=document.getElementById('summaryTitle');if(h)h.textContent=title;const text=document.getElementById('summaryText');if(text)text.textContent=desc;const scoreEl=document.getElementById('score');if(scoreEl)scoreEl.textContent=score;const values={money:Math.max(70,score-2),love:Math.max(68,score-4),work:Math.min(99,score+2),health:Math.max(70,score-3)};Object.keys(values).forEach(k=>{const el=document.getElementById(k);if(el)el.textContent=values[k]+'점'});const luck={luckyColor:'초록',luckyNumber:String(3+(seed%9)),luckyTime:'15:00~17:00',luckyDirection:'동쪽',luckyItem:'작은 식물'};Object.keys(luck).forEach(k=>{const el=document.getElementById(k);if(el)el.textContent=luck[k]});const texts={money:'필요한 지출과 미뤄도 되는 지출을 구분하면 안정적인 흐름을 만들 수 있어요.',love:'가까운 사람에게 먼저 마음을 표현하면 관계가 한결 부드러워져요.',work:'해야 할 일을 우선순위대로 정리하면 집중력이 살아납니다.',health:'무리해서 일정을 채우기보다 충분한 수면과 수분을 챙겨주세요.'};Object.keys(texts).forEach(k=>{const el=document.getElementById(k+'Text');if(el)el.textContent=texts[k]});try{localStorage.setItem('mira_birth_date',value)}catch(e){}}
})();
\n\n// MIRA_BIRTH_FORM_FIXED_LAYOUT\n(function(){\n  // 생년월일 입력창과 버튼을 고정 슬롯으로 배치해 경고문이 레이아웃을 밀지 못하게 합니다.\n  const s=document.createElement('style');\n  s.textContent=`\n  .birth-box{position:relative!important;}\n  .birth-form{position:absolute!important;right:17px!important;top:50%!important;transform:translateY(-50%)!important;width:335px!important;min-width:335px!important;max-width:335px!important;display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:7px!important;margin:0!important;}\n  .birth-form .birth-date-trigger{flex:0 0 230px!important;width:230px!important;min-width:230px!important;}\n  .birth-form button{flex:0 0 auto!important;}\n  .birth-result{position:fixed!important;}\n  @media(max-width:760px) and (hover:none) and (pointer:coarse){\n    .birth-box{min-height:76px!important;padding:14px!important;overflow:visible!important;}\n    .birth-copy{display:none!important;}\n    .birth-form{left:14px!important;right:auto!important;top:50%!important;width:335px!important;min-width:335px!important;max-width:335px!important;transform:translateY(-50%)!important;}\n  }`;\n  document.head.appendChild(s);\n})();\n