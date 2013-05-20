var courses;
window.onload = function() { init(); };
var public_spreadsheet_url = "https://docs.google.com/spreadsheet/pub?key=0ApL2ZVhpOmONdFdrY3QzNkx3eWU5Z2F3cmJLUUJEQ1E&output=html";

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
      $("#list").append("<div class=\"box isotope-item " + courses[i].csa + " " + courses[i].biz + " " + courses[i].type + "\"" + " title=\"" + courses[i].description + "\">" +
        "<div class= \"type " + courses[i].type + "\">" + courses[i].type + "</div>" +
        "<div class = \"level " + courses[i].level + "\">" + courses[i].level + "</div>" +
        "<div class='abbreviation'> <p>" + courses[i].abbreviation + "</p> </div>" +
        "<div class='name'> <a href='" + courses[i].url + "' target=?blank>" + courses[i].name + "</a> </div>" +
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
  $('.box').tooltipster();

  var $container = $('#list'),
  filters = {};

  //this is the sorts section ///////////////////////////////////////////////////////////////////////////
  $container.isotope({
    itemSelector : '.box',
    getSortData : {
      name : function ( $elem ) {
        return $elem.find('.name').text();
      },
      level : function($elem){
        return parseInt($elem.find('.level').text(), 10);
      }
    }
  });

  var $optionSets = $('#sort_by .option-set'),
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
  $('.visible').removeClass('visible');
  $(this).children('.description').addClass('visible');
}

$(function() {
  $( "#accordion" ).accordion({
    heightStyle: "content"
  });
});

$('.option-combo.color h3').click(function () {
  if ($("#course_type_slide").is(":hidden")) {
    $("#course_type_slide").slideDown("slow");
    $(".option-combo.color h3 span").text("▼");
  }
  else {
    $("#course_type_slide").slideUp();
    $(".option-combo.color h3 span").text("▲");
  }
});

$('.option-combo.size h3').click(function () {
  if ($("#biz_model_slide").is(":hidden")) {
    $("#biz_model_slide").slideDown("slow");
    $(".option-combo.size h3 span").text("▼");
  }
  else {
    $("#biz_model_slide").slideUp();
    $(".option-combo.size h3 span").text("▲");
  }
});

$('#sort_by h3').click(function () {
  if ($("#sort_model_slide").is(":hidden")) {
    $("#sort_model_slide").slideDown("slow");
    $("#sort_by h3 span").text("▼");
  }
  else {
    $("#sort_model_slide").slideUp();
    $("#sort_by h3 span").text("▲");
  }
});
