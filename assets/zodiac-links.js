// MIRA 생년월일 운세 UI
// 기존 페이지의 운세 영역을 PC/모바일 모두 같은 구조로 정리합니다.
(function(){
  const animals=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
  const chars=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const today=new Date();

  function waitForForm(){
    const form=document.getElementById('birthForm');
    if(!form){setTimeout(waitForForm,100);return;}
    setup(form);
  }

  function setup(form){
    if(form.dataset.miraFixed==='1') return;
    form.dataset.miraFixed='1';
    let input=form.querySelector('input');
    const submit=form.querySelector('button[type="submit"]') || form.querySelector('button');
    let result=document.getElementById('birthResult');
    let reset=form.querySelector('.birth-reset');
    if(input){
      input.type='date';
      input.removeAttribute('min');
      input.max=today.toISOString().slice(0,10);
      input.classList.add('mira-birth-date');
      input.setAttribute('aria-label','생년월일');
      input.setAttribute('title','생년월일을 선택하세요');
    }
    if(!result){result=document.createElement('span');result.id='birthResult';result.className='birth-result';}
    if(!reset){reset=document.createElement('button');reset.type='button';reset.className='birth-reset';reset.textContent='초기화';}
    form.insertBefore(result,input || submit || null);
    if(submit && !reset.parentElement) form.appendChild(reset);
    if(reset.parentElement!==form) form.appendChild(reset);

    const style=document.createElement('style');
    style.textContent=`
      .birth-box{position:relative!important;display:flex!important;align-items:center!important;min-height:72px!important;overflow:visible!important;}
      .birth-copy{flex:1 1 auto!important;min-width:0!important;}
      .birth-form{display:flex!important;align-items:center!important;flex-wrap:nowrap!important;gap:7px!important;flex:0 0 auto!important;width:auto!important;margin:0!important;padding:0!important;position:static!important;transform:none!important;}
      .birth-form .birth-result{display:block!important;order:1!important;position:static!important;width:82px!important;min-width:82px!important;max-width:82px!important;margin:0!important;padding:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important;font-size:11px!important;font-weight:900!important;line-height:1.25!important;color:#5c8d71!important;}
      .birth-form .birth-date-trigger,.birth-form .mira-birth-date,.birth-form input{order:2!important;flex:0 0 190px!important;width:190px!important;min-width:190px!important;height:46px!important;box-sizing:border-box!important;border:1px solid #d3cdbf!important;border-radius:10px!important;background:#fffdf8!important;padding:0 11px!important;color:#244638!important;font-size:13px!important;outline:none!important;}
      .birth-form button[type="submit"]{order:3!important;flex:0 0 auto!important;height:38px!important;white-space:nowrap!important;}
      .birth-form .birth-reset{order:4!important;flex:0 0 64px!important;width:64px!important;min-width:64px!important;height:38px!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#587062!important;padding:0 10px!important;font-size:12px!important;font-weight:900!important;cursor:pointer!important;white-space:nowrap!important;}
      .birth-form .birth-result.birth-warning{position:static!important;display:block!important;flex:0 0 82px!important;width:82px!important;min-width:82px!important;color:#a15b4c!important;overflow:visible!important;}
      .birth-form .mira-birth-date:focus{border-color:#5c8d71!important;box-shadow:0 0 0 3px rgba(92,141,113,.12)!important;}
      .mira-pending .overview .card{visibility:hidden!important;}
      .mira-pending .overview{min-height:208px!important;}
      @media(max-width:760px) and (hover:none) and (pointer:coarse){
        body{min-width:0!important;overflow-x:hidden!important;}
        .wrap{width:calc(100% - 24px)!important;max-width:none!important;}
        .page{margin-left:0!important;}
        .header-in{padding:0!important;}
        .hero-in{padding:18px 0!important;}
        .hero h1{font-size:31px!important;letter-spacing:-2.4px!important;}
        .hero-art{height:150px!important;margin-top:12px!important;}
        .birth-box{display:block!important;padding:14px!important;min-height:76px!important;}
        .birth-copy{display:none!important;}
        .birth-form{width:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:46px 38px!important;gap:7px!important;position:static!important;}
        .birth-form .birth-result{grid-column:1 / -1!important;grid-row:1!important;display:block!important;width:auto!important;min-width:0!important;max-width:none!important;height:46px!important;line-height:46px!important;font-size:11px!important;}
        .birth-form .birth-date-trigger,.birth-form .mira-birth-date,.birth-form input{grid-column:1!important;grid-row:2!important;width:100%!important;min-width:0!important;max-width:none!important;height:38px!important;}
        .birth-form button[type="submit"]{grid-column:2!important;grid-row:2!important;height:38px!important;padding:0 13px!important;}
        .birth-form .birth-reset{grid-column:2!important;grid-row:3!important;height:32px!important;min-height:32px!important;}
        .birth-form:has(.birth-reset){grid-template-rows:46px 38px 32px!important;}
        .overview{grid-template-columns:1fr!important;gap:8px!important;}
        .overview .main{min-height:190px!important;}
        .four{grid-template-columns:repeat(2,1fr)!important;gap:8px!important;}
        .zodiac{grid-template-columns:repeat(2,1fr)!important;}
        .test-grid{grid-template-columns:repeat(2,1fr)!important;}
        .head h2{font-size:20px!important;}
      }
    `;
    document.head.appendChild(style);

    if(window.matchMedia('(max-width:760px)').matches) reset.style.display='block';
    const section=form.closest('.section') || form.parentElement;
    const head=section && section.querySelector('.head h2');
    if(head && head.textContent.includes('종합운')) head.textContent='오늘의 운세';
    const overview=document.querySelector('.overview');
    if(overview){overview.classList.add('mira-pending');const sectionWrap=overview.closest('.section');if(sectionWrap)sectionWrap.classList.add('mira-pending');}

    function showResult(){
      if(!input || !input.value){result.textContent='생년월일을 먼저 입력해주세요.';result.classList.add('birth-warning');input&&input.focus();return false;}
      const parts=input.value.split('-').map(Number),year=parts[0],month=parts[1],day=parts[2];
      if(!year||!month||!day)return false;
      const animalIndex=((year-2020)%12+12)%12;
      result.classList.remove('birth-warning');
      result.textContent=year+'년생 · '+animals[animalIndex];
      result.title=year+'년생 · '+animals[animalIndex];
      if(overview){overview.classList.remove('mira-pending');const sectionWrap=overview.closest('.section');if(sectionWrap)sectionWrap.classList.remove('mira-pending');personalizeOverview(year,month,day,animalIndex);}
      try{localStorage.setItem('mira_birth_date',input.value);}catch(e){}
      return true;
    }
    input&&input.addEventListener('change',function(){if(!input.value){result.textContent='';return;}const y=Number(input.value.slice(0,4)),idx=((y-2020)%12+12)%12;result.classList.remove('birth-warning');result.textContent=y+'년생 · '+animals[idx];});
    form.addEventListener('submit',function(e){e.preventDefault();showResult();},true);
    reset.addEventListener('click',function(){input.value='';result.textContent='';result.classList.remove('birth-warning');if(overview){overview.classList.add('mira-pending');const sectionWrap=overview.closest('.section');if(sectionWrap)sectionWrap.classList.add('mira-pending');}try{localStorage.removeItem('mira_birth_date');}catch(e){}});
    try{const saved=localStorage.getItem('mira_birth_date');if(saved&&input){input.value=saved;const y=Number(saved.slice(0,4)),idx=((y-2020)%12+12)%12;result.textContent=y+'년생 · '+animals[idx];}}catch(e){}
  }

  function personalizeOverview(year,month,day,index){
    const seed=year*31+month*17+day*13+today.getDate()*7+today.getMonth()*11,score=76+(seed%20),grades=['좋은 흐름','안정적인 흐름','기회가 오는 흐름','차분한 흐름'],messages=[['작은 변화가 좋은 흐름을 만들어요.','눈앞의 일을 하나씩 정리하면 생각보다 수월하게 풀리는 날이에요.'],['천천히 움직일수록 결과가 좋아요.','서두르기보다 순서를 정하면 오늘의 운이 안정적으로 이어져요.'],['새로운 기회를 놓치지 마세요.','평소와 다른 선택 하나가 오늘의 분위기를 바꿔줄 수 있어요.'],['정리와 집중이 행운을 불러요.','해야 할 일을 가볍게 정리하면 마음도 한결 편안해져요.']],type=index%4,main=document.querySelector('.overview .main');
    if(main){const badge=main.querySelector('.badge');if(badge)badge.textContent=grades[type];const h=main.querySelector('h3');if(h)h.textContent=messages[type][0];const p=main.querySelector('p');if(p)p.textContent=messages[type][1];const sc=main.querySelector('.score b');if(sc)sc.textContent=score;}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',waitForForm);else waitForForm();
})();

// 기존 보정 스타일은 모바일에서 새 레이아웃을 덮어쓰므로 유지하되, 홈 심리테스트 제거가 우선 적용됩니다.
(function(){
  const s=document.createElement('style');
  s.textContent=`
    .birth-box{position:relative!important;}
    @media(max-width:760px) and (hover:none) and (pointer:coarse){
      .birth-box{min-height:76px!important;padding:14px!important;overflow:visible!important;}
      .birth-copy{display:none!important;}
    }
    /* 홈 화면에서는 심리테스트 섹션을 완전히 숨깁니다. 별도 테스트 페이지에는 영향을 주지 않습니다. */
    body.home-page .tests{display:none!important;}
  `;
  document.head.appendChild(s);

  function hideHomeTests(){
    // 현재 페이지가 Mira 메인 홈일 때만 심리테스트 본문을 제거합니다.
    const path=window.location.pathname.replace(/\/+$/,'') || '/';
    if(path!=='/') return;
    document.body.classList.add('home-page');
    const tests=document.querySelector('.tests');
    if(tests) tests.remove();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hideHomeTests,{once:true});
  else hideHomeTests();
  // 기존 코드가 늦게 테스트 영역을 만들더라도 홈에서는 바로 제거합니다.
  new MutationObserver(hideHomeTests).observe(document.body,{childList:true,subtree:true});
})();
