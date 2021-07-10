(() => {
  const TYPE_STICKY = 'sticky';
  const TYPE_NORMAL = 'normal';

  // 페이지의 y 스크롤 오프셋
  let yOffset = 0;
  // 현재 스크롤 위치 보다 이전에 위치한 섹션들의 스크롤 높이의 합
  let prevScrollHeight = 0;
  // 현재 활성화된 씬
  let currentScene = 0;

  const sceneInfo = [
    {
      //scene 0
      type: TYPE_STICKY,
      MultipleOfHeight: 5, //Multiple of browser height
      scrollHeight: 0,
      objs: {
        container: document.querySelector('.scroll-section[id="0"]'),
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
  }

  function scrollLoop() {
    prevScrollHeight = sceneInfo.reduce((acc, scene, idx) => {
      if (idx < currentScene) {
        acc += scene.scrollHeight;
      }
      return acc;
    }, 0);

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      if (currentScene >= sceneInfo.length) {
        currentScene = sceneInfo.length - 1;
      }
    } else if (yOffset < prevScrollHeight) {
      currentScene--;
      if (currentScene < 0) currentScene = 0;
    }

    // 현재 스크롤 되고 있는 화면
    // console.log(currentScene);
  }

  window.addEventListener('resize', () => {
    setLayout();
  });

  window.addEventListener('scroll', () => {
    // 페이지의 현재 스크롤 값을 변수에 할당한다.
    yOffset = window.pageYOffset;
    scrollLoop();
  });

  setLayout();
})();
