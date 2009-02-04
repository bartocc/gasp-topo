// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var gdir = null;

document.observe("dom:loaded", function() {
  // set the map
  var map = new GMap2($('map'));
  map.setCenter(new GLatLng(44.013655, 1.278026), 13);
  
  topoGetAltitude(46, 1, foo, 'bar');
  
});

function foo(altitude, context) {
  alert(context); // => undefined
}

var controller = {
  
  topocode: function() {
    gdir= new GDirections(map);
    GEvent.addListener(gdir, "load", controller.loadCallback.bind(controller));
    $('values').innerHTML = '';
    gdir.load("from: " + $F('from') + " to: " + $F('to'), {'getSteps': true});
  },
  
  loadCallback: function() {
    var route = gdir.getRoute(0);
    var num_steps = route.getNumSteps();
    
    for (i=0 ; i < num_steps ; i++) {
      var step = route.getStep(i);
      var coords = step.getLatLng();
      topoGetAltitude(coords.lat(), coords.lng(), this.topocodeCallback.bind(this), step);
    }
    
  },
  
  topocodeCallback: function(altitude, context) {
    var step = context;
    $('values').innerHTML += (step.getDistance().meters + 'm ; ' + altitude + 'm<br />');
  }
  
}