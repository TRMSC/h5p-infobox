"use-strict";
var H5P = H5P || {};
 
H5P.Infobox = (function ($) {

  /**
   * @function Constructor
   */
  function Constructor(options, id) {
    //H5P.EventDispatcher.call(this); //CORRECT?
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
    $container.addClass("h5p-infobox");

    /**
     * Prepare the pages content trees
     * 
     * @function prepareContent
     * 
    */
    const prepareContent = function () {

      // Build framework
      let header = self.options.header ? '<div class="infobox-header">' + self.options.header + '</div>' : '';
      let duration = '<div class="infobox-durationcontainer"><div class="infobox-durationstatus" style="animation: progress linear ' + progress + 's"><i class="fa fa-chevron-right infobox-icon"></i></div></div>';
      let back = (self.options.end.settings.return == 'allowed') ? '<div class="infobox-backcontainer infobox-back infobox-btn"><i class="fa fa-chevron-left infobox-icon"></i></div>' : '';
      let main = '<div class="h5p-infobox-container h5p-infobox-main infobox-' + self.options.height + '">' + header + handleInput(self.options.start) + duration + '</div>';
      let close = '<div class="h5p-infobox-container h5p-infobox-close + infobox-' + self.options.height + '">' + header + handleInput(self.options.end.content) + back + '</div>';
      $container.append(main + close);

      // Adjust layout (CODECLEANING IS NECESSARY)
      let adjust = $container.find('.h5p-infobox-main');
      let a;
      let b;
      if (start.display == 'fit') {
        adjust.addClass('infobox-fit');
        let check1 = $container.find('.h5p-infobox-main .infobox-introtext');
        let h1 = check1.length > 0 ? check1.height() : 0;
        let check2 = $container.find('.h5p-infobox-main .infobox-extensiontext');
        let h2 = check2.length > 0 ? check2.height() : 0;
        $container.find('.h5p-infobox-main .infobox-image-container').height(self.options.height - h1 - h2);
      } else {
        adjust.addClass('infobox-scroll');
      }
      adjust = $container.find('.h5p-infobox-close');
      if (end.display == 'fit') {
        adjust.addClass('infobox-fit');
        let check3 = $container.find('.h5p-infobox-close .infobox-introtext');
        let h3 = check3.length > 0 ? check3.height() : 0;
        let check4 = $container.find('.h5p-infobox-close .infobox-extensiontext');
        let h4 = check4.length > 0 ? check4.height() : 0;
        $container.find('.h5p-infobox-close .infobox-image-container').height(self.options.height - h3 - h4);
      } else {
        adjust.addClass('infobox-scroll');
      }

      // Don't show closing page
      $container.find('.h5p-infobox-close').css('display', 'none');
    };

    /**
     * Handle input by building their dom elements
     * 
     * @function handleInput
     * @param {Object} content adress of the target page
     * 
    */
    const handleInput = function (content) {
      let introtext = content.introtext ? '<div class="infobox-text infobox-introtext">' + content.introtext + '</div>' : "";
      let image = content.image && content.image.path ? '<div class="infobox-image-container"><img class="infobox-image" src="' + H5P.getPath(content.image.path, self.id) + '"></div>' : '';
      let extensiontext = content.extensiontext ? '<div class="infobox-text infobox-extensiontext">' + content.extensiontext + '</div>' : '';
      return '<div class="infobox-content">' + introtext + image + extensiontext + '</div>';
    };

    /**
     * Check and handle the entered time
     * 
     * @function checkTime
     * @param {number} progress
     * 
     */
     const checkTime = function(progress) {
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
    const finishActivity = function () {
      if (feedback == 'enabled') {
        $container.find('.infobox-icon').css('opacity', '1');
        $container.find('.infobox-durationstatus').addClass('infobox-btn');
        let btn = $container.find('.infobox-durationstatus.infobox-btn');
        btn.click(() => {
          showClosing();
        });
      } else {
        fireXapi();
        return;
      }
      if (settings.trigger !== 'manual') {
        showClosing();
      } 
    };

    /**
     * Switch to the closing page and handle their actions
     * 
     * @function showClosing
     * 
    */
    const showClosing = function() {
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
     * Show main after switching from closing page
     * 
     * @function showMain
     * 
    */
    const showMain = function() {
      $container.find('.infobox-durationstatus.infobox-btn').css('animation', 'none');
      $container.find('.infobox-durationstatus.infobox-btn').css('width', '100%');
      $container.find('.h5p-infobox-main').css('display', 'flex');
      $container.find('.h5p-infobox-close').css('display', 'none');
    };

    /**
     * Triggering xAPI if it hasn't happened before
     * 
     * @function fireXapi
     * 
    */
    const fireXapi = function () {
      if (!finished) {
        if ( self.options.progress.grade) {
          self.triggerXAPICompleted(1, 1, true, true);
        } else {
          self.triggerXAPICompleted(0, 0, false);
        }
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
      prepareContent();
      checkTime (progress);
      $container.find('.h5p-infobox-container').css('visibility', 'visible');
    })();

  };
  return Constructor;
})(H5P.jQuery);