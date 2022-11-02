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

  Constructor.prototype = Object.create(H5P.EventDispatcher.prototype); //CORRECT?
  Constructor.prototype.constructor = Constructor; //CORRECT?
 
  /**
   * @function
   * @param {jQuery} $container
   * @description attach function called by H5P framework to insert H5P content into page
   */
  Constructor.prototype.attach = function ($container) {
    var self = this;
    let finished = false;
    let settings = self.options.end.settings;
    let feedback = self.options.end.feedback;

    /**
     * @function buildPage
     * @description create elements for the page
     * @param {Object} content adress of the target page
     * 
    */
     let buildPage = function (content) {
      let introtext = content.introtext ? '<div class="infobox-text">' + content.introtext + '</div>' : "";
      let image = content.image && content.image.path ? '<div class="infobox-image-container"><img class="infobox-image" src="' + H5P.getPath(content.image.path, self.id) + '"></div>' : '';
      let extentiontext = content.extensiontext ? '<div class="infobox-text">' + content.extensiontext + '</div>' : '';
      return introtext + image + extentiontext;
    };

    /**
     * @function tuneRatios
     * @description Tune aspect ratios
     * 
    */
      let tuneRatios = function() {
        /*
        let h = (window.innerHeight * 0.5) + 'px';
        $('.infobox-image').css('max-height', h);
        */
      }

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
      $container.find('.h5p-infobox-close').css('display', 'block');
      fireXapi();
      let btn = $container.find('.infobox-backcontainer.infobox-btn');
      btn.click(() => {
        showMain();
      });
    };

    /**
     * @function showMain
     * @description show main page
     * 
    */
     let showMain = function() {
      $container.find('.infobox-durationstatus.infobox-btn').css('animation', 'none');
      $container.find('.infobox-durationstatus.infobox-btn').css('width', '100%');
      $container.find('.h5p-infobox-main').css('display', 'block');
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
     * @event
     * @fires onresize
     * @description tune aspect ratios when window was resized
     * 
    */
    window.onresize = (event) => {
      tuneRatios();
    };

    /**
     * @function anonymous
     * @description create dom elements
     * 
    */
    (function() {
      $container.addClass("h5p-infobox");
      let progress = self.options.progress.duration;

      // Build framework
      let header = self.options.header ? '<div class="infobox-header">' + self.options.header + '</div>' : '';
      let duration = '<div class="infobox-durationcontainer"><div class="infobox-durationstatus" style="animation: progress linear ' + progress + 's"><i class="fa fa-chevron-right infobox-icon"></i></div></div>';
      let back = (self.options.end.settings.return == 'allowed') ? '<div class="infobox-backcontainer infobox-back infobox-btn"><i class="fa fa-chevron-left infobox-icon"></i></div>' : '';
      let main = '<div class="h5p-infobox-container h5p-infobox-main">' + header + buildPage(self.options.start) + duration + '</div>';
      let close = '<div class="h5p-infobox-container h5p-infobox-close">' + header + buildPage(self.options.end.content) + back + '</div>';
      $container.append(main + close);

      checkTime (progress);
      tuneRatios();

    })();

  };
  return Constructor;
})(H5P.jQuery, H5P.EventDispatcher);