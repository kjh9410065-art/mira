// MIRA 홈 운세 UI 최종 고정
(function(){
  const animals=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
  const home=()=>location.pathname.replace(/\/+$/,'')==='';
  const animal=y=>animals[((y-2020)%12+12)%12];

  function hideTests(){if(home())document.querySelectorAll('.tests,[href="#tests"],[href="/test/"],[href="/test"]').forEach(e=>e.remove());}

  // 출생년도를 선택하기 전에는 결과 숫자와 문구를 모두 비웁니다.
  function pending(){
    const o=document.querySelector('.overview'); if(!o)return;
    o.classList.remove('mira-ready');
    o.classList.add('mira-pending');
    const main=o.querySelector('.main');
    if(main){
      const b=main.querySelector('.badge'),h=main.querySelector('h3'),p=main.querySelector('p'),s=main.querySelector('.score b');
      if(b)b.textContent=''; if(h)h.textContent=''; if(p)p.textContent=''; if(s)s.textContent='';
    }
    o.querySelectorAll('.four .fortune').forEach(c=>{
      const s=c.querySelector('strong'),p=c.querySelector('small');
      if(s)s.textContent=''; if(p)p.textContent='';
    });
    o.querySelectorAll('.lucky .luckrow b').forEach(e=>e.textContent='');
  }

  function show(year){
    const o=document.querySelector('.overview'); if(!o)return;
    o.classList.remove('mira-pending');
    o.classList.add('mira-ready');
    const now=new Date(),seed=year*31+now.getDate()*7+now.getMonth()*11,i=year%4,score=76+(seed%20);
    const main=o.querySelector('.main');
    if(main){
      const b=main.querySelector('.badge'),h=main.querySelector('h3'),p=main.querySelector('p'),s=main.querySelector('.score b');
      if(b)b.textContent=['좋은 흐름','안정적인 흐름','기회가 오는 흐름','차분한 흐름'][i];
      if(h)h.textContent=['작은 변화가 좋은 흐름을 만들어요.','천천히 움직일수록 결과가 좋아요.','새로운 기회를 놓치지 마세요.','정리와 집중이 행운을 불러요.'][i];
      if(p)p.textContent=['눈앞의 일을 하나씩 정리하면 생각보다 수월하게 풀리는 날이에요.','서두르기보다 순서를 정하면 오늘의 운이 안정적으로 이어져요.','평소와 다른 선택 하나가 오늘의 분위기를 바꿔줄 수 있어요.','해야 할 일을 가볍게 정리하면 마음도 한결 편안해져요.'][i];
      if(s)s.textContent=score;
    }
    o.querySelectorAll('.four .fortune').forEach((c,n)=>{const s=c.querySelector('strong'),p=c.querySelector('small');if(s)s.textContent=['상승','좋음','활기','안정'][n];if(p)p.textContent=['계획적인 소비에 집중하세요.','솔직한 대화가 좋은 분위기를 만들어요.','미뤄둔 일을 하나씩 정리해보세요.','무리하지 말고 충분히 쉬어주세요.'][n];});
  }

  function style(){
    if(document.getElementById('mira-final-style'))return;
    const s=document.createElement('style');s.id='mira-final-style';s.textContent=`
      .birth-form{display:grid!important;grid-template-columns:125px minmax(190px,1fr) auto 64px!important;gap:7px!important;align-items:center!important;width:min(500px,100%)!important;min-width:0!important;position:relative!important}
      .birth-form .birth-result{grid-column:1!important;grid-row:1!important;position:static!important;width:125px!important;min-width:125px!important;max-width:125px!important;margin:0!important;white-space:nowrap!important;overflow:visible!important;text-align:left!important;transform:translateX(-20px)!important;font-size:11px!important;font-weight:900!important;color:#5c8d71!important}
      .birth-form .birth-result.birth-warning{color:#a15b4c!important}
      .birth-form .mira-year-picker{grid-column:2!important;grid-row:1!important;width:100%!important;height:38px!important;box-sizing:border-box!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#53675b!important;font-size:13px!important;text-align:left!important;padding:0 11px!important;cursor:pointer!important}
      .mira-year-picker:after{content:'⌄';float:right;color:#718177}
      .mira-year-menu{position:absolute!important;z-index:1000!important;left:132px!important;top:45px!important;width:220px!important;max-height:270px!important;overflow:auto!important;background:#fffdf8!important;border:1px solid #d3cdbf!important;border-radius:10px!important;box-shadow:0 12px 30px rgba(42,60,47,.16)!important;padding:8px!important;display:none!important}
      .mira-year-menu.open{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:4px!important}
      .mira-year-option{height:32px!important;border:0!important;border-radius:7px!important;background:#f7f3e9!important;color:#53675b!important;cursor:pointer!important;font-size:12px!important}
      .mira-year-option:hover,.mira-year-option.selected{background:#5c8d71!important;color:#fff!important}
      .birth-form button[type="submit"]{grid-column:3!important;grid-row:1!important;height:38px!important;white-space:nowrap!important}
      .birth-form .birth-reset{grid-column:4!important;grid-row:1!important;width:64px!important;min-width:64px!important;height:38px!important;border:1px solid #d3cdbf!important;border-radius:9px!important;background:#fffdf8!important;color:#587062!important;font-size:12px!important;font-weight:900!important;cursor:pointer!important}
      .overview.mira-pending .card{visibility:visible!important}.overview.mira-pending .card>*{visibility:hidden!important;opacity:0!important}.overview.mira-ready .card>*{visibility:visible!important;opacity:1!important}
      @media(max-width:760px) and (hover:none) and (pointer:coarse){.tests{display:none!important}.birth-form{grid-template-columns:115px minmax(0,1fr) auto 60px!important;width:100%!important;gap:5px!important}.birth-form .birth-result{width:115px!important;min-width:115px!important;max-width:115px!important;font-size:10px!important;transform:translateX(-12px)!important}.birth-form .mira-year-picker{grid-column:2!important}.birth-form button[type="submit"]{grid-column:3!important;padding:0 10px!important}.birth-form .birth-reset{grid-column:4!important;width:60px!important;min-width:60px!important;font-size:11px!important}.mira-year-menu{left:120px!important;width:200px!important}}
    `;document.head.appendChild(s);
  }

  function setup(){
    if(!home())return; hideTests(); style();
    const old=document.getElementById('birthForm'); if(!old)return;
    const form=old.cloneNode(true); old.replaceWith(form);
    const input=form.querySelector('#birthYear')||form.querySelector('input'); if(!input)return;
    let r=document.getElementById('birthResult'); if(!r){r=document.createElement('span');r.id='birthResult';r.className='birth-result';}
    form.querySelectorAll('.birth-reset').forEach(e=>e.remove());
    const reset=document.createElement('button');reset.type='button';reset.className='birth-reset';reset.textContent='초기화';form.appendChild(reset);

    // 실제 입력창 대신 클릭해서 연도를 고르는 선택 버튼을 사용합니다.
    const picker=document.createElement('button');picker.type='button';picker.className='mira-year-picker';picker.textContent='출생년도';picker.setAttribute('aria-label','출생년도 선택');
    const menu=document.createElement('div');menu.className='mira-year-menu';menu.setAttribute('role','listbox');
    const current=new Date().getFullYear();
    for(let y=current;y>=1900;y--){const b=document.createElement('button');b.type='button';b.className='mira-year-option';b.textContent=y+'년';b.dataset.year=y;menu.appendChild(b);}
    input.type='hidden';input.value='';input.name=input.name||'birthYear';input.setAttribute('aria-hidden','true');input.tabIndex=-1;
    form.insertBefore(picker,input);form.appendChild(menu);
    if(r.parentElement!==form||r.nextElementSibling!==picker)form.insertBefore(r,picker);
    const head=form.closest('.section')?.querySelector('.head h2');if(head)head.textContent='오늘의 운세';

    const closeMenu=()=>menu.classList.remove('open');
    picker.addEventListener('click',e=>{e.preventDefault();menu.classList.toggle('open');});
    menu.addEventListener('click',e=>{const b=e.target.closest('.mira-year-option');if(!b)return;const year=Number(b.dataset.year);input.value=year;picker.textContent=year+'년';r.classList.remove('birth-warning');r.textContent=year+'년생 · '+animal(year);menu.querySelectorAll('.mira-year-option').forEach(x=>x.classList.toggle('selected',x===b));closeMenu();});
    document.addEventListener('click',e=>{if(!form.contains(e.target))closeMenu();},{once:false});

    form.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();const year=Number(input.value);if(!year||year<1900||year>current){r.textContent='출생년도를 선택해주세요.';r.classList.add('birth-warning');pending();return;}r.classList.remove('birth-warning');r.textContent=year+'년생 · '+animal(year);try{localStorage.setItem('mira_birth_year',String(year));localStorage.removeItem('mira_birth_date');}catch(x){}show(year);},true);
    reset.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();input.value='';picker.textContent='출생년도';r.textContent='';r.classList.remove('birth-warning');try{localStorage.removeItem('mira_birth_year');localStorage.removeItem('mira_birth_date');}catch(x){}pending();},true);
    try{const saved=localStorage.getItem('mira_birth_year');if(saved&&/^\d{4}$/.test(saved)){input.value=saved;picker.textContent=saved+'년';r.textContent=Number(saved)+'년생 · '+animal(Number(saved));}}catch(x){}
    pending();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();