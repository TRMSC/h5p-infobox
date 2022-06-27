var H5P = H5P || {};
 
H5P.Infobox = (function ($) {

  var MAX_SCORE = 1;
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
    $container.append('<div class="infobox-durationcontainer"><div class="infobox-durationstatus" style="animation: progress linear ' + progress + 's"></div></div>');
    
    /*
    var Button = Object.freeze ({
      CHECK: 'check-answer'
    });
    self.addButton(Button.CHECK, function() {alert('Hallo')});
    
    var $scoreBar = H5P.JoubelUI.createScoreBar(10, 'This is a scorebar');
    var $button = H5P.JoubelUI.createButton({
      title: 'Retry',
      click: function (event) {
        console.log('Retry was clicked');
      }
    });

    self.addButton(Button.CHECK, params.l10n.checkAnswer, function () {
      alert("check!");
    }, true, {
      'aria-label': params.l10n.a11yCheck
    }, {
      confirmationDialog: {
        enable: params.behaviour.confirmCheckDialog,
        l10n: params.confirmCheck,
        instance: self,
        $parentElement: $container
      },
      contentData: self.contentData,
      textIfSubmitting: params.l10n.submitAnswer,
    });
    */

  };

  return Constructor;
})(H5P.jQuery);