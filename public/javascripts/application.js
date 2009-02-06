document.observe("dom:loaded", function() {
  controller.init();
  // controller.topocode();
});

var controller = {
  
  init: function() {
    var toulouse = new GLatLng(43.604184,1.442943);
    this.map = new GMap2($('map'));
    this.map.setCenter(toulouse, 13);
    this.steps_alti = [];
    
    // initialize the GDirections object
    this.gdir = new GDirections(this.map);
    GEvent.addListener(this.gdir, "load", controller.loadCallback.bind(controller));
  },
  
  topocode: function() {

    // flush former values
    $('values').innerHTML = '';
    this.gdir.clear();
    this.steps_alti = [];
    
    var request = "from: " + $F('from') + " to: " + $F('to');
    // var request = "from: toulouse to: grenoble";
    this.gdir.load(request, {'getSteps': true});
  },
  
  loadCallback: function() {
    var route = this.gdir.getRoute(0);
    var num_steps = route.getNumSteps();
    
    for (i=0 ; i < num_steps ; i++) {
      var step = route.getStep(i);
      this.steps_alti[i] = [step, null];
      var coords = step.getLatLng();
      topoGetAltitude(coords.lat(), coords.lng(), this.topocodeCallback.bind(this), step);
    }

  },
  
  // did we topocode all the steps ?
  // returns a boolean
  topocodeFinished: function() {
    return this.steps_alti.all(function(sa) {
      return sa[1] != null;
    });
  },
  
  topocodeCallback: function(altitude, step) {
    var step_alti = this.steps_alti.find(function(sa) {
      return sa[0] == step
    });
    step_alti[1] = altitude;
    
    if (this.topocodeFinished())
      this.displayValues();
  },
  
  displayValues: function() {
    var total_distance = 0;
    
    this.steps_alti.each(function(sa) {
      var step = sa[0];
      var alti = sa[1];
      total_distance += step.getDistance().meters;
      
      $('values').innerHTML += (total_distance + ' ; ' + alti + '<br />');
    });
    
  }
  
}