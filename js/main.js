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

  // 애니메이션 감속수치
  let acc = 0.1;
  let delayedYOffset = 0;
  // request animation frame 을 제어하기위한 변수 ID 와 State 플래그 생성
  let rafId;
  let rafState;

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
        cnavas_opacity: [1, 0, { start: 0.9, end: 1 }],
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
        canvas: document.querySelector('#video-canvas-1'),
        context: document.querySelector('#video-canvas-1').getContext('2d'),
        videoImages: [],
      },
      values: {
        videoImageCount: 960,
        imageSequence: [0, 959],
        cnavas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
        cnavas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
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
        canvas: document.querySelector('.image-blend-canvas'),
        context: document.querySelector('.image-blend-canvas').getContext('2d'),
        imagesPath: ['./images/blend-image-1.jpg', './images/blend-image-2.jpg'],
        images: [],
      },
      values: {
        rect1PosX: [0, 0, { start: 0, end: 0 }],
        rect2PosX: [0, 0, { start: 0, end: 0 }],
        imageBlendHeight: [0, 0, { start: 0, end: 0 }],
        canvas_scale: [0, 0, { start: 0, end: 0 }],
        canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
        canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
        rectStartY: 0,
      },
    },
  ];

  function setCanvasImages() {
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      let image = new Image();
      image.src = `./video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(image);
    }

    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      let image = new Image();
      image.src = `./video/002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].objs.videoImages.push(image);
    }

    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
      let image = new Image();
      image.src = sceneInfo[3].objs.imagesPath[i];
      sceneInfo[3].objs.images.push(image);
    }
  }

  function checkMemu() {
    if (yOffset > 44) {
      document.body.classList.add('local-nav-sticky');
    } else {
      document.body.classList.remove('local-nav-sticky');
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
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${canvasHeightRatio})`;
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
        objs.canvas.style.opacity = calcValues(values.cnavas_opacity, currentY);

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
        objs.canvas.style.opacity = calcValues(
          scrollRatio <= 0.2 ? values.cnavas_opacity_in : values.cnavas_opacity_out,
          currentY
        );

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

        // 섹션 2의 마지막 부분에서 섹션 3에서 보여줘야야 될 캔버스 이미지와 위치, 크기를 미리 계산한다.
        if (scrollRatio > 0.9) {
          const { objs: objs3, values: values3 } = sceneInfo[3];
          const { canvas, context, images } = objs3;
          const { rect1PosX, rect2PosX } = values3;
          // 캔버스 이미지가 기로세로 모두 꽉 차게하기 위해 셋팅
          const widthRatio = window.innerWidth / canvas.width;
          const heightRatio = window.innerHeight / canvas.height;
          const canvasScaleRatio = widthRatio <= heightRatio ? heightRatio : widthRatio;
          // 캔버스 사이즈에 맞춰 다시 계산한 넓이, 높이
          const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
          const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
          // 캔버스를 가릴 박스의 사이즈 지정
          const whiteRectWidth = recalculatedInnerWidth * 0.15;
          // 박스의 x 좌표를 계산한다.
          // 매번 새로 계산을 해줘야 하는 이유는 브라우저의 크기에 따라서 값이 유동적으로 변하기 때문
          rect1PosX[0] = (canvas.width - recalculatedInnerWidth) / 2;
          rect1PosX[1] = rect1PosX[0] - whiteRectWidth;
          rect2PosX[0] = rect1PosX[0] + recalculatedInnerWidth - whiteRectWidth;
          rect2PosX[1] = rect2PosX[0] + whiteRectWidth;

          canvas.style.transform = `scale(${canvasScaleRatio})`;
          context.fillStyle = 'white';
          context.drawImage(images[0], 0, 0);
          context.fillRect(rect1PosX[0], 0, parseInt(whiteRectWidth), canvas.height);
          context.fillRect(rect2PosX[0], 0, parseInt(whiteRectWidth), canvas.height);
        }
        break;
      case 3:
        const { canvas, context, images, canvasCaption } = objs;
        const {
          rect1PosX,
          rect2PosX,
          imageBlendHeight,
          canvas_scale,
          canvasCaption_opacity,
          canvasCaption_translateY,
        } = values;

        // 스텝에 따라서 보여줘야될 이미지와 애니메이션을 실행한다.
        let step = 0;
        // 캔버스 이미지가 기로세로 모두 꽉 차게하기 위해 셋팅
        const widthRatio = window.innerWidth / canvas.width;
        const heightRatio = window.innerHeight / canvas.height;
        const canvasScaleRatio = widthRatio <= heightRatio ? heightRatio : widthRatio;
        // 캔버스 사이즈에 맞춰 다시 계산한 넓이, 높이
        const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
        const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
        // 캔버스를 가릴 박스의 사이즈 지정
        const whiteRectWidth = recalculatedInnerWidth * 0.15;

        if (!values.rectStartY) {
          values.rectStartY =
            canvas.offsetTop + (canvas.height - canvas.height * canvasScaleRatio) / 2;

          const rectAnimationStart = window.innerHeight / 2 / scrollHeight;
          const rectAnimationEnd = values.rectStartY / scrollHeight;
          rect1PosX[2].start = rectAnimationStart;
          rect2PosX[2].start = rectAnimationStart;
          rect1PosX[2].end = rectAnimationEnd;
          rect2PosX[2].end = rectAnimationEnd;
        }

        // 박스의 x 좌표를 계산한다.
        // 매번 새로 계산을 해줘야 하는 이유는 브라우저의 크기에 따라서 값이 유동적으로 변하기 때문
        rect1PosX[0] = (canvas.width - recalculatedInnerWidth) / 2;
        rect1PosX[1] = rect1PosX[0] - whiteRectWidth;
        rect2PosX[0] = rect1PosX[0] + recalculatedInnerWidth - whiteRectWidth;
        rect2PosX[1] = rect2PosX[0] + whiteRectWidth;

        canvas.style.transform = `scale(${canvasScaleRatio})`;
        context.fillStyle = 'white';
        context.drawImage(images[0], 0, 0);
        context.fillRect(
          calcValues(rect1PosX, currentY),
          0,
          parseInt(whiteRectWidth),
          canvas.height
        );
        context.fillRect(
          calcValues(rect2PosX, currentY),
          0,
          parseInt(whiteRectWidth),
          canvas.height
        );

        if (scrollRatio < rect1PosX[2].end) {
          // 캔버스가 브라우저 상단에 닿지 았았을 때
          step = 1;
          canvas.classList.remove('sticky');
        } else {
          // 캔버스가 상단에 닿았을 때
          step = 2;

          imageBlendHeight[0] = 0;
          imageBlendHeight[1] = canvas.height;
          imageBlendHeight[2].start = rect1PosX[2].end;
          imageBlendHeight[2].end = imageBlendHeight[2].start + 0.2;
          let blendHeight = calcValues(imageBlendHeight, currentY);

          context.drawImage(
            images[1],
            0,
            canvas.height - blendHeight,
            canvas.width,
            blendHeight,
            0,
            canvas.height - blendHeight,
            canvas.width,
            blendHeight
          );

          canvas.classList.add('sticky');
          canvas.style.top = `-${(canvas.height - canvas.height * canvasScaleRatio) / 2}px`;

          if (scrollRatio > imageBlendHeight[2].end) {
            canvas_scale[0] = canvasScaleRatio;
            canvas_scale[1] = document.body.offsetWidth / (1.5 * canvas.width);
            canvas_scale[2].start = imageBlendHeight[2].end;
            canvas_scale[2].end = canvas_scale[2].start + 0.2;

            canvas.style.transform = `scale(${calcValues(canvas_scale, currentY)})`;
            canvas.style.marginTop = 0;
          }

          if (scrollRatio > canvas_scale[2].end && canvas_scale[2].end > 0) {
            canvas.classList.remove('sticky');
            canvasCaption_opacity[2].start = canvas_scale[2].end;
            canvasCaption_opacity[2].end = canvasCaption_opacity[2].start + 0.1;
            canvasCaption_translateY[2].start = canvasCaption_opacity[2].start;
            canvasCaption_translateY[2].end = canvasCaption_opacity[2].end;

            canvas.style.marginTop = `${scrollHeight * 0.4}px`;
            canvasCaption.style.opacity = calcValues(canvasCaption_opacity, currentY);
            canvasCaption.style.transform = `translate3d(0, ${calcValues(
              canvasCaption_translateY,
              currentY
            )}%, 0)`;
          }
        }

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

    if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      enableNewScene = true;

      if (currentScene >= sceneInfo.length) {
        currentScene = sceneInfo.length - 1;
      }
    }
    if (delayedYOffset < prevScrollHeight) {
      currentScene--;
      enableNewScene = true;

      if (currentScene < 0) currentScene = 0;
    }

    // 현재 스크롤 되고 있는 화면 지정
    document.body.setAttribute('id', `show-scene-${currentScene}`);

    if (enableNewScene) return;

    playAnimation();
  }

  function smoothAnimationLoop() {
    // 값을 acc 의 비율만큼 증가시키는 패턴,
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    if (!enableNewScene) {
      // 좀 더 부드러운 비디오 이미지 처리를 위해 작성
      if (currentScene === 0 || currentScene === 2) {
        const { objs, values } = sceneInfo[currentScene];
        const { context, videoImages } = objs;
        const currentY = delayedYOffset - prevScrollHeight;
        let imageSequence = Math.round(calcValues(values.imageSequence, currentY));
        if (videoImages[imageSequence]) {
          context.drawImage(videoImages[imageSequence], 0, 0);
        }
      }
    }

    rafId = requestAnimationFrame(smoothAnimationLoop);

    // 연산이 목표치만큼 이루어졌을 때 불필요한 연산을 막기위해 멈춘다.
    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  window.addEventListener('load', () => {
    document.body.classList.remove('before-load');
    setLayout();
    const { context, videoImages } = sceneInfo[0].objs;
    context.drawImage(videoImages[0], 0, 0);

    window.addEventListener('scroll', () => {
      // 페이지의 현재 스크롤 값을 변수에 할당한다.
      yOffset = window.pageYOffset;
      scrollLoop();
      checkMemu();

      if (!rafState) {
        rafId = requestAnimationFrame(smoothAnimationLoop);
        rafState = true;
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        setLayout();
      }
      sceneInfo[3].values.rectStartY = 0;
    });

    // 모바일기기에서 화면전환시 레이아웃을 재설정 한다.
    window.addEventListener('orientationchange', setLayout);

    // 로딩 트랜지션 이벤트가 끝나면 바디에서 제거한다.
    document.querySelector('.loading').addEventListener('transitionend', (e) => {
      document.body.removeChild(e.currentTarget);
    });
  });

  setCanvasImages();
})();
