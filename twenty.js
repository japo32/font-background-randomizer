jQuery.noConflict();
(function($) {
  $(document).ready(function() {
    const $window = $(window);
    const fonts = ['limelight', 'lobster', 'mate', 'playfair', 'raleway', 'roboto'];
    // const backgrounds = ['pattern-checks-md slategray-darker','pattern-grid-md slategray-darker','pattern-dots-md slategray-darker','pattern-cross-dots-md slategray-darker','pattern-diagonal-lines-md slategray-darker','pattern-horizontal-lines-md slategray-darker','pattern-vertical-lines-md slategray-darker','pattern-diagonal-stripes-md slategray-darker','pattern-horizontal-stripes-md slategray-darker','pattern-vertical-stripes-md slategray-darker','pattern-triangles-md slategray-darker','pattern-zigzag-md slategray-darker'];
    const backgrounds = ['pattern-checks-md pink-lightest bg-red-dark', 'pattern-grid-md yellow-darker bg-yellow', 'pattern-dots-md yellow bg-indigo', 'pattern-cross-dots-md white bg-black-70', 'pattern-diagonal-lines-md red bg-black', 'pattern-horizontal-lines-md mint-darker bg-mint', 'pattern-vertical-lines-md indigo bg-blue-lighter', 'pattern-diagonal-stripes-md white bg-blue', 'pattern-horizontal-stripes-md white bg-indigo', 'pattern-vertical-stripes-md purple-darkest bg-red-light', 'pattern-triangles-md yellow bg-indigo', 'pattern-zigzag-md yellow bg-red'];

    const randomizeFont = function(item, interval) {
      fonts.forEach(function(font) {
        item.removeClass('font-' + font);
      });
      const rndInt = Math.floor(Math.random() * fonts.length);
      item.addClass('font-' + fonts[rndInt]);

      setTimeout(function() {
        randomizeFont(item, interval);
      }, interval);
    };

    const durationFont = 50;

    randomizeFont($('.one'), durationFont);
    randomizeFont($('.two'), durationFont);
    randomizeFont($('.three'), durationFont);
    randomizeFont($('.four'), durationFont);
    randomizeFont($('.five'), durationFont);


    const randomizeBackground = function(item, interval) {
      backgrounds.forEach(function(backgroundClass) {
        item.removeClass(backgroundClass);
      });
      const rndInt = Math.floor(Math.random() * backgrounds.length);
      item.addClass(backgrounds[rndInt]);

      setTimeout(function() {
        randomizeBackground(item, interval);
      }, interval);
    };

    const durationBg = 100;

    randomizeBackground($('.bg-pattern'), durationBg);




    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 50;
    const maxSize = 50;
    let mousePos = vec2.fromValues(innerWidth * 0.25, innerHeight * 0.5);
    let numThingsX;
    let numThingsY;
    let things;

    function drawThing(thing) {
      const {pos, radius} = thing;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function loop() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      things.forEach(thing => {
        const dist = vec2.dist(mousePos, thing.pos);
        thing.radius = clamp(dist * dist * 0.00005 - 1, 0, maxSize);
        drawThing(thing);
      });
      // For now I'm turning off the RAF loop because
      // there are no ongoing animations.
      // window.requestAnimationFrame(loop);
    }

    function makeThing(x, y) {
      return {
        pos: vec2.fromValues(x, y),
        radius: 2,
      };
    }

    function makeThings() {
      things = [];
      for (let i = 0; i < numThingsY; i += 1) {
        for (let j = 0; j < numThingsX; j += 1) {
          const thing = makeThing(j * cellSize + cellSize * 0.5, i * cellSize + cellSize * 0.5);
          things.push(thing);
        }
      }
    }

    function sizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const canvasRect = canvas.getBoundingClientRect();
      canvas.width = canvasRect.width * dpr;
      canvas.height = canvasRect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    function handleResize() {
      sizeCanvas();
      numThingsX = Math.ceil(innerWidth / cellSize);
      numThingsY = Math.ceil(innerHeight / cellSize);
      makeThings();
    }
    window.addEventListener('resize', throttled(handleResize));

    function handleMouseMove(event) {
      vec2.set(mousePos, event.clientX, event.clientY);
      loop();
    }
    window.addEventListener('mousemove', throttled(handleMouseMove));

    // Kick it off
    handleResize();
    loop();

    // USEFUL FUNCTIONS ----------
    function throttled(fn) {
      let didRequest = false;
      return param => {
        if (!didRequest) {
          window.requestAnimationFrame(() => {
            fn(param);
            didRequest = false;
          });
          didRequest = true;
        }
      };
    }
    function clamp (value, min = 0, max = 1) {
      return value <= min ? min : value >= max ? max : value;
    }

  });
}(jQuery));
