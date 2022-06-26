var H5P = H5P || {};
 
H5P.Infobox = (function ($) {

  var MAX_SCORE = 1;
  console.log ("MAX_SCORE is " + MAX_SCORE);

  /**
   * Constructor function.
   */
  function constructor(options, id) {
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
  constructor.prototype.attach = function ($container) {

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
    $container.append('<div id="infobox-durationcontainer"></div>');
    var durationstatus = document.createElement('div');
    var durationcontainer = document.getElementById('infobox-durationcontainer');
    durationcontainer.appendChild(durationstatus);
    durationstatus.setAttribute("id", "infobox-durationstatus");
    var progress = this.options.duration;
    durationstatus.style.animation = "progress linear " + progress + "s";

  };
 
  return constructor;
})(H5P.jQuery);