"use-strict";
var H5P = H5P || {};
 
H5P.Infobox = (function ($) {

  var MAX_SCORE = 2;

  /**
   * Constructor function.
   */
  function Constructor(options, id, params, behaviour) {
    this.options = $.extend(true, {}, {
      content: null,
      image: null
    }, options);
    this.id = id;
  };
 
  /**
   * Attach function called by H5P framework to insert H5P content into page
   *
   * @param {jQuery} $container
   */
  Constructor.prototype.attach = function ($container) {
    var self = this;

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
    
    // Add buttons
    var $buttons = $('<div/>', {
      'class': 'infobox-buttons'
    }).appendTo($container);
    //}).hide()
    //  .appendTo($container);
    $buttons.append('<button class="h5p-question-check-answer h5p-joubelui-button">' + this.options.check + '</div>');
        
    /**
     * Get xAPI data.
     *
     * @return {object} XAPI statement.
     * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
     */
     this.getXAPIData = () => ({
      statement: this.getXAPIAnswerEvent().data.statement
    });

    /**
     * Build xAPI answer event.
     *
     * @return {H5P.XAPIEvent} XAPI answer event.
     */
    this.getXAPIAnswerEvent = () => {
      const xAPIEvent = this.createXAPIEvent('answered');
      xAPIEvent.setScoredResult(this.getScore(), this.getMaxScore(), this,
        true, this.isPassed());
    
      //xAPIEvent.data.statement.result.completion = true;
      //https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#245-result
    
      return xAPIEvent;
    };

    /**
     * Prepare and trigger xAPI
     * 
     */
    var finishActivity = function () {
      console.log ('trigger xapi event');
      var xAPIEvent = self.createXAPIEventTemplate('answered');
      xAPIEvent.setScoredResult(1, MAX_SCORE, self, true, 'success');
      self.triggerXAPI('answered');
      //self.triggerXAPIComplete(2, 2, 'success');
    };

    /**
     * Improve timer
     * 
     */
    function checkTime (progress) {
    //var checkTime = function (progress) {
      var time = 0;
      var interval = setInterval( function(){
        time ++;
        console.log (time);
        if (time == progress) {
          clearInterval(interval);
          finishActivity();
          return;}
      }, 1000);
    }


  };
  return Constructor;
})(H5P.jQuery);