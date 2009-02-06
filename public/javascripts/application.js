document.observe("dom:loaded", function() {
  controller.init();
});

var controller = {
  
  init: function() {
    var toulouse = new GLatLng(43.604184,1.442943);
    this.map = new GMap2($('map'));
    this.map.setCenter(toulouse, 13);
  },
  
  topocode: function() {
    this.gdir = new GDirections(this.map);
    GEvent.addListener(this.gdir, "load", controller.loadCallback.bind(controller));
    var request = "from: " + $F('from') + " to: " + $F('to');
    this.gdir.load(request, {'getSteps': true});
  },
  
  loadCallback: function() {
    var route = this.gdir.getRoute(0);
    var num_steps = route.getNumSteps();
    
    for (i=0 ; i < num_steps ; i++) {
      var step = route.getStep(i);
      var coords = step.getLatLng();
      topoGetAltitude(coords.lat(), coords.lng(), this.topocodeCallback.bind(this), step);
    }
    
  },
  
  topocodeCallback: function(altitude, step) {
    $('values').innerHTML += (step.getDistance().meters + '\t' + altitude + '<br />');
  }
  
}