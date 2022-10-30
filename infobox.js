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
      self.triggerXAPICompleted(1, 1, true, true);
    };

    /**
     * @function tuneRatios
     * @description Tune aspect ratios
     * 
    */
      let tuneRatios = function() {
        let h = window.innerHeight;
        $('.infobox-image').css('max-height', 0.6*h);
      }

    /**
     * @event
     * @fires onresize
     * @description tune aspect ratios when window was resized
     * 
    */
      window.onresize = function() {
        tuneRatios();
      };

    /**
     * @function anonymous
     * @description create dom elements
     * 
    */
    (function() {
      // Build framework
      $container.addClass("h5p-infobox");

      let header = "";
      let introtext = "";
      let image = "";
      let extentiontext = "";

      if (self.options.header) {
        //$container.append('<div class="infobox-header">' + self.options.header + '</div>');
        header = '<div class="infobox-header">' + self.options.header + '</div>';
      }
      if (self.options.introtext) {
        //$container.append('<div class="infobox-text">' + self.options.introtext + '</div>');
        introtext = '<div class="infobox-text">' + self.options.introtext + '</div>';
      }
      if (self.options.image && self.options.image.path) {
        //$container.append('<div class="infobox-image-container"><img class="infobox-image" src="' + H5P.getPath(self.options.image.path, self.id) + '"></div>');
        image = '<div class="infobox-image-container"><img class="infobox-image" src="' + H5P.getPath(self.options.image.path, self.id) + '"></div>';
      }
      if (self.options.extensiontext) {
        //$container.append('<div class="infobox-text">' + self.options.extensiontext + '</div>');
        extentiontext = '<div class="infobox-text">' + self.options.extensiontext + '</div>';
      }
      let progress = self.options.duration;
      checkTime (progress);
      let duration = '<div class="infobox-durationcontainer"><div class="infobox-durationstatus" style="animation: progress linear ' + progress + 's"></div></div>';

      let main = '<div class="h5p-infobox-container">' + header + introtext + image + extentiontext + duration + '</div>';
      $container.append(main);


      // Add duration elements
      //let progress = self.options.duration;
      //checkTime (progress);
      //$container.append('<div class="infobox-durationcontainer"><div class="infobox-durationstatus" style="animation: progress linear ' + progress + 's"></div></div>');
      tuneRatios();

    })();

  };
  return Constructor;
})(H5P.jQuery);