(() => {
  const TYPE_STICKY = "sticky";
  const TYPE_NORMAL = "normal";

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

  window.addEventListener("resize", () => {
    setLayout();
  });

  setLayout();
})();
