// 생년월일 운세 기능의 기존 로직을 불러온 뒤 최종 레이아웃을 적용합니다.
(function(){
  const legacy='https://raw.githubusercontent.com/kjh9410065-art/mira/700b090bcbba4da8200cfb8c9a9e038024d09e8b/assets/zodiac-links.js';
  const script=document.createElement('script');
  script.src=legacy;
  script.onload=()=>{
    const apply=()=>{
      const form=document.getElementById('birthForm');
      const result=document.getElementById('birthResult');
      const trigger=form&&form.querySelector('.birth-date-trigger');
      const reset=form&&form.querySelector('.birth-reset');
      if(!form||!result||!trigger||!reset){setTimeout(apply,100);return;}

      // 결과/경고 문구를 생년월일 입력창 바로 왼쪽으로 이동합니다.
      form.insertBefore(result,trigger);

      const style=document.createElement('style');
      style.textContent=`
        /* 입력창과 버튼을 하나의 고정 슬롯으로 만들어 경고문 때문에 밀리지 않게 합니다. */
        .birth-box{position:relative!important;overflow:visible!important;}
        .birth-form{position:absolute!important;left:10px!important;right:auto!important;top:50%!important;transform:translateY(-50%)!important;width:calc(100% - 20px)!important;min-width:0!important;height:48px!important;display:flex!important;align-items:center!important;flex-wrap:nowrap!important;gap:7px!important;margin:0!important;padding:0!important;box-sizing:border-box!important;}
        .birth-form .birth-result{order:1!important;position:static!important;display:block!important;flex:0 0 78px!important;width:78px!important;min-width:78px!important;max-width:78px!important;margin:0!important;padding:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important;font-size:11px!important;font-weight:800!important;color:#5c8d71!important;line-height:1.2!important;}
        .birth-form .birth-date-trigger{order:2!important;flex:1 1 auto!important;width:auto!important;min-width:0!important;max-width:none!important;height:46px!important;}
        .birth-form button[type="submit"]{order:3!important;flex:0 0 auto!important;white-space:nowrap!important;}
        .birth-form .birth-reset{order:4!important;flex:0 0 auto!important;width:64px!important;min-width:64px!important;height:38px!important;white-space:nowrap!important;}
        .birth-form .birth-result.birth-warning{position:static!important;display:block!important;flex:0 0 78px!important;width:78px!important;min-width:78px!important;max-width:78px!important;margin:0!important;color:#a15b4c!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;text-align:left!important;pointer-events:none!important;}
        @media(max-width:760px) and (hover:none) and (pointer:coarse){
          .birth-box{min-height:76px!important;padding:14px!important;}
          .birth-copy{display:none!important;}
          .birth-form{left:10px!important;right:auto!important;width:calc(100% - 20px)!important;min-width:0!important;max-width:none!important;}
        }
      `;
      document.head.appendChild(style);

      // 기존 경고 함수가 결과 요소를 body로 옮겨도 다시 입력 폼의 왼쪽 슬롯으로 되돌립니다.
      const observer=new MutationObserver(()=>{
        const f=document.getElementById('birthForm');
        const r=document.getElementById('birthResult');
        const t=f&&f.querySelector('.birth-date-trigger');
        if(!f||!r||!t)return;
        if(r.classList.contains('birth-warning')){
          f.insertBefore(r,t);
          r.removeAttribute('style');
        }
      });
      observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
    };
    apply();
  };
  script.onerror=()=>console.error('Mira birth fortune script failed to load.');
  document.head.appendChild(script);
})();
\n\n// MIRA_BIRTH_FORM_FIXED_LAYOUT\n(function(){\n  // 생년월일 입력창과 버튼을 고정 슬롯으로 배치해 경고문이 레이아웃을 밀지 못하게 합니다.\n  const s=document.createElement('style');\n  s.textContent=`\n  .birth-box{position:relative!important;}\n  .birth-form{position:absolute!important;right:17px!important;top:50%!important;transform:translateY(-50%)!important;width:335px!important;min-width:335px!important;max-width:335px!important;display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:7px!important;margin:0!important;}\n  .birth-form .birth-date-trigger{flex:0 0 230px!important;width:230px!important;min-width:230px!important;}\n  .birth-form button{flex:0 0 auto!important;}\n  .birth-result{position:fixed!important;}\n  @media(max-width:760px) and (hover:none) and (pointer:coarse){\n    .birth-box{min-height:76px!important;padding:14px!important;overflow:visible!important;}\n    .birth-copy{display:none!important;}\n    .birth-form{left:14px!important;right:auto!important;top:50%!important;width:335px!important;min-width:335px!important;max-width:335px!important;transform:translateY(-50%)!important;}\n  }`;\n  document.head.appendChild(s);\n})();\n