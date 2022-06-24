var H5P = H5P || {};
 
H5P.SimplePage = (function ($) {
  /**
   * Constructor function.
   */
  function C(options, id) {
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      content: 'Hello world!',
      image: null
    }, options);
    // Keep provided id.
    this.id = id;
  };
 
  /**
   * Attach function called by H5P framework to insert H5P content into
   * page
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {
    $container.append('<div class="infobox-text">' + this.options.introtext + '</div>');
    // Set class on container to identify it as an infobox container. 
    $container.addClass("h5p-infobox");
    // Add image if provided.
    if (this.options.image && this.options.image.path) {
      $container.append('<img class="infobox-image" src="' + H5P.getPath(this.options.image.path, this.id) + '">');
    }
    // Add extension text.
    $container.append('<div class="infobox-text">' + this.options.extensiontext + '</div>');
  };
 
  return C;
})(H5P.jQuery);