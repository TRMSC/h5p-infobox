var H5P = H5P || {};
 
H5P.Infobox = (function ($) {

  var MAX_SCORE = 2;
  console.log ("MAX_SCORE is " + MAX_SCORE);

  /**
   * Constructor function.
   */
  function Constructor(options, id) {
    this.options = $.extend(true, {}, {
      content: null,
      image: null
    }, options);
    this.id = id;

    if (this.options.task) {
      // Initialize task
      this.task = H5P.newRunnable(this.options.task, this.id);
     
      // Trigger resize events on the task:
      this.on('resize', function (event) {
        this.task.trigger('resize', event);
      });
    }

  };
 
  /**
   * Attach function called by H5P framework to insert H5P content into page
   *
   * @param {jQuery} $container
   */
  Constructor.prototype.attach = function ($container) {

    // Build framework
    $container.addClass("h5p-infobox");
    if (this.options.header) {
      $container.append('<div class="infobox-header">' + this.options.header + '</div>');
    }
    if (this.options.introtext) {
      $container.append('<div class="infobox-text">' + this.options.introtext + '</div>');
    }
    if (this.options.image && this.options.image.path) {
      $container.append('<img class="infobox-image" src="' + H5P.getPath(this.options.image.path, this.id) + '">');
    }
    if (this.options.extensiontext) {
      $container.append('<div class="infobox-text">' + this.options.extensiontext + '</div>');
    }

    // Add duration elements
    var progress = this.options.duration;
    checkTime (progress);
    $container.append('<div class="infobox-durationcontainer"><div class="infobox-durationstatus" style="animation: progress linear ' + progress + 's"></div></div>');

  };

  /**
   * Improve timer
   *
   */
  function checkTime (progress) {
    var time = 0;
    var interval = setInterval( function(){
        time ++;
        console.log (time);
        if (time == progress) {
          clearInterval(interval);
          console.log ('check'); 
          return;}
    }, 1000);
  }

  return Constructor;
})(H5P.jQuery);