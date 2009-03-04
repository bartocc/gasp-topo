$(document).ready(function() {
  controller.init();
});

var steps_alti_ary = [];

function loadCallback() {
  var gdir = this;
  var route = gdir.getRoute(0);
  var num_steps = route.getNumSteps();
  
  for (i=0 ; i < num_steps ; i++) {
    var step = route.getStep(i);
    steps_alti_ary[i] = [step, null];
    var coords = step.getLatLng();
    topoGetAltitude(coords.lat(), coords.lng(), topocodeCallback, step);
  }

}

function topocodeCallback(altitude, step) {
  
  $(steps_alti_ary).each(function(i) {
    if (steps_alti_ary[i][0] == step)
      steps_alti_ary[i][1] = altitude;
  });

  if (topocodeFinished()) {
    displayValues();
    $("#spinner").hide();
  }
}

// did we topocode all the steps ?
// returns a boolean
function topocodeFinished() {
  var finished = true;
  $(steps_alti_ary).each(function(i) {
    finished = (finished && (steps_alti_ary[i][1] != null));
  });
  
  return finished;
}

function displayValues() {
  var total_distance = 0;
  var lines;
  
  $(steps_alti_ary).each(function(i) {
    var sa = steps_alti_ary[i];
    var step = sa[0];
    var alti = sa[1];
    var duration = step.getDuration().seconds;
    total_distance += step.getDistance().meters;
    
    lines += "<tr><td>" + total_distance + "</td><td>" + alti + "</td><td>" + duration+ "</td></tr>";
  });
  
  $('#values').append(lines).show('blind');
  
}

var controller = {
  
  init: function() {
    var toulouse = new GLatLng(43.604184,1.442943);
    this.map = new GMap2($('#map')[0]);
    this.map.setCenter(toulouse, 13);
    this.steps_alti = [];

    // initialize the GDirections object
    this.gdir = new GDirections(this.map);
    GEvent.addListener(this.gdir, "load", loadCallback);
  },
  
  topocode: function() {
  
    $("#values").hide();
    $("#spinner").show();
  
    // flush former values
    $('#values').html('<tr><th>distance (m)</th><th>altitude (m)</th><th>durée (sec)</th></tr>');
    this.gdir.clear();
    this.steps_alti = [];
    // 
    var request = "from: " + $('#from').val() + " to: " + $('#to').val();
    this.gdir.load(request, {'getSteps': true});
  }
  
}