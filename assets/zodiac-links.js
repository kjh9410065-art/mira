// 생년월일 운세 기능을 기존 로직과 최종 레이아웃 패치로 연결합니다.
(function(){
  const legacy='https://raw.githubusercontent.com/kjh9410065-art/mira/700b090bcbba4da8200cfb8c9a9e038024d09e8b/assets/zodiac-links.js';
  const script=document.createElement('script');
  script.src=legacy;
  script.onload=()=>{
    // 기존 스크립트가 폼을 생성한 뒤 최종 배치를 적용합니다.
    const apply=()=>{
      const form=document.getElementById('birthForm');
      const result=document.getElementById('birthResult');
      const trigger=form&&form.querySelector('.birth-date-trigger');
      const reset=form&&form.querySelector('.birth-reset');
      if(!form||!result||!trigger||!reset){setTimeout(apply,100);return;}

      // 결과/경고 문구를 생년월일 입력창 왼쪽으로 실제 DOM 이동합니다.
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
          .birth-form .birth-result{flex-basis:78px!important;width:78px!important;min-width:78px!important;}
          .birth-form .birth-date-trigger{flex:1 1 auto!important;min-width:0!important;}
        }
      `;
      document.head.appendChild(style);
    };
    apply();
  };
  script.onerror=()=>console.error('Mira birth fortune script failed to load.');
  document.head.appendChild(script);
})();
