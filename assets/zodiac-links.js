// MIRA 홈 운세 UI - 생년월일 클릭 선택형
(function(){
  const animals=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
  const home=()=>location.pathname.replace(/\/+$/,'')==='';
  const animal=y=>animals[((y-2020)%12+12)%12];

  function hideTests(){
    if(home()) document.querySelectorAll('.tests,[href="#tests"],[href="/test/"],[href="/test"]').forEach(e=>e.remove());
  }

  // 출생일을 선택하기 전에는 운세 결과를 전부 숨깁니다.
  function pending(){
    const o=document.querySelector('.overview');
    if(!o)return;
    o.classList.remove('mira-ready');
    o.classList.add('mira-pending');
  }

  // 선택한 생년월일을 기준으로 운세 결과를 표시합니다.
  function show(year,month,day){
    const o=document.querySelector('.overview');
    if(!o)return;
    o.classList.remove('mira-pending');
    o.classList.add('mira-ready');

    const now=new Date();
    const seed=year*31+month*17+day*13+now.getDate()*7+now.getMonth()*11;
    const i=year%4;
    const main=o.querySelector('.main');

    if(main){
      const b=main.querySelector('.badge'),h=main.querySelector('h3'),p=main.querySelector('p'),s=main.querySelector('.score b');
      if(b)b.textContent=['좋은 흐름','안정적인 흐름','기회가 오는 흐름','차분한 흐름'][i];
      if(h)h.textContent=['작은 변화가 좋은 흐름을 만들어요.','천천히 움직일수록 결과가 좋아요.','새로운 기회를 놓치지 마세요.','정리와 집중이 행운을 불러요.'][i];
      if(p)p.textContent=['눈앞의 일을 하나씩 정리하면 생각보다 수월하게 풀리는 날이에요.','서두르기보다 순서를 정하면 오늘의 운이 안정적으로 이어져요.','평소와 다른 선택 하나가 오늘의 분위기를 바꿔줄 수 있어요.','해야 할 일을 가볍게 정리하면 마음도 한결 편안해져요.'][i];
      if(s)s.textContent=76+(seed%20);
    }

    o.querySelectorAll('.four .fortune').forEach((c,n)=>{
      const s=c.querySelector('strong'),p=c.querySelector('small');
      if(s)s.textContent=['상승','좋음','활기','안정'][n];
      if(p)p.textContent=['계획적인 소비에 집중하세요.','솔직한 대화가 좋은 분위기를 만들어요.','미뤄둔 일을 하나씩 정리해보세요.','무리하지 말고 충분히 쉬어주세요.'][n];
    });
  }

  function style(){
    if(document.getElementById('mira-final-style'))return;
    const s=document.createElement('style');
    s.id='mira-final-style';
    s.textContent=`
      .birth-form{display:grid!important;grid-template-columns:125px minmax(190px,1fr) auto 64px!important;gap:7px!important;align-items:center!important;width:min(500px,100%)!important;min-width:0!important}
      .birth-form .birth-result{grid-column:1!important;grid-row:1!important;position:static!important;width:125px!important;min-width:125px!important;max-width:125px!important;margin:0!important;white-space:nowrap!important;overflow:visible!important;text-align:left!important;transform:translateX(-20px)!important;font-size:11px!important;font-weight:900!important;color:#5c8d71!important}
      .birth-form .birth-result.birth-warning{color:#a15b4c!important}
      /* 입력칸 전체가 클릭 영역입니다. 직접 숫자를 입력하지 않습니다. */
      .birth-form .mira-date-trigger{grid-column:2!important;grid-row:1!important;width:100%!important;height:38px!important;box-sizing:border-box!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#5b675f!important;padding:0 12px!important;text-align:left!important;font-size:13px!important;cursor:pointer!important;position:relative!important}
      .birth-form .mira-date-trigger::after{content:'▾';position:absolute;right:12px;top:9px;font-size:12px;color:#68756d}
      .birth-form button[type="submit"]{grid-column:3!important;grid-row:1!important;height:38px!important;white-space:nowrap!important}
      .birth-form .birth-reset{grid-column:4!important;grid-row:1!important;width:64px!important;min-width:64px!important;height:38px!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#587062!important;font-size:12px!important;font-weight:900!important;cursor:pointer!important}
      .mira-date-popup{position:absolute!important;z-index:9999!important;display:none!important;width:330px!important;padding:14px!important;background:#fffdf8!important;border:1px solid #d3cdbf!important;border-radius:12px!important;box-shadow:0 10px 30px rgba(60,55,45,.15)!important;box-sizing:border-box!important}
      .mira-date-popup.open{display:block!important}
      .mira-date-popup .mira-date-title{font-size:12px!important;font-weight:900!important;color:#53655b!important;margin-bottom:9px!important}
      .mira-date-popup .mira-date-selects{display:grid!important;grid-template-columns:1.3fr 1fr 1fr!important;gap:6px!important}
      .mira-date-popup select{width:100%!important;height:38px!important;border:1px solid #d3cdbf!important;border-radius:8px!important;background:#fff!important;padding:0 8px!important;font-size:13px!important;color:#34443c!important;cursor:pointer!important}
      .mira-date-popup .mira-date-actions{display:flex!important;justify-content:flex-end!important;gap:6px!important;margin-top:9px!important}
      .mira-date-popup button{height:34px!important;padding:0 12px!important;border-radius:8px!important;border:1px solid #d3cdbf!important;background:#fff!important;color:#52645a!important;font-weight:800!important;cursor:pointer!important}
      .mira-date-popup .mira-date-ok{background:#5c8d71!important;color:#fff!important;border-color:#5c8d71!important}
      .overview.mira-pending .card>*{visibility:hidden!important;opacity:0!important}
      .overview.mira-pending .card{visibility:visible!important}
      .overview.mira-ready .card>*{visibility:visible!important;opacity:1!important}
      @media(max-width:760px) and (hover:none) and (pointer:coarse){
        .tests{display:none!important}
        .birth-form{grid-template-columns:115px minmax(0,1fr) auto 60px!important;width:100%!important;gap:5px!important}
        .birth-form .birth-result{width:115px!important;min-width:115px!important;max-width:115px!important;font-size:10px!important;transform:translateX(-12px)!important}
        .birth-form .mira-date-trigger{grid-column:2!important;font-size:12px!important}
        .birth-form button[type="submit"]{grid-column:3!important;padding:0 10px!important}
        .birth-form .birth-reset{grid-column:4!important;width:60px!important;min-width:60px!important;font-size:11px!important}
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

    // 기존 input을 직접 입력창으로 쓰지 않고, 클릭해서 선택하는 버튼으로 교체합니다.
    const trigger=document.createElement('button');
    trigger.type='button';
    trigger.className='mira-date-trigger';
    trigger.textContent='생년월일 선택';
    trigger.setAttribute('aria-label','생년월일 선택');
    oldInput.replaceWith(trigger);

    let reset=form.querySelector('.birth-reset');
    if(!reset){
      reset=document.createElement('button');
      reset.type='button';
      reset.className='birth-reset';
      reset.textContent='초기화';
      form.appendChild(reset);
    }else{
      reset.type='button';
      reset.textContent='초기화';
    }

    if(r.parentElement!==form||r.nextElementSibling!==trigger)form.insertBefore(r,trigger);
    const head=form.closest('.section')?.querySelector('.head h2');
    if(head)head.textContent='오늘의 운세';

    // 년·월·일을 모두 클릭으로 고르는 선택창을 만듭니다.
    const popup=document.createElement('div');
    popup.className='mira-date-popup';
    popup.innerHTML=`
      <div class="mira-date-title">생년월일을 선택하세요</div>
      <div class="mira-date-selects">
        <select class="mira-year" aria-label="출생년도"></select>
        <select class="mira-month" aria-label="출생월"></select>
        <select class="mira-day" aria-label="출생일"></select>
      </div>
      <div class="mira-date-actions">
        <button type="button" class="mira-date-cancel">취소</button>
        <button type="button" class="mira-date-ok">선택</button>
      </div>`;
    document.body.appendChild(popup);

    const ys=popup.querySelector('.mira-year'),ms=popup.querySelector('.mira-month'),ds=popup.querySelector('.mira-day');
    const currentYear=new Date().getFullYear();
    for(let y=currentYear;y>=1900;y--){const o=document.createElement('option');o.value=y;o.textContent=y+'년';ys.appendChild(o);}
    for(let m=1;m<=12;m++){const o=document.createElement('option');o.value=m;o.textContent=m+'월';ms.appendChild(o);}

    function fillDays(){
      const y=Number(ys.value),m=Number(ms.value),max=new Date(y,m,0).getDate(),oldDay=Number(ds.value)||1;
      ds.innerHTML='';
      for(let d=1;d<=max;d++){const o=document.createElement('option');o.value=d;o.textContent=d+'일';ds.appendChild(o);}
      ds.value=String(Math.min(oldDay,max));
    }
    ms.addEventListener('change',fillDays);
    ys.addEventListener('change',fillDays);
    ys.value='';
    ms.value='1';
    fillDays();

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
      if(!value){
        r.textContent='생년월일을 선택해주세요.';
        r.classList.add('birth-warning');
        pending();
        return;
      }
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

    // 저장된 날짜는 입력창에만 표시하고 운세 결과는 자동으로 표시하지 않습니다.
    try{
      const saved=localStorage.getItem('mira_birth_date');
      if(saved&&/^\d{4}-\d{2}-\d{2}$/.test(saved)){
        const [y,m,d]=saved.split('-').map(Number);
        trigger.dataset.date=saved;
        trigger.textContent=`${y}년 ${String(m).padStart(2,'0')}월 ${String(d).padStart(2,'0')}일`;
        r.textContent=y+'년생 · '+animal(y);
      }
    }catch(x){}

    // 초기 화면에서는 점수와 결과를 항상 숨깁니다.
    pending();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();
