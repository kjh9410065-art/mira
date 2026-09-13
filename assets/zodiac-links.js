// MIRA 최종 운세 UI 패치
// 기존 운세 로직을 먼저 불러온 뒤, 빈 카드와 띠/별자리 상세 결과를 최종 적용합니다.
(function(){
  const legacy='https://raw.githubusercontent.com/kjh9410065-art/mira/a0f5cdf118947a3cfcb07d049784891f472773a0/assets/zodiac-links.js';
  const script=document.createElement('script');
  script.src=legacy;
  script.onload=()=>{
    const apply=()=>{
      const form=document.getElementById('birthForm');
      const result=document.getElementById('birthResult');
      const trigger=form&&form.querySelector('.birth-date-trigger');
      const reset=form&&form.querySelector('.birth-reset');
      const list=document.getElementById('zodiacList');
      if(!form||!result||!trigger||!reset){setTimeout(apply,100);return;}

      // 결과 문구를 생년월일 입력창 왼쪽에 고정합니다.
      form.insertBefore(result,trigger);

      const style=document.createElement('style');
      style.textContent=`
        .birth-box{position:relative!important;overflow:visible!important;}
        .birth-form{position:absolute!important;left:10px!important;right:auto!important;top:50%!important;transform:translateY(-50%)!important;width:calc(100% - 20px)!important;min-width:0!important;height:48px!important;display:flex!important;align-items:center!important;flex-wrap:nowrap!important;gap:7px!important;margin:0!important;padding:0!important;box-sizing:border-box!important;}
        .birth-form .birth-result{order:1!important;position:static!important;display:block!important;flex:0 0 78px!important;width:78px!important;min-width:78px!important;max-width:78px!important;margin:0!important;padding:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important;font-size:11px!important;font-weight:800!important;color:#5c8d71!important;line-height:1.2!important;}
        .birth-form .birth-date-trigger{order:2!important;flex:1 1 auto!important;width:auto!important;min-width:0!important;max-width:none!important;height:46px!important;}
        .birth-form button[type="submit"]{order:3!important;flex:0 0 auto!important;white-space:nowrap!important;}
        .birth-form .birth-reset{order:4!important;flex:0 0 64px!important;width:64px!important;min-width:64px!important;height:38px!important;white-space:nowrap!important;}
        .birth-form .birth-result.birth-warning{position:static!important;display:block!important;flex:0 0 78px!important;width:78px!important;min-width:78px!important;max-width:78px!important;margin:0!important;color:#a15b4c!important;white-space:nowrap!important;overflow:visible!important;text-align:left!important;pointer-events:none!important;}

        /* 운세 확인 전에는 카드 테두리와 높이는 유지하고 안의 내용만 비웁니다. */
        .mira-pending .overview .card{visibility:visible!important;}
        .mira-pending .overview .card>*{visibility:hidden!important;}
        .mira-pending .overview{min-height:208px!important;}

        /* 상세 운세는 긴 글도 읽기 편하도록 여백과 글자 크기를 확보합니다. */
        .z-dialog .detail-summary{font-size:14px!important;line-height:1.9!important;}
        .z-dialog .detail-item p{font-size:12px!important;line-height:1.75!important;}
        .z-dialog .detail-tip{font-size:13px!important;line-height:1.8!important;}
        @media(max-width:760px) and (hover:none) and (pointer:coarse){
          body{min-width:0!important;overflow-x:hidden!important;}
          .birth-box{min-height:76px!important;padding:14px!important;}
          .birth-copy{display:none!important;}
          .birth-form{left:10px!important;right:auto!important;width:calc(100% - 20px)!important;min-width:0!important;max-width:none!important;}
          .birth-form .birth-result{flex-basis:72px!important;width:72px!important;min-width:72px!important;max-width:72px!important;}
          .birth-form .birth-date-trigger{flex:1 1 auto!important;min-width:0!important;}
          .z-dialog{padding:18px!important;max-height:calc(100vh - 24px)!important;}
          .z-dialog h3{font-size:22px!important;}
        }
      `;
      document.head.appendChild(style);

      // 기존 로직이 결과 요소를 다시 옮겨도 항상 입력창 바로 왼쪽으로 되돌립니다.
      const observer=new MutationObserver(()=>{
        const f=document.getElementById('birthForm');
        const r=document.getElementById('birthResult');
        const t=f&&f.querySelector('.birth-date-trigger');
        if(!f||!r||!t)return;
        if(r.parentElement!==f || r.nextElementSibling!==t)f.insertBefore(r,t);
        if(r.classList.contains('birth-warning'))r.removeAttribute('style');
      });
      observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});

      setupDetailedZodiac(list);
    };

    // 띠/별자리마다 서로 다른 상세 설명을 표시합니다.
    function setupDetailedZodiac(list){
      if(!list)return;
      const animals=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
      const stars=['양자리','황소자리','쌍둥이자리','게자리','사자자리','처녀자리','천칭자리','전갈자리','사수자리','염소자리','물병자리','물고기자리'];
      const animalIcons=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
      const starIcons=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
      const scores=[72,76,79,83,86,89,92,74,81,87,94,78];
      const themes=[
        ['주변의 작은 변화보다 해야 할 일에 집중하면 흐름이 좋아집니다. 오전에는 생각이 많을 수 있지만 오후부터 점차 여유가 생겨요.','큰 지출은 한 번 더 확인하세요. 필요한 곳에만 쓰면 안정감이 생깁니다.','먼저 따뜻하게 말을 건네면 관계가 부드러워집니다.','미뤄둔 일을 순서대로 처리하면 좋은 평가를 받을 수 있어요.','피로가 쌓이지 않도록 식사와 휴식을 챙겨주세요.','오늘은 한 가지 일을 확실히 끝내는 것이 좋아요.'],
        ['꾸준히 해오던 일이 조금씩 결과로 돌아오는 날입니다. 급하게 방향을 바꾸기보다 현재 계획을 다듬어보세요.','충동구매를 줄이고 필요한 항목을 정리해보세요. 작은 절약이 도움이 됩니다.','상대의 말을 끝까지 들어주면 관계운이 좋아집니다.','성실함이 강점으로 드러나요. 맡은 일을 정확하게 마무리하세요.','목과 어깨가 뻐근해지지 않도록 중간중간 움직여주세요.','오늘은 속도보다 꾸준함을 선택하세요.'],
        ['새로운 제안이나 이야기가 들어올 수 있어요. 바로 결정하지 말고 조건을 확인한 뒤 움직이면 좋은 기회를 잡을 수 있습니다.','작은 수입이나 절약의 기회가 생길 수 있지만 욕심낸 투자는 피하세요.','가벼운 대화에서 관계가 가까워질 수 있어요.','아이디어를 먼저 실행하고 세부사항은 나중에 다듬어보세요.','활동량이 늘 수 있으니 수분을 충분히 챙기세요.','평소와 다른 작은 시도를 하나 해보세요.'],
        ['혼자 모든 일을 해결하려 하지 말고 도움을 적절히 나누면 훨씬 편안합니다. 주변과의 균형이 오늘의 핵심이에요.','예상 밖의 지출을 대비해 여유 자금을 남겨두세요.','원하는 것을 돌려 말하기보다 차분하게 표현하면 오해가 줄어듭니다.','협업에서 강점이 드러나는 날입니다. 역할을 명확히 나눠보세요.','늦은 시간까지 무리하지 말고 수면 리듬을 지켜주세요.','사람과의 조화를 우선하면 일이 자연스럽게 풀립니다.'],
        ['자신감이 올라오는 날입니다. 결과를 서두르기보다 한 단계씩 확인하면 실수를 줄일 수 있어요.','필요한 물건에 대한 소비는 괜찮지만 기분에 따른 소비는 줄이세요.','짧은 연락 하나도 좋은 분위기를 만들 수 있습니다.','발표나 제안처럼 자신을 보여주는 일에 유리합니다.','과도한 활동 뒤 피로가 몰릴 수 있으니 휴식을 잡아두세요.','자신 있게 하되 마지막 확인은 꼭 하세요.'],
        ['복잡했던 일이 정리되기 시작합니다. 우선순위가 높은 것부터 처리하면 성취감이 커져요.','작은 금액이라도 저축이나 지출 정리에 관심을 가져보세요.','서로의 생활을 존중하면 관계가 편안해집니다.','집중력이 좋아 혼자 몰입해야 하는 업무에 적합합니다.','규칙적인 식사와 가벼운 산책이 도움이 됩니다.','정리할수록 운이 트입니다.'],
        ['기다리던 소식이 조금 늦어질 수 있지만 전체 흐름은 안정적입니다. 다음 준비를 해두세요.','구독이나 반복 결제처럼 돈이 새는 부분을 확인해보세요.','작은 배려가 큰 호감으로 이어질 수 있어요.','기존 업무를 개선할 아이디어를 메모해두세요.','눈의 피로와 수면 부족을 조심하세요.','지금 당장 답이 없어도 준비를 멈추지 마세요.'],
        ['갑작스러운 일정 변경에도 유연하게 대응하면 오히려 기회가 됩니다. 변화에 적응하는 힘이 좋아요.','새로운 소비보다 현재 가진 것을 활용하는 것이 유리합니다.','감정을 숨기기보다 적당히 표현하면 상대도 마음을 이해하기 쉬워요.','변경된 일정에 빠르게 적응하면 주변의 신뢰를 얻습니다.','한 자세로 오래 있지 말고 틈틈이 움직여주세요.','예상 밖의 변화도 긍정적으로 받아들여보세요.'],
        ['말보다 행동으로 신뢰를 보여주는 것이 중요합니다. 약속한 일을 지키면 좋은 평가를 받을 수 있어요.','계획적인 소비에는 좋은 흐름이 있지만 큰 금액은 비교 후 결정하세요.','작은 약속이라도 지키는 모습이 관계를 단단하게 합니다.','책임감이 돋보이는 날입니다. 어려운 일도 끝까지 마무리하세요.','과로만 피하면 컨디션은 무난합니다.','작은 약속 하나를 확실하게 지켜보세요.'],
        ['새로운 사람이나 정보가 오늘의 흐름을 바꿀 수 있어요. 평소 관심 없던 분야에서도 힌트를 얻습니다.','정보를 확인한 뒤 움직이면 좋은 기회를 발견할 수 있어요.','새로운 만남에서 편안한 인연이 생길 수 있습니다.','배우고 익히는 데 좋은 날입니다. 새로운 방법을 하나 시도해보세요.','머리를 많이 쓰는 만큼 휴식도 챙겨주세요.','새로운 정보를 하나 받아들이면 시야가 넓어집니다.'],
        ['주변 상황을 객관적으로 보기 좋은 날입니다. 고민하던 문제도 다른 관점에서 답이 보일 수 있어요.','오늘은 안정이 우선입니다. 현재 지출을 관리하세요.','상대에게 공간을 주면 관계가 오히려 편안해집니다.','자료를 충분히 검토하면 좋은 결과를 얻을 수 있어요.','긴장을 풀 수 있는 조용한 시간이 필요합니다.','답을 서두르지 말고 한 번 더 생각해보세요.'],
        ['작은 행운이 여러 번 겹칠 수 있는 날입니다. 우연히 얻은 정보나 만남도 가볍게 넘기지 마세요.','작은 이득을 챙길 기회가 있지만 욕심은 금물입니다.','즐거운 약속이나 대화가 관계에 활력을 더해줘요.','성과를 보여줄 기회가 생길 수 있으니 자료를 정리해두세요.','활동 후에는 충분한 수분과 휴식을 보충하세요.','작은 기회를 발견하면 가볍게 잡아보세요.']
      ];
      const $=id=>document.getElementById(id);
      const render=(type,i)=>{
        const d=themes[i%themes.length];
        const names=type==='animal'?animals:stars;
        const icons=type==='animal'?animalIcons:starIcons;
        const score=scores[i%12];
        const grade=score>=90?'매우 좋음':score>=84?'좋음':score>=78?'무난':'차분';
        const money=Math.max(60,score-2+(i%8));
        const love=Math.max(60,score-4+((i*3)%10));
        const work=Math.max(60,score+((i*2)%7));
        const health=Math.max(60,score-3+((i*5)%9));
        $('zDetailIcon').textContent=icons[i];
        $('zDetailTitle').textContent=names[i];
        $('zDetailType').textContent=type==='animal'?'오늘의 띠별 운세':'오늘의 별자리 운세';
        $('zDetailGrade').textContent=grade+' · '+score+'점';
        $('zDetailSummary').textContent=d[0];
        $('zDetailGrid').innerHTML=[['재물운',money,d[1]],['애정운',love,d[2]],['직장운',work,d[3]],['건강운',health,d[4]]].map(v=>`<div class="detail-item"><b>${v[0]}</b><strong>${v[1]}점</strong><p>${v[2]}</p></div>`).join('');
        $('zDetailTip').textContent='오늘의 포인트 · '+d[5];
        $('zDetail').classList.add('open');
        document.body.style.overflow='hidden';
      };
      if(list.dataset.detailBound==='1')return;
      list.dataset.detailBound='1';
      list.addEventListener('click',e=>{
        const card=e.target.closest('.z');
        if(!card)return;
        e.stopImmediatePropagation();
        render(card.dataset.ztype,+card.dataset.zindex);
      },true);
      list.addEventListener('keydown',e=>{
        const card=e.target.closest('.z');
        if(!card || (e.key!=='Enter'&&e.key!==' '))return;
        e.preventDefault();
        e.stopImmediatePropagation();
        render(card.dataset.ztype,+card.dataset.zindex);
      },true);
    }
    apply();
  };
  script.onerror=()=>console.error('Mira fortune script failed to load.');
  document.head.appendChild(script);
})();
