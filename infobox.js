"use-strict";
var H5P = H5P || {};
 
H5P.Infobox = (function ($) {

  /**
   * @function Constructor
   */
  function Constructor(options, id) {
    H5P.EventDispatcher.call(this); //CORRECT?
    this.options = $.extend(true, {}, {
      content: null,
      image: null
    }, options);
    this.id = id;
  };
 
  /**
   * @function
   * @param {jQuery} $container
   * @description attach function called by H5P framework to insert H5P content into page
   */
  Constructor.prototype.attach = function ($container) {
    var self = this;
    let finished = false;
    let start = self.options.start;
    let end = self.options.end.content;
    let settings = self.options.end.settings;
    let feedback = self.options.end.feedback;
    let progress = self.options.progress.duration;
    $container.addClass("h5p-infobox");

    /**
     * @function prepareContent
     * @description prepare all content the pages
     * 
    */
    let prepareContent = function () {

      // Build framework
      let header = self.options.header ? '<div class="infobox-header">' + self.options.header + '</div>' : '';
      let duration = '<div class="infobox-durationcontainer"><div class="infobox-durationstatus" style="animation: progress linear ' + progress + 's"><i class="fa fa-chevron-right infobox-icon"></i></div></div>';
      let back = (self.options.end.settings.return == 'allowed') ? '<div class="infobox-backcontainer infobox-back infobox-btn"><i class="fa fa-chevron-left infobox-icon"></i></div>' : '';
      let main = '<div class="h5p-infobox-container h5p-infobox-main">' + header + buildPage(self.options.start) + duration + '</div>';
      let close = '<div class="h5p-infobox-container h5p-infobox-close">' + header + buildPage(self.options.end.content) + back + '</div>';
      $container.append(main + close);

      // Adjust layout
      let adjust = $container.find('.h5p-infobox-main');
      let a;
      let b;
      if (start.display == 'fit') {
        adjust.addClass('infobox-fit');
        a = $container.find('.h5p-infobox-main .infobox-introtext').height();
        b = $container.find('.h5p-infobox-main .infobox-extensiontext').height();
        $container.find('.h5p-infobox-main .infobox-image-container').height(a + b);
      } else {
        adjust.addClass('infobox-scroll');
      }
      adjust = $container.find('.h5p-infobox-close');
      if (end.display == 'fit') {
        adjust.addClass('infobox-fit');
        a = $container.find('.h5p-infobox-close .infobox-introtext').height();
        b = $container.find('.h5p-infobox-close .infobox-extensiontext').height();
        $container.find('.h5p-infobox-close .infobox-image-container').height(a + b);
      } else {
        adjust.addClass('infobox-scroll');
      }

      // Don't show closing page
      $container.find('.h5p-infobox-close').css('display', 'none');
    };

    /**
     * @function buildPage
     * @description create dom elements for the page
     * @param {Object} content adress of the target page
     * 
    */
    let buildPage = function (content) {
      let introtext = content.introtext ? '<div class="infobox-text infobox-introtext">' + content.introtext + '</div>' : "";
      let image = content.image && content.image.path ? '<div class="infobox-image-container"><img class="infobox-image" src="' + H5P.getPath(content.image.path, self.id) + '"></div>' : '';
      let extensiontext = content.extensiontext ? '<div class="infobox-text infobox-extensiontext">' + content.extensiontext + '</div>' : '';
      //return 
      let outcome = '<div class="infobox-content">' + introtext + image + extensiontext + '</div>';
      return outcome;
    };

    /**
     * @function checkTime
     * @param {number} progress
     * @description improve timer
     * 
     */
     let checkTime = function(progress) {
      var time = 0;
      var interval = setInterval (function(){
        time ++;
        if (time == progress) {
          clearInterval(interval);
          finishActivity();
          return;
        }
      }, 1000);
    };

    /**
     * @function finishActivity
     * @description finishing activity by triggering xAPI
     * 
    */
    let finishActivity = function () {
      if (feedback == 'enabled') {
        $container.find('.infobox-icon').css('opacity', '1');
        $container.find('.infobox-durationstatus').addClass('infobox-btn');
        let btn = $container.find('.infobox-durationstatus.infobox-btn');
        btn.click(() => {
          showFeedback();
        });
      } else {
        fireXapi();
        return;
      }
      if (settings.trigger !== 'manual') {
        showFeedback();
      } 
    };

    /**
     * @function showFeedback
     * @description show closing page
     * 
    */
    let showFeedback = function() {
      $container.find('.h5p-infobox-main').css('display', 'none');
      $container.find('.h5p-infobox-close').css('display', 'flex');
      fireXapi();
      if (settings.return) {
        let btn = $container.find('.infobox-backcontainer.infobox-btn');
        btn.click(() => {
          showMain();
        });
      }
    };

    /**
     * @function showMain
     * @description show main page
     * 
    */
    let showMain = function() {
      $container.find('.infobox-durationstatus.infobox-btn').css('animation', 'none');
      $container.find('.infobox-durationstatus.infobox-btn').css('width', '100%');
      $container.find('.h5p-infobox-main').css('display', 'flex');
      $container.find('.h5p-infobox-close').css('display', 'none');
    };

    /**
     * @function fireXapi
     * @description triggering xAPI
     * 
    */
    let fireXapi = function () {
      if (!finished) {
        let xAPIEvent = self.createXAPIEventTemplate('completed');
        if ( self.options.progress.grade) {
          self.triggerXAPICompleted(1, 1, true, true);
        } else {
          self.triggerXAPICompleted(0, 0, false);
        }
        finished = true;
      }
    };

    /**
     * @function tuneRatios
     * @description Tune aspect ratios
     * 
    */
    let tuneRatios = function() {
      // let h = (window.innerHeight * 0.5) + 'px';
      // $('.infobox-image').css('max-height', h);
      // Tuning is actually not needed
    };

    /**
     * @event
     * @fires onresize
     * @description tune aspect ratios when window was resized
     * 
    */
     window.onresize = (event) => {
      tuneRatios();
    };

    /**
     * @function
     * @description main function going on after promise
     * 
    */
    (function() {
      prepareContent();
      //$container.find('.h5p-infobox-container').css('visibility', 'hidden');
      //setTimeout(function() {
        checkTime (progress);
        tuneRatios();
        //$container.find('.h5p-infobox-close').css('display', 'none');
        $container.find('.h5p-infobox-container').css('visibility', 'visible');
      //},300);
    })();

  };
  return Constructor;
})(H5P.jQuery);