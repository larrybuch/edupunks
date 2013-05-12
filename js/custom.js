var courses;
var public_spreadsheet_url = "https://docs.google.com/spreadsheet/pub?key=0ApL2ZVhpOmONdFdrY3QzNkx3eWU5Z2F3cmJLUUJEQ1E&output=html";

$(function(){
  init();
  /* 
  below was the only code in custom.js, but wasn't being called in the 
  DOM, so commented out here incase its unwanted.
  
  var $container = $('.portfolio');

  $container.isotope({
    filter: '*',
    animationOptions: {
      duration: 750,
      easing: 'linear',
      queue: false
    }
  });

  $('nav.primary ul a').click(function(){
    var selector = $(this).attr('data-filter');
    $container.isotope({
      filter: selector,
      animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
      }
    });
    return false;
  });
  */

});

function init() {
  Tabletop.init({
    key: public_spreadsheet_url,
    callback: showInfo,
    simpleSheet: true
  });
}

function showInfo(data, tabletop) {
  for (var i = 0; i < data.length; i++) {
      courses = data;
      $("#list").append("<div class=\"box isotope-item " + courses[i].csa + " " + courses[i].biz + " " + courses[i].type + "\">" +
        "<div class= \"type " + courses[i].type + "\">" + courses[i].type + "</div>" +
        "<div class = \"level " + courses[i].level + "\">" + courses[i].level + "</div>" +
        "<div class='name'> <a href='" + courses[i].url + "' target=?blank>" + courses[i].name + "</a> </div>" +
        "<div class='description hidden'> <p>" + courses[i].description + "</p> </div>" +
        "<div class=\"threes\">" + courses[i].csa + "</div>" +
        "<div class=\"hidden" + courses[i].risk + "</div>" +
        "</div>"
      );
  }

  /* 
  on mousover, show the description. the function is listed here
  because the isotope boxes need to be present on the page already
  to have the mouseover event bounded to them. could be a better way 
  to do this
  */
  $('.box').mouseover(showDesc);

  var $container = $('#list');
  filters = {};

  //this is the sorts section ///////////////////////////////////////////////////////////////////////////
  $container.isotope({
    itemSelector : '.box',
    getSortData : {
      name : function($elem){
        return $elem.find('.name').text();
      }
      // ,
      // level : function ( $elem ) {
      //   return parseInt( $elem.find('.level').text(), 10 );
      // },
    }
  });

  var $optionSets = $('#sort_by .option-set');
  $optionLinks = $optionSets.find('a');

  $optionLinks.click(function(){
    var $this = $(this);
    // don't proceed if already selected
    if ( $this.hasClass('selected') ) {
      return false;
    }
    var $optionSet = $this.parents('.option-set');
    $optionSet.find('.selected').removeClass('selected');
    $this.addClass('selected');

    // make option object dynamically, i.e. { filter: '.my-filter-class' }
    var options = {},
        key = $optionSet.attr('data-option-key'),
        value = $this.attr('data-option-value');
    // parse 'false' as false boolean
    value = value === 'false' ? false : value;
    options[ key ] = value;
    if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
      // changes in layout modes need extra logic
      changeLayoutMode( $this, options );
    } else {
      // otherwise, apply new options
      $container.isotope( options );
    }

    return false;
  });

  // filter buttons
  $('.filter a').click(function(){
    var $this = $(this);
    // don't proceed if already selected
    if ( $this.hasClass('selected') ) {
      return;
    }

    var $optionSet = $this.parents('#filter_by .option-set');
    // change selected class
    $optionSet.find('.selected').removeClass('selected');
    $this.addClass('selected');

    // store filter value in object
    // i.e. filters.color = 'red'
    var group = $optionSet.attr('data-filter-group');
    filters[ group ] = $this.attr('data-filter-value');
    // convert object into array
    var isoFilters = [];
    for ( var prop in filters ) {
      isoFilters.push( filters[ prop ] );
    }
    var selector = isoFilters.join('');
    $container.isotope({ filter: selector });

    return false;
  });

} // end of showInfo

function showDesc(){
  $('.visible').removeClass('visible').addClass('hidden');
  $(this).children('.description').removeClass('hidden').addClass('visible');
}