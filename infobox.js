"use-strict";
var H5P = H5P || {};
 
H5P.Infobox = (function ($) {

  /**
   * @function Constructor
   */
  function Constructor(options, id) {
    this.options = $.extend(true, {}, {
      content: null,
      image: null
    }, options);
    this.id = id;
  };
 
  /**
   * Attach function called by H5P framework to insert H5P content into page
   * 
   * @function attach
   * @param {jQuery} $container
   */
  Constructor.prototype.attach = function ($container) {
    var self = this;
    let finished = false;
    let start = self.options.start;
    let end = self.options.end.content;
    let settings = self.options.end.settings;
    let feedback = self.options.end.feedback;
    let progress = self.options.progress.duration;
    const heightClass = 'infobox-' + self.options.height;
    $container.addClass("h5p-infobox");

    // NEW
    let main;
    let close;
    let forwards;
    let back;
    let backwards;
    let durationstatus;
    let inputMain;
    let inputClose;

    /**
     * Build the pages content trees
     * 
     * @function buildDom
     * 
    */
    //const buildDom = function () {
    buildDom = () => {

      // Header
      let mainheader = self.options.header 
        ? prepareElements(
          'div', ['infobox-header'], self.options.header) 
        : '';
      let closeheader = self.options.header 
        ? prepareElements(
          'div', ['infobox-header'], self.options.header) 
        : '';

      // Duration
      let duration = prepareElements(
        'div', ['infobox-durationcontainer']);
      durationstatus = prepareElements(
        'div', ['infobox-durationstatus']);
      let progressbar = 'animation: progress linear ' + progress + 's';
      durationstatus.setAttribute('style', progressbar);
      forwards = prepareElements(
        'i', ['fa', 'fa-chevron-right', 'infobox-icon']);
      durationstatus.append(forwards);
      duration.append(durationstatus);

      // Backbutton
      back = prepareElements(
        'div', ['infobox-backcontainer', 'infobox-back', 'infobox-btn']);
      backwards = prepareElements(
        'i', ['fa', 'fa-chevron-left', 'infobox-icon']);
      back.append(backwards);
      back = self.options.end.settings.return === 'allowed' ? back : '';

      // Main
      main = prepareElements(
        'div', ['h5p-infobox-container', 'h5p-infobox-main', heightClass]);
      inputMain = handleInput(self.options.start);
      let maincontent = prepareElements(
        'div', ['infobox-content']
      );
      maincontent.append(inputMain.introtext, inputMain.image, inputMain.extensiontext);
      main.append(mainheader, maincontent, duration);

      // Close
      close = prepareElements(
        'div', ['h5p-infobox-container', 'h5p-infobox-close', heightClass]);
      inputClose = handleInput(self.options.end.content);
      let closecontent = prepareElements(
        'div', ['infobox-content']
      );
      closecontent.append(inputClose.introtext, inputClose.image, inputClose.extensiontext);
      close.append(closeheader, closecontent, back);

      // Append content
      $container.append(main, close);


      // Adjust layout for main page
      if (start.display == 'fit') {
        main.classList.add('infobox-fit');
        let m1 = inputMain.introtext ? inputMain.introtext.offsetHeight : 0;
        let m2 = inputMain.extensiontext ? inputMain.extensiontext.offsetHeight : 0;
        inputMain.image ? inputMain.image.style.height = self.options.height - m1 - m2 + 'px' : false;
      } else {
        main.classList.add('infobox-scroll');
      }

      // Adjust layout for closing page
      if (end.display == 'fit') {
        close.classList.add('infobox-fit');
        let c1 = inputClose.introtext ? inputClose.introtext.offsetHeight : 0;
        let c2 = inputClose.extensiontext ? inputClose.extensiontext.offsetHeight : 0;
        inputClose.image ? inputClose.image.style.height = self.options.height - c1 - c2 + 'px' : false;
      } else {
        close.classList.add('infobox-scroll');
      }

      // Make pages visible by not displaying closing page
      close.style.display = 'none';
      main.style.visibility = 'visible';
      close.style.visibility = 'visible';
    };

    /**
     * Create element structures
     * 
     * @function prepareElements
     * @param {string} type
     * @param {string} classes
     * @param {string} content
     * @param {string} attribute
     * 
    */
    prepareElements = (type, classes, content, attribute) => {
      let element = document.createElement(type);
      if (classes) {
        for (let i = 0; i < classes.length; i++) {
          element.classList.add(classes[i]);
        }
      }
      content ? element.innerHTML = content : false;
      return element;
    };

    /**
     * Handle input by building their dom elements
     * 
     * @function handleInput
     * @param {Object} content adress of the target page
     * 
    */
    handleInput = (content) => {
      introtext = content.introtext 
        ? prepareElements(
            'div', ['infobox-text', 'infobox-introtext'], content.introtext)
        : '';
      if (content.image && content.image.path) {
        image = prepareElements(
          'div', ['infobox-image-container']);
        let imagecontent = prepareElements(
          'img', ['infobox-image']);
        imagecontent.setAttribute('src', H5P.getPath(content.image.path, self.id));
        image.append(imagecontent);
      } else {
          image = '';
          imagecontent = '';
      }
      extensiontext = content.extensiontext 
        ? prepareElements(
          'div', ['infobox-text', 'infobox-extensiontext'], content.extensiontext)
        : '';

      return {
        introtext,
        image,
        imagecontent,
        extensiontext
      }

    };

    /**
     * Check and handle the entered time
     * 
     * @function checkTime
     * @param {number} progress
     * 
     */
    checkTime = () => {
      let time = 0;
      let interval = setInterval (function(){
        time ++;
        if (time == progress) {
          clearInterval(interval);
          finishActivity();
          return;
        }
      }, 1000);
    };

    /**
     * Finish activity by triggering xAPI
     * 
     * @function finishActivity
     * 
    */
    finishActivity = () => {
      if (feedback == 'enabled') {
        forwards.style.opacity = '1';
        backwards.style.opacity = '1';
        durationstatus.classList.add('infobox-btn');
        durationstatus.onclick = (event) => {
          showClosing();
        };
      } else {
        fireXapi();
        return;
      }
      settings.trigger !== 'manual' ? showClosing() : false;
    };

    /**
     * Switch to the closing page and handle their actions
     * 
     * @function showClosing
     * 
    */
    showClosing = () => {
      main.style.display = 'none';
      close.style.display = 'flex';
      fireXapi();
      if (settings.return) {
        back.onclick = (event) => {
          showMain();
        };
      }
    };

    /**
     * Show main after switching from closing page
     * 
     * @function showMain
     * 
    */
    showMain = () => {
      durationstatus.style.animation = 'none';
      durationstatus.style.width = '100%';
      main.style.display = 'flex';
      close.style.display = 'none';
    };

    /**
     * Triggering xAPI if it hasn't happened before
     * 
     * @function fireXapi
     * 
    */
    fireXapi = () => {
      if (!finished) {
        self.options.progress.grade 
            ? self.triggerXAPICompleted(1, 1, true, true) 
            : self.triggerXAPICompleted(0, 0, false);
          finished = true;
      }
    };

    /**
     * Main function for triggering next steps
     * 
     * @function
     * 
    */
    (function() {
      buildDom();
      checkTime (progress);
    })();

  };
  return Constructor;
})(H5P.jQuery);