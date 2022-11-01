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
   * @function
   * @param {jQuery} $container
   * @description attach function called by H5P framework to insert H5P content into page
   */
  Constructor.prototype.attach = function ($container) {
    var self = this;

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
      let xAPIEvent = self.createXAPIEventTemplate('completed');
      if ( self.options.progress.grade) {
        self.triggerXAPICompleted(1, 1, true, true);
      } else {
        self.triggerXAPICompleted(0, 0, false);
      }
    };

    /**
     * @function tuneRatios
     * @description Tune aspect ratios
     * 
    */
      let tuneRatios = function() {
        let h = (window.innerHeight * 0.5) + 'px';
        $('.infobox-image').css('max-height', h);
      }

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

      // Build framework
      let header = self.options.start.header ? '<div class="infobox-header">' + self.options.start.header + '</div>' : '';
      let introtext = self.options.start.introtext ? '<div class="infobox-text">' + self.options.start.introtext + '</div>' : "";
      let image = self.options.start.image && self.options.start.image.path ? '<div class="infobox-image-container"><img class="infobox-image" src="' + H5P.getPath(self.options.start.image.path, self.id) + '"></div>' : '';
      let extentiontext = self.options.start.extensiontext ? '<div class="infobox-text">' + self.options.start.extensiontext + '</div>' : '';

      // Add duration elements
      let progress = self.options.progress.duration;
      checkTime (progress);
      let duration = '<div class="infobox-durationcontainer"><div class="infobox-durationstatus" style="animation: progress linear ' + progress + 's"></div></div>';

      // Append all elements
      let main = '<div class="h5p-infobox-container">' + header + introtext + image + extentiontext + duration + '</div>';
      $container.append(main);

      tuneRatios();

    })();

  };
  return Constructor;
})(H5P.jQuery);