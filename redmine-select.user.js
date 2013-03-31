// ==UserScript==
// @name           Redmine Single-click Setters RELOADED
// @namespace      http://wrathercreative.com
// @author         Matthew Wrather
// @description    Add links underneath issue dropdowns to select tracker, status or priority, category, version, or assign an issue to yourself. Substantially rewritten by Matthew Wrather in March, 2013. 
// @include   http://redmine.*
// @include   https://redmine.*
// @match   http://redmine.*
// @match   https://redmine.*
// ==/UserScript==


(function() {

var createSetters = function($) {

  // Loop through the various settings and create links for all the select box options.
  $(['tracker', 'status', 'priority', 'category', 'fixed_version']).each(function() {

    var attribute = this,
        $attributeSelect = $('#issue_'+attribute+'_id');

    $attributeSelect.after('<div class="shortcuts shortcuts_' + attribute + '"></div>');

    $attributeSelect.find('option').each(function() {
      var val  = $(this).val(),
          text = $(this).text();
      $('#issue_'+attribute+'_id + .shortcuts').append('<a href="#" data-cid="'+val+'">'+text+'</a> ');
    });

    $attributeSelect.find('.shortcuts a').click(function() {
      $('#issue_'+attribute+'_id').val( $(this).data('cid') );
      return false;
    });

  });

  // Single click to assign to "me"
  // Using a span instead of a div because there's just one link
  // TODO: Setting the CSS like this is kludgey.
  var me_id = $('#loggedas a').attr('href').match(/(\d+)\/?$/)[0];
  $('#issue_assigned_to_id').after('<span class="shortcuts"><a href="#" id="set_me">Me</a></span>');
  $('#set_me').css('padding-left', '.333em').click(function() {
    $('#issue_assigned_to_id').val(me_id);
    return false;
  });

  // style the links we've created
  $('.shortcuts').find('a').each(function(i, el) {
    var $el = $(el);

    if (!$el.text()) $el.text('[none]');

    $el.css({
      'padding-right': '1em',
      'font-size': '0.916666667em',
      'white-space': 'nowrap'
    });
  });

},
setupjQuery = function() {
    window.jQuery.noConflict();
    createSetters(window.jQuery);
};

// ----------------------------------------------------------------------
// jQuery
// ----------------------------------------------------------------------

if (typeof window.jQuery === "undefined") {
  var script = document.createElement('script');
  script.src = '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
  script.type = 'text/javascript';
  script.addEventListener("load", setupjQuery, false);
  document.getElementsByTagName('head')[0].appendChild(script);
} else {
  setupjQuery();
}

})();
