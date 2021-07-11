(() => {
  const TYPE_STICKY = 'sticky';
  const TYPE_NORMAL = 'normal';

  // 페이지의 y 스크롤 오프셋
  let yOffset = 0;
  // 현재 스크롤 위치 보다 이전에 위치한 섹션들의 스크롤 높이의 합
  let prevScrollHeight = 0;
  // 현재 활성화된 씬
  let currentScene = 0;

  // 다음 씬 활성화시 ture 로 전환
  let enableNewScene = false;

  const sceneInfo = [
    {
      //scene 0
      type: TYPE_STICKY,
      MultipleOfHeight: 5, //Multiple of browser height
      scrollHeight: 0,
      objs: {
        container: document.querySelector('.scroll-section[id="0"]'),
        messageA: document.querySelector('.scroll-section[id="0"] .main-message.a'),
        messageB: document.querySelector('.scroll-section[id="0"] .main-message.b'),
        messageC: document.querySelector('.scroll-section[id="0"] .main-message.c'),
        messageD: document.querySelector('.scroll-section[id="0"] .main-message.d'),
      },
      values: {
        messageA_opacity: [0, 1, { start: 0.1, end: 0.2 }],
      },
    },
    {
      //scene 1
      type: TYPE_NORMAL,
      MultipleOfHeight: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('.scroll-section[id="1"]'),
      },
    },
    {
      //scene 2
      type: TYPE_STICKY,
      MultipleOfHeight: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('.scroll-section[id="2"]'),
      },
    },
    {
      //scene 3
      type: TYPE_STICKY,
      MultipleOfHeight: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('.scroll-section[id="3"]'),
      },
    },
  ];

  function setLayout() {
    const windowHeight = window.innerHeight;
    sceneInfo.forEach((scene) => {
      const sceneHeight = scene.MultipleOfHeight * windowHeight;
      scene.scrollHeight = sceneHeight;
      scene.objs.container.style.height = `${sceneHeight}px`;
    });

    // 레이아웃을 셋팅할 때 현재 위치한 스크롤 위치에 따라 현재 페이지 위치를 설정한다.
    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  function calcValues(values, currentY) {
    const [startValue, endValue, frameValues] = values;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentY / scrollHeight;

    let result = 0;
    if (frameValues) {
      const { start, end } = frameValues;
      const frameScrollStart = start * scrollHeight;
      const frameScrollEnd = end * scrollHeight;
      const frameScrollRange = frameScrollEnd - frameScrollStart;

      // 현재 스크롤 영역이 파트의 영역 안에 있을 때
      if (currentY >= frameScrollStart && currentY <= frameScrollEnd) {
        let framScrollRatio = (currentY - frameScrollStart) / frameScrollRange;
        result = framScrollRatio * (endValue - startValue) + startValue;
      }
      // 현재 스크롤 영역이 파트의 시작점에 들어오기 전일 때
      else if (currentY < frameScrollStart) {
        result = startValue;
      }
      // 현재 스크롤 영역이 파트의 영역을 넘어섰을 때
      else if (currentY > frameScrollEnd) {
        result = endValue;
      }
    } else {
      result = scrollRatio * (endValue - startValue) + startValue;
    }

    return result;
  }

  function playAnimation() {
    const { objs, values } = sceneInfo[currentScene];
    const currentY = yOffset - prevScrollHeight;

    // console.log(currentScene, currentY);

    // TODO : 코드를 좀 더 깔끔하게 작성해야 함
    switch (currentScene) {
      case 0:
        let msgA_animation = calcValues(values.messageA_opacity, currentY);
        obj.messageA.style.opacity = msgA_animation;

        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  function scrollLoop() {
    prevScrollHeight = sceneInfo.reduce((height, scene, idx) => {
      if (idx < currentScene) {
        height += scene.scrollHeight;
      }
      return height;
    }, 0);

    enableNewScene = false;

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      enableNewScene = true;

      if (currentScene >= sceneInfo.length) {
        currentScene = sceneInfo.length - 1;
      }
    }
    if (yOffset < prevScrollHeight) {
      currentScene--;
      enableNewScene = true;

      if (currentScene < 0) currentScene = 0;
    }

    // 현재 스크롤 되고 있는 화면 지정
    document.body.setAttribute('id', `show-scene-${currentScene}`);

    if (enableNewScene) return;

    playAnimation();
  }

  window.addEventListener('scroll', () => {
    // 페이지의 현재 스크롤 값을 변수에 할당한다.
    yOffset = window.pageYOffset;
    scrollLoop();
  });

  window.addEventListener('resize', () => {
    setLayout();
  });

  window.addEventListener('load', () => {
    setLayout();
  });
})();
