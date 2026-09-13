// MIRA 홈 운세 - 생년월일 간지·오행 기반 결정론적 계산
(function(){
  const animals=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
  const stems=['갑','을','병','정','무','기','경','신','임','계'];
  const branches=['자','축','인','묘','진','사','오','미','신','유','술','해'];
  const stemElement=['목','목','화','화','토','토','금','금','수','수'];
  const branchElement=['수','토','목','목','토','화','화','토','미','금','토','수'];
  const elementIndex={목:0,화:1,토:2,금:3,수:4};
  const home=()=>location.pathname.replace(/\/+$/,'')==='';
  const animal=y=>animals[((y-2020)%12+12)%12];

  function yearPillar(year){
    const index=((year-4)%60+60)%60;
    return {index,stem:stems[index%10],branch:branches[index%12],element:stemElement[index%10]};
  }

  function julianDay(year,month,day){
    let y=year,m=month;
    if(m<=2){y--;m+=12;}
    const a=Math.floor(y/100);
    const b=2-a+Math.floor(a/4);
    return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524;
  }

  function dayPillar(year,month,day){
    const index=((julianDay(year,month,day)+49)%60+60)%60;
    return {index,stem:stems[index%10],branch:branches[index%12],element:stemElement[index%10],branchElement:branchElement[index%12]};
  }

  // 생년월일과 오늘의 간지·오행 관계만 사용합니다. 난수는 사용하지 않습니다.
  function relationScore(birth,today){
    const a=elementIndex[birth.element];
    const b=elementIndex[today.element];
    if(a===b)return 4;
    if((a+1)%5===b)return 5;
    if((b+1)%5===a)return 3;
    if((a+2)%5===b)return 1;
    return 2;
  }

  function calcFortune(year,month,day){
    const now=new Date();
    const birthYear=yearPillar(year);
    const birthDay=dayPillar(year,month,day);
    const today=dayPillar(now.getFullYear(),now.getMonth()+1,now.getDate());

    const yearRelation=relationScore(birthYear,today);
    const dayRelation=relationScore(birthDay,today);
    const branchRelation=relationScore({element:birthDay.branchElement},today);

    const scores={
      total:Math.max(55,Math.min(95,68+yearRelation*2+dayRelation*3+branchRelation)),
      money:Math.max(55,Math.min(95,67+yearRelation*2+dayRelation*2+branchRelation*2)),
      love:Math.max(55,Math.min(95,69+yearRelation+dayRelation*3+branchRelation*2)),
      work:Math.max(55,Math.min(95,68+yearRelation*3+dayRelation*2+branchRelation)),
      health:Math.max(55,Math.min(95,70+yearRelation+dayRelation*2+branchRelation*2))
    };

    const level=s=>s>=88?'매우 좋음':s>=82?'좋음':s>=75?'무난함':'주의';
    const relationText={
      1:'오늘의 기운과 부딪히는 부분이 있어 서두르기보다 한 번 더 확인하는 편이 좋아요.',
      2:'오늘의 기운을 조절해야 하는 흐름이라 무리한 선택보다 균형이 중요해요.',
      3:'오늘의 기운이 부족한 부분을 보완해 주는 흐름이라 차분히 움직이면 도움이 돼요.',
      4:'출생 기운과 오늘의 기운이 같은 방향으로 움직여 안정적으로 이어지기 쉬워요.',
      5:'출생 기운이 오늘의 흐름을 자연스럽게 만들어 주는 관계라 적극적으로 움직이기 좋아요.'
    };
    const band=s=>s>=86?'high':s>=75?'mid':'low';
    const moneyText={high:'필요한 곳에 집중해서 쓰면 금전 흐름을 안정적으로 가져갈 수 있어요.',mid:'큰 결정보다는 계획적인 소비와 작은 절약이 도움이 되는 날이에요.',low:'충동적인 지출이나 즉흥적인 결정은 한 번 더 생각하고 움직이는 게 좋아요.'};
    const loveText={high:'먼저 마음을 표현하면 관계가 한층 부드럽게 풀릴 수 있어요.',mid:'상대의 말을 끝까지 듣는 것이 오늘의 관계운을 좋게 만드는 포인트예요.',low:'감정적으로 결론을 내리기보다 조금 여유를 두고 대화하는 편이 좋아요.'};
    const workText={high:'미뤄둔 일을 시작하기 좋은 흐름이에요. 작은 일부터 처리해보세요.',mid:'한꺼번에 처리하기보다 우선순위를 정하면 실수가 줄어들어요.',low:'속도보다 정확도가 중요한 날이에요. 중요한 결정은 한 번 더 확인하세요.'};
    const healthText={high:'컨디션이 비교적 안정적인 흐름이라 가벼운 활동을 꾸준히 이어가면 좋아요.',mid:'생활 리듬을 일정하게 유지하고 과하게 무리하지 않는 것이 좋아요.',low:'피로를 쌓아두지 않는 것이 중요해요. 오늘은 휴식과 수면을 우선하세요.'};

    return {birthYear,birthDay,today,scores,level,relation:relationText[yearRelation],moneyText:moneyText[band(scores.money)],loveText:loveText[band(scores.love)],workText:workText[band(scores.work)],healthText:healthText[band(scores.health)]};
  }

  function hideTests(){
    if(home()) document.querySelectorAll('.tests,[href="#tests"],[href="/test/"],[href="/test"]').forEach(e=>e.remove());
  }

  // 생년월일을 확인하기 전에는 모든 운세 내용과 점수를 비웁니다.
  function pending(){
    const o=document.querySelector('.overview');
    if(!o)return;
    o.classList.remove('mira-ready');
    o.classList.add('mira-pending');

    o.querySelectorAll('.score').forEach(el=>{
      el.style.setProperty('display','none','important');
      const value=el.querySelector('b');
      if(value)value.textContent='';
    });

    // 아래 4개 카드의 점수/설명은 HTML에 들어 있는 기본값까지 모두 제거합니다.
    o.querySelectorAll('.four .fortune').forEach(card=>{
      card.querySelectorAll('strong,small,.score').forEach(el=>{
        el.textContent='';
        el.style.setProperty('display','none','important');
      });
    });
  }

  function show(year,month,day){
    const o=document.querySelector('.overview');
    if(!o)return;
    const f=calcFortune(year,month,day);
    o.classList.remove('mira-pending');
    o.classList.add('mira-ready');

    const main=o.querySelector('.main');
    if(main){
      const badge=main.querySelector('.badge'),h=main.querySelector('h3'),p=main.querySelector('p'),s=main.querySelector('.score b');
      if(badge)badge.textContent=f.level(f.scores.total);
      if(h)h.textContent=`${f.birthYear.stem}${f.birthYear.branch} · ${f.birthDay.stem}${f.birthDay.branch} · 오늘 ${f.today.stem}${f.today.branch}`;
      if(p)p.textContent=f.relation;
      if(s)s.textContent=f.scores.total;
      const score=main.querySelector('.score');
      if(score)score.style.removeProperty('display');
    }

    o.querySelectorAll('.four .fortune').forEach((c,n)=>{
      const scores=[f.scores.money,f.scores.love,f.scores.work,f.scores.health];
      const titles=[f.level(scores[0]),f.level(scores[1]),f.level(scores[2]),f.level(scores[3])];
      const texts=[f.moneyText,f.loveText,f.workText,f.healthText];
      const s=c.querySelector('strong'),p=c.querySelector('small'),score=c.querySelector('.score b');
      if(s){s.textContent=titles[n];s.style.removeProperty('display');}
      if(p){p.textContent=texts[n];p.style.removeProperty('display');}
      if(score){score.textContent=scores[n];score.style.removeProperty('display');}
    });
  }

  function style(){
    if(document.getElementById('mira-final-style'))return;
    const s=document.createElement('style');
    s.id='mira-final-style';
    s.textContent=`
      .birth-form{display:grid!important;grid-template-columns:125px minmax(180px,1fr) auto 72px!important;gap:7px!important;align-items:center!important;width:min(500px,100%)!important;min-width:0!important}
      .birth-form .birth-result{grid-column:1!important;grid-row:1!important;position:static!important;width:125px!important;min-width:125px!important;max-width:125px!important;margin:0!important;white-space:nowrap!important;overflow:visible!important;text-align:left!important;transform:translateX(-20px)!important;font-size:11px!important;font-weight:900!important;color:#5c8d71!important}
      .birth-form .birth-result.birth-warning{color:#a15b4c!important}
      .birth-form .mira-date-trigger{grid-column:2!important;grid-row:1!important;width:100%!important;height:38px!important;box-sizing:border-box!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#5b675f!important;padding:0 12px!important;text-align:left!important;font-size:13px!important;cursor:pointer!important;position:relative!important}
      .birth-form .mira-date-trigger::after{content:'▾';position:absolute;right:12px;top:9px;font-size:12px;color:#68756d}
      .birth-form button[type="submit"]{grid-column:3!important;grid-row:1!important;height:38px!important;white-space:nowrap!important}
      .birth-form .birth-reset{grid-column:4!important;grid-row:1!important;width:72px!important;min-width:72px!important;height:38px!important;box-sizing:border-box!important;padding:0 8px!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#587062!important;font-size:12px!important;font-weight:900!important;white-space:nowrap!important;word-break:keep-all!important;cursor:pointer!important}
      .mira-date-popup{position:absolute!important;z-index:9999!important;display:none!important;width:330px!important;padding:14px!important;background:#fffdf8!important;border:1px solid #d3cdbf!important;border-radius:12px!important;box-shadow:0 10px 30px rgba(60,55,45,.15)!important;box-sizing:border-box!important}
      .mira-date-popup.open{display:block!important}
      .mira-date-popup .mira-date-title{font-size:12px!important;font-weight:900!important;color:#53655b!important;margin-bottom:9px!important}
      .mira-date-popup .mira-date-selects{display:grid!important;grid-template-columns:1.3fr 1fr 1fr!important;gap:6px!important}
      .mira-date-popup select{width:100%!important;height:38px!important;border:1px solid #d3cdbf!important;border-radius:8px!important;background:#fff!important;padding:0 8px!important;font-size:13px!important;color:#34443c!important;cursor:pointer!important}
      .mira-date-popup .mira-date-actions{display:flex!important;justify-content:flex-end!important;gap:6px!important;margin-top:9px!important}
      .mira-date-popup button{height:34px!important;padding:0 12px!important;border-radius:8px!important;border:1px solid #d3cdbf!important;background:#fff!important;color:#52645a!important;font-weight:800!important;cursor:pointer!important}
      .mira-date-popup .mira-date-ok{background:#5c8d71!important;color:#fff!important;border-color:#5c8d71!important}
      /* 출생일 확인 전에는 메인 운세 카드와 하단 4개 카드의 내용이 보이지 않습니다. */
      .overview.mira-pending .score{display:none!important}
      .overview.mira-pending .card>*{visibility:hidden!important;opacity:0!important}
      .overview.mira-pending .card{visibility:visible!important}
      .overview.mira-pending .four .fortune>*{visibility:hidden!important;opacity:0!important}
      .overview.mira-pending .four .fortune h3{visibility:visible!important;opacity:1!important}
      .overview.mira-ready .score{display:flex!important}
      .overview.mira-ready .card>*{visibility:visible!important;opacity:1!important}
      .overview.mira-ready .four .fortune>*{visibility:visible!important;opacity:1!important}
      @media(max-width:760px) and (hover:none) and (pointer:coarse){
        .tests{display:none!important}
        .birth-form{grid-template-columns:115px minmax(0,1fr) auto 68px!important;width:100%!important;gap:5px!important}
        .birth-form .birth-result{width:115px!important;min-width:115px!important;max-width:115px!important;font-size:10px!important;transform:translateX(-12px)!important}
        .birth-form .mira-date-trigger{grid-column:2!important;font-size:12px!important}
        .birth-form button[type="submit"]{grid-column:3!important;padding:0 10px!important}
        .birth-form .birth-reset{grid-column:4!important;width:68px!important;min-width:68px!important;font-size:11px!important;padding:0 6px!important}
        .mira-date-popup{position:fixed!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;width:min(330px,calc(100vw - 24px))!important}
      }
    `;
    document.head.appendChild(s);
  }

  function setup(){
    if(!home())return;
    hideTests();
    style();
    const old=document.getElementById('birthForm');
    if(!old)return;
    const form=old.cloneNode(true);
    old.replaceWith(form);

    const oldInput=form.querySelector('#birthYear')||form.querySelector('input');
    if(!oldInput)return;

    let r=document.getElementById('birthResult');
    if(!r){r=document.createElement('span');r.id='birthResult';r.className='birth-result';}

    const trigger=document.createElement('button');
    trigger.type='button';
    trigger.className='mira-date-trigger';
    trigger.textContent='생년월일 선택';
    trigger.setAttribute('aria-label','생년월일 선택');
    oldInput.replaceWith(trigger);

    let reset=form.querySelector('.birth-reset');
    if(!reset){reset=document.createElement('button');reset.type='button';reset.className='birth-reset';form.appendChild(reset);}
    reset.type='button';
    reset.textContent='초기화';

    if(r.parentElement!==form||r.nextElementSibling!==trigger)form.insertBefore(r,trigger);
    const head=form.closest('.section')?.querySelector('.head h2');
    if(head)head.textContent='오늘의 운세';

    const popup=document.createElement('div');
    popup.className='mira-date-popup';
    popup.innerHTML=`<div class="mira-date-title">생년월일을 선택하세요</div><div class="mira-date-selects"><select class="mira-year" aria-label="출생년도"></select><select class="mira-month" aria-label="출생월"></select><select class="mira-day" aria-label="출생일"></select></div><div class="mira-date-actions"><button type="button" class="mira-date-cancel">취소</button><button type="button" class="mira-date-ok">선택</button></div>`;
    document.body.appendChild(popup);

    const ys=popup.querySelector('.mira-year'),ms=popup.querySelector('.mira-month'),ds=popup.querySelector('.mira-day');
    const currentYear=new Date().getFullYear();
    const yearPlaceholder=document.createElement('option');
    yearPlaceholder.value='';
    yearPlaceholder.textContent='년도';
    yearPlaceholder.disabled=true;
    yearPlaceholder.selected=true;
    ys.appendChild(yearPlaceholder);
    for(let y=currentYear;y>=1900;y--){const o=document.createElement('option');o.value=y;o.textContent=y+'년';ys.appendChild(o);}
    for(let m=1;m<=12;m++){const o=document.createElement('option');o.value=m;o.textContent=m+'월';ms.appendChild(o);}

    function fillDays(){
      const y=Number(ys.value),m=Number(ms.value)||1,max=y?new Date(y,m,0).getDate():31,oldDay=Number(ds.value)||1;
      ds.innerHTML='';
      for(let d=1;d<=max;d++){const o=document.createElement('option');o.value=d;o.textContent=d+'일';ds.appendChild(o);}
      ds.value=String(Math.min(oldDay,max));
    }
    ms.value='1';
    fillDays();
    ys.addEventListener('change',fillDays);
    ms.addEventListener('change',fillDays);

    function openPicker(){
      const rect=trigger.getBoundingClientRect();
      popup.classList.add('open');
      if(window.matchMedia('(max-width:760px) and (hover:none) and (pointer:coarse)').matches)return;
      popup.style.left=Math.max(12,Math.min(window.innerWidth-342,rect.left))+'px';
      popup.style.top=(rect.bottom+7)+'px';
    }
    function closePicker(){popup.classList.remove('open');}

    trigger.addEventListener('click',e=>{e.preventDefault();openPicker();});
    popup.querySelector('.mira-date-cancel').addEventListener('click',closePicker);
    popup.querySelector('.mira-date-ok').addEventListener('click',()=>{
      const y=Number(ys.value),m=Number(ms.value),d=Number(ds.value);
      if(!y)return;
      trigger.textContent=`${y}년 ${String(m).padStart(2,'0')}월 ${String(d).padStart(2,'0')}일`;
      trigger.dataset.date=`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      r.textContent=y+'년생 · '+animal(y);
      r.classList.remove('birth-warning');
      closePicker();
    });

    document.addEventListener('click',e=>{if(popup.classList.contains('open')&&!popup.contains(e.target)&&e.target!==trigger)closePicker();},{passive:true});

    form.addEventListener('submit',e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      const value=trigger.dataset.date||'';
      if(!value){r.textContent='생년월일을 선택해주세요.';r.classList.add('birth-warning');pending();return;}
      const [y,m,d]=value.split('-').map(Number);
      r.classList.remove('birth-warning');
      r.textContent=y+'년생 · '+animal(y);
      try{localStorage.setItem('mira_birth_date',value);localStorage.removeItem('mira_birth_year');}catch(x){}
      show(y,m,d);
    },true);

    reset.addEventListener('click',e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      trigger.textContent='생년월일 선택';
      delete trigger.dataset.date;
      r.textContent='';
      r.classList.remove('birth-warning');
      try{localStorage.removeItem('mira_birth_date');localStorage.removeItem('mira_birth_year');}catch(x){}
      closePicker();
      pending();
    },true);

    try{
      const saved=localStorage.getItem('mira_birth_date');
      if(saved&&/^\d{4}-\d{2}-\d{2}$/.test(saved)){
        const [y,m,d]=saved.split('-').map(Number);
        trigger.dataset.date=saved;
        trigger.textContent=`${y}년 ${String(m).padStart(2,'0')}월 ${String(d).padStart(2,'0')}일`;
        r.textContent=y+'년생 · '+animal(y);
      }
    }catch(x){}

    // 새로 들어오거나 새로고침해도 운세는 반드시 빈 상태로 시작합니다.
    pending();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();
