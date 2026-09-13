// MIRA 홈 운세 UI 최종 고정
(function(){
  const animals=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
  const home=()=>location.pathname.replace(/\/+$/,'')==='';
  const animal=y=>animals[((y-2020)%12+12)%12];

  function hideTests(){
    if(home())document.querySelectorAll('.tests,[href="#tests"],[href="/test/"],[href="/test"]').forEach(e=>e.remove());
  }

  // 출생일을 선택하기 전에는 운세 내용만 숨기고 카드 틀은 그대로 유지합니다.
  function pending(){
    const o=document.querySelector('.overview');
    if(!o)return;
    o.classList.remove('mira-ready');
    o.classList.add('mira-pending');
    o.querySelectorAll('.score b').forEach(e=>{e.textContent='';});
    o.querySelectorAll('.four .fortune strong,.four .fortune small').forEach(e=>{e.textContent='';});
  }

  // 선택한 생년월일을 기준으로 오늘의 운세를 표시합니다.
  function show(dateValue){
    const o=document.querySelector('.overview');
    if(!o)return;

    const parts=dateValue.split('-').map(Number);
    const year=parts[0],month=parts[1],day=parts[2];
    if(!year||!month||!day)return;

    o.classList.remove('mira-pending');
    o.classList.add('mira-ready');

    const now=new Date();
    const seed=year*31+month*17+day*13+now.getDate()*7+now.getMonth()*11;
    const i=(year+month+day)%4;
    const score=76+(seed%20);
    const main=o.querySelector('.main');

    if(main){
      const b=main.querySelector('.badge'),h=main.querySelector('h3'),p=main.querySelector('p'),s=main.querySelector('.score b');
      if(b)b.textContent=['좋은 흐름','안정적인 흐름','기회가 오는 흐름','차분한 흐름'][i];
      if(h)h.textContent=['작은 변화가 좋은 흐름을 만들어요.','천천히 움직일수록 결과가 좋아요.','새로운 기회를 놓치지 마세요.','정리와 집중이 행운을 불러요.'][i];
      if(p)p.textContent=['눈앞의 일을 하나씩 정리하면 생각보다 수월하게 풀리는 날이에요.','서두르기보다 순서를 정하면 오늘의 운이 안정적으로 이어져요.','평소와 다른 선택 하나가 오늘의 분위기를 바꿔줄 수 있어요.','해야 할 일을 가볍게 정리하면 마음도 한결 편안해져요.'][i];
      if(s)s.textContent=score;
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
      /* 클릭하면 브라우저의 달력에서 연도 → 월 → 일을 선택할 수 있는 생년월일 입력입니다. */
      .birth-form{display:grid!important;grid-template-columns:125px minmax(190px,1fr) auto 64px!important;gap:7px!important;align-items:center!important;width:min(500px,100%)!important;min-width:0!important}
      .birth-form .birth-result{grid-column:1!important;grid-row:1!important;position:static!important;width:125px!important;min-width:125px!important;max-width:125px!important;margin:0!important;white-space:nowrap!important;overflow:visible!important;text-align:left!important;transform:translateX(-20px)!important;font-size:11px!important;font-weight:900!important;color:#5c8d71!important}
      .birth-form .birth-result.birth-warning{color:#a15b4c!important}
      .birth-form .mira-home-date,.birth-form input{grid-column:2!important;grid-row:1!important;width:100%!important;min-width:0!important;height:38px!important;box-sizing:border-box!important;cursor:pointer!important}
      .birth-form button[type="submit"]{grid-column:3!important;grid-row:1!important;height:38px!important;white-space:nowrap!important}
      .birth-form .birth-reset{grid-column:4!important;grid-row:1!important;width:64px!important;min-width:64px!important;height:38px!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#587062!important;font-size:12px!important;font-weight:900!important;cursor:pointer!important}

      /* 초기 상태에서는 점수와 운세 내용을 완전히 비우고 카드 틀만 유지합니다. */
      .overview.mira-pending .card>*{visibility:hidden!important;opacity:0!important}
      .overview.mira-pending .card{visibility:visible!important}
      .overview.mira-ready .card>*{visibility:visible!important;opacity:1!important}

      @media(max-width:760px) and (hover:none) and (pointer:coarse){
        .tests{display:none!important}
        .birth-form{grid-template-columns:115px minmax(0,1fr) auto 60px!important;width:100%!important;gap:5px!important}
        .birth-form .birth-result{width:115px!important;min-width:115px!important;max-width:115px!important;font-size:10px!important;transform:translateX(-12px)!important}
        .birth-form .mira-home-date,.birth-form input{grid-column:2!important}
        .birth-form button[type="submit"]{grid-column:3!important;padding:0 10px!important}
        .birth-form .birth-reset{grid-column:4!important;width:60px!important;min-width:60px!important;font-size:11px!important}
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

    // 기존 출생년도 이벤트를 제거한 새 폼으로 교체합니다.
    const form=old.cloneNode(true);
    old.replaceWith(form);

    const input=form.querySelector('#birthYear')||form.querySelector('input');
    if(!input)return;

    let r=document.getElementById('birthResult');
    if(!r){
      r=document.createElement('span');
      r.id='birthResult';
      r.className='birth-result';
    }

    let reset=form.querySelector('.birth-reset');
    if(!reset){
      reset=document.createElement('button');
      reset.type='button';
      reset.className='birth-reset';
      reset.textContent='초기화';
      form.appendChild(reset);
    }

    // 클릭 시 브라우저 달력이 열리고 연도, 월, 일을 직접 선택할 수 있도록 date 입력으로 사용합니다.
    input.type='date';
    input.min='1900-01-01';
    input.max=new Date().toISOString().slice(0,10);
    input.placeholder='생년월일';
    input.setAttribute('aria-label','생년월일');
    input.classList.add('mira-home-date');

    if(r.parentElement!==form||r.nextElementSibling!==input)form.insertBefore(r,input);

    const head=form.closest('.section')?.querySelector('.head h2');
    if(head)head.textContent='오늘의 운세';

    input.addEventListener('change',()=>{
      r.textContent='';
      r.classList.remove('birth-warning');
    });

    // 생년월일을 선택하고 운세 확인을 눌렀을 때만 결과를 표시합니다.
    form.addEventListener('submit',e=>{
      e.preventDefault();
      e.stopImmediatePropagation();

      const value=input.value;
      if(!value){
        r.textContent='생년월일을 선택해주세요.';
        r.classList.add('birth-warning');
        pending();
        return;
      }

      const [year,month,day]=value.split('-').map(Number);
      if(!year||!month||!day){
        r.textContent='생년월일을 선택해주세요.';
        r.classList.add('birth-warning');
        pending();
        return;
      }

      r.classList.remove('birth-warning');
      r.textContent=`${year}년 ${month}월 ${day}일 · ${animal(year)}`;
      try{
        localStorage.setItem('mira_birth_date',value);
        localStorage.removeItem('mira_birth_year');
      }catch(x){}
      show(value);
    },true);

    // 초기화하면 입력값, 선택 결과, 점수까지 모두 초기 상태로 되돌립니다.
    reset.addEventListener('click',e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      input.value='';
      r.textContent='';
      r.classList.remove('birth-warning');
      try{
        localStorage.removeItem('mira_birth_date');
        localStorage.removeItem('mira_birth_year');
      }catch(x){}
      pending();
    },true);

    // 저장된 생년월일은 입력칸에만 복원하고 운세 결과는 자동으로 표시하지 않습니다.
    try{
      const saved=localStorage.getItem('mira_birth_date');
      if(saved&&/^\d{4}-\d{2}-\d{2}$/.test(saved)){
        input.value=saved;
        const [year,month,day]=saved.split('-').map(Number);
        r.textContent=`${year}년 ${month}월 ${day}일 · ${animal(year)}`;
      }
    }catch(x){}

    // 페이지 최초 진입은 반드시 빈 운세 상태로 시작합니다.
    pending();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();
