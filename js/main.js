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
      multipleOfHeight: 5, //Multiple of browser height
      scrollHeight: 0,
      objs: {
        container: document.querySelector('.scroll-section[id="0"]'),
        messageA: document.querySelector('.scroll-section[id="0"] .main-message.a'),
        messageB: document.querySelector('.scroll-section[id="0"] .main-message.b'),
        messageC: document.querySelector('.scroll-section[id="0"] .main-message.c'),
        messageD: document.querySelector('.scroll-section[id="0"] .main-message.d'),
        canvas: document.querySelector('#video-canvas-0'),
        context: document.querySelector('#video-canvas-0').getContext('2d'),
        videoImages: [],
      },
      values: {
        videoImageCount: 300,
        imageSequence: [0, 299],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],

        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageB_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],

        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageC_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],

        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageD_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
      },
    },
    {
      //scene 1
      type: TYPE_NORMAL,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('.scroll-section[id="1"]'),
        content: document.querySelector('.scroll-section[id="1"] .product-desc'),
      },
    },
    {
      //scene 2
      type: TYPE_STICKY,
      multipleOfHeight: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('.scroll-section[id="2"]'),
        messageA: document.querySelector('.scroll-section[id="2"] .a'),
        messageB: document.querySelector('.scroll-section[id="2"] .b'),
        messageC: document.querySelector('.scroll-section[id="2"] .c'),
        pinB: document.querySelector('.scroll-section[id="2"] .b .pin'),
        pinC: document.querySelector('.scroll-section[id="2"] .c .pin'),
      },
      values: {
        messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
        messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],

        messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
        messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
        messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
        messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],

        messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
        messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
        messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],

        pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
        pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
      },
    },
    {
      //scene 3
      type: TYPE_STICKY,
      multipleOfHeight: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('.scroll-section[id="3"]'),
        canvasCaption: document.querySelector('.scroll-section[id="3"] .product-caption'),
      },
      values: {},
    },
  ];

  function setCanvasImages() {
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      let image = new Image();
      image.src = `./video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(image);
    }
  }

  function setLayout() {
    const windowHeight = window.innerHeight;
    sceneInfo.forEach((scene) => {
      const { type, multipleOfHeight } = scene;
      let sceneHeight = 0;
      if (type === TYPE_STICKY) {
        sceneHeight = multipleOfHeight * windowHeight;
      } else if (type === TYPE_NORMAL) {
        sceneHeight = scene.objs.container.offsetHeight;
      }

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

    const canvasHeightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${canvasHeightRatio})`;
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
    const { objs, values, scrollHeight } = sceneInfo[currentScene];
    const currentY = yOffset - prevScrollHeight;
    const scrollRatio = currentY / scrollHeight;

    // TODO : 코드를 좀 더 깔끔하게 작성해야 함
    switch (currentScene) {
      case 0:
        let imageSequence = Math.round(calcValues(values.imageSequence, currentY));
        objs.context.drawImage(objs.videoImages[imageSequence], 0, 0);

        objs.messageA.style.opacity = calcValues(
          scrollRatio <= 0.22 ? values.messageA_opacity_in : values.messageA_opacity_out,
          currentY
        );
        objs.messageA.style.transform = `translate3d(0, ${calcValues(
          scrollRatio <= 0.22 ? values.messageA_translateY_in : values.messageA_translateY_out,
          currentY
        )}%, 0)`;

        objs.messageB.style.opacity = calcValues(
          scrollRatio <= 0.42 ? values.messageB_opacity_in : values.messageB_opacity_out,
          currentY
        );
        objs.messageB.style.transform = `translate3d(0, ${calcValues(
          scrollRatio <= 0.42 ? values.messageB_translateY_in : values.messageB_translateY_out,
          currentY
        )}%, 0)`;

        objs.messageC.style.opacity = calcValues(
          scrollRatio <= 0.62 ? values.messageC_opacity_in : values.messageC_opacity_out,
          currentY
        );
        objs.messageC.style.transform = `translate3d(0, ${calcValues(
          scrollRatio <= 0.62 ? values.messageC_translateY_in : values.messageC_translateY_out,
          currentY
        )}%, 0)`;

        objs.messageD.style.opacity = calcValues(
          scrollRatio <= 0.82 ? values.messageD_opacity_in : values.messageD_opacity_out,
          currentY
        );
        objs.messageD.style.transform = `translate3d(0, ${calcValues(
          scrollRatio <= 0.82 ? values.messageD_translateY_in : values.messageD_translateY_out,
          currentY
        )}%, 0)`;
        break;
      case 1:
        break;
      case 2:
        objs.messageA.style.opacity = calcValues(
          scrollRatio <= 0.32 ? values.messageA_opacity_in : values.messageA_opacity_out,
          currentY
        );
        objs.messageA.style.transform = `translate3d(0, ${calcValues(
          scrollRatio <= 0.32 ? values.messageA_translateY_in : values.messageA_translateY_out,
          currentY
        )}%, 0)`;

        objs.messageB.style.opacity = calcValues(
          scrollRatio <= 0.67 ? values.messageB_opacity_in : values.messageB_opacity_out,
          currentY
        );
        objs.messageB.style.transform = `translate3d(0, ${calcValues(
          scrollRatio <= 0.67 ? values.messageB_translateY_in : values.messageB_translateY_out,
          currentY
        )}%, 0)`;

        objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentY)})`;

        objs.messageC.style.opacity = calcValues(
          scrollRatio <= 0.93 ? values.messageC_opacity_in : values.messageC_opacity_out,
          currentY
        );
        objs.messageC.style.transform = `translate3d(0, ${calcValues(
          scrollRatio <= 0.93 ? values.messageC_translateY_in : values.messageC_translateY_out,
          currentY
        )}%, 0)`;

        objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentY)})`;
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
    const { context, videoImages } = sceneInfo[0].objs;
    context.drawImage(videoImages[0], 0, 0);
  });

  setCanvasImages();
})();
