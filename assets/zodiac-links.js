// MIRA 홈 최종 고정 패치
// 기존 운세 기능은 그대로 사용하되, 홈 화면의 오래된 스크립트가 출생일 UI를 덮어쓰거나 심리테스트를 다시 만들지 못하게 합니다.
(function(){
  const legacy='https://raw.githubusercontent.com/kjh9410065-art/mira/a0f5cdf118947a3cfcb07d049784891f472773a0/assets/zodiac-links.js';
  const s=document.createElement('script');
  s.src=legacy;
  s.onload=()=>{setTimeout(lockHome,100);setTimeout(lockHome,500);setTimeout(lockHome,1200);};
  s.onerror=()=>console.error('Mira fortune script failed to load.');
  document.head.appendChild(s);

  let locked=false;
  function lockHome(){
    // 메인 홈에서만 실행합니다. 별도 심리테스트 페이지에는 영향을 주지 않습니다.
    if((location.pathname.replace(/\/+$/,'')||'/')!=='/')return;
    document.querySelectorAll('.tests,[href="#tests"]').forEach(el=>el.remove());

    const form=document.getElementById('birthForm');
    if(!form)return;

    // 기존 폼에 붙어 있던 이벤트를 모두 끊기 위해 최초 1회 복제합니다.
    if(!locked){
      const fresh=form.cloneNode(true);
      form.replaceWith(fresh);
      locked=true;
    }

    const f=document.getElementById('birthForm');
    const input=f.querySelector('#birthYear') || f.querySelector('input');
    const result=document.getElementById('birthResult');
    if(!input||!result)return;

    // 출생년도 입력은 생년월일 입력으로 고정합니다.
    input.type='date';
    input.min='1900-01-01';
    input.max=new Date().toISOString().slice(0,10);
    input.removeAttribute('name');
    input.classList.add('mira-home-date');
    f.insertBefore(result,input);

    let reset=f.querySelector('.birth-reset');
    if(!reset){
      reset=document.createElement('button');
      reset.type='button';
      reset.className='birth-reset';
      reset.textContent='초기화';
      f.appendChild(reset);
      reset.addEventListener('click',()=>{
        input.value='';
        result.textContent='';
        result.classList.remove('birth-warning');
        const fortune=document.getElementById('fortune');
        if(fortune)fortune.classList.add('mira-pending');
        try{localStorage.removeItem('mira_birth_date')}catch(e){}
      });
    }

    // 날짜 변경 시 결과는 입력창 왼쪽에만 표시합니다.
    if(!input.dataset.miraBound){
      input.dataset.miraBound='1';
      input.addEventListener('change',()=>{
        if(!input.value){result.textContent='';return;}
        const y=Number(input.value.slice(0,4));
        result.classList.remove('birth-warning');
        result.textContent=`${y}년생 · ${animal(y)}`;
      });
      f.addEventListener('submit',e=>{
        e.preventDefault();
        if(!input.value){
          result.textContent='생년월일을 입력해주세요.';
          result.classList.add('birth-warning');
          return;
        }
        // 기존 상세 운세 로직의 submit을 직접 다시 호출할 수 없으므로
        // 날짜 입력 후 표시된 개인 운세 영역은 기존 로직에 맡기고 저장값만 유지합니다.
        const y=Number(input.value.slice(0,4));
        result.classList.remove('birth-warning');
        result.textContent=`${y}년생 · ${animal(y)}`;
        try{localStorage.setItem('mira_birth_date',input.value)}catch(e){}
      },true);
    }

    const css=document.createElement('style');
    css.textContent=`
      /* 결과 문구가 경고문으로 바뀌어도 입력창을 밀지 않습니다. */
      .birth-form{display:flex!important;align-items:center!important;flex-wrap:nowrap!important;gap:7px!important;position:relative!important;width:auto!important;min-width:0!important;}
      .birth-form .birth-result{order:1!important;position:static!important;display:block!important;flex:0 0 82px!important;width:82px!important;min-width:82px!important;max-width:82px!important;margin:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important;font-size:11px!important;font-weight:900!important;color:#5c8d71!important;}
      .birth-form .birth-result.birth-warning{color:#a15b4c!important;overflow:visible!important;}
      .birth-form .mira-home-date{order:2!important;flex:0 1 190px!important;width:190px!important;min-width:140px!important;height:38px!important;box-sizing:border-box!important;}
      .birth-form button[type="submit"]{order:3!important;flex:0 0 auto!important;}
      .birth-form .birth-reset{order:4!important;flex:0 0 64px!important;width:64px!important;min-width:64px!important;height:38px!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#587062!important;font-size:12px!important;font-weight:900!important;cursor:pointer!important;}
      .mira-pending .overview .card>*{visibility:hidden!important;}
      .mira-pending .overview .card,.mira-pending .four .card{visibility:visible!important;}
      @media(max-width:760px) and (hover:none) and (pointer:coarse){
        .birth-box{display:block!important;padding:14px!important;min-height:76px!important;overflow:visible!important;}
        .birth-copy{display:none!important;}
        .birth-form{display:grid!important;grid-template-columns:72px minmax(0,1fr) auto 60px!important;width:100%!important;gap:5px!important;}
        .birth-form .birth-result{grid-column:1!important;width:72px!important;min-width:72px!important;max-width:72px!important;font-size:10px!important;}
        .birth-form .mira-home-date{grid-column:2!important;width:100%!important;min-width:0!important;height:38px!important;}
        .birth-form button[type="submit"]{grid-column:3!important;height:38px!important;padding:0 10px!important;}
        .birth-form .birth-reset{grid-column:4!important;width:60px!important;min-width:60px!important;height:38px!important;font-size:11px!important;}
      }
    `;
    document.head.appendChild(css);
  }

  function animal(y){
    const a=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
    return a[((y-2020)%12+12)%12];
  }

  // 다른 스크립트가 다시 심리테스트나 출생일 UI를 만들 경우 즉시 원래 상태로 되돌립니다.
  new MutationObserver(()=>{
    if((location.pathname.replace(/\/+$/,'')||'/')!=='/')return;
    document.querySelectorAll('.tests,[href="#tests"]').forEach(el=>el.remove());
    if(locked)lockHome();
  }).observe(document.body,{childList:true,subtree:true});
})();
