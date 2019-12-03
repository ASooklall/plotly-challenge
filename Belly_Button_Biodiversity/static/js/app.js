function buildMetadata(sample) {
  // var sampleID = d3.select("#selDataset").text()
  var url = "/samples/940";
  // var url = "/samples/" + sampleID
  d3.json(url).then(sample =>{
    console.log(sample)
    var select = d3.select("#sample-metadata")
    select
    .html("")
  
    console.log(sample)
    console.log("Test")
  });
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

////////////////////////////////////
// function buildPlot() {
//   /* data route */
// var url = "/samples/<sample>";
// d3.json(url).then(function(sample) {

//   console.log(sample);

//   var data = sample;

//   var layout = {
//     scope: "usa",
//     title: "Pet Pals",
//     showlegend: false,
//     height: 600,
//           // width: 980,
//     geo: {
//       scope: "usa",
//       projection: {
//         type: "albers usa"
//       },
//       showland: true,
//       landcolor: "rgb(217, 217, 217)",
//       subunitwidth: 1,
//       countrywidth: 1,
//       subunitcolor: "rgb(255,255,255)",
//       countrycolor: "rgb(255,255,255)"
//     }
//   };

//   Plotly.newPlot("pie", data, layout);
// });
// }

// buildPlot();
//////////////////////////////////////////////////////////////////

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/940"
  d3.json(url).then(function(sample) {
    console.log(sample)

    var otuID = sample.otu_ids;
    var sampleVal = sample.sample_values;
    var otuLabel = sample.otu_labels;
    console.log(otuID)
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otuID,
      y: sampleVal,
      mode: 'markers',
      marker: {
        size: sampleVal
      }
    };
    
    var data = [trace1];
    
    var layout = {
      // title: 'Bubble Chart',
      showlegend: false,
      height: 800,
      width: 1200
    };
    
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    top_val = sampleVal.slice(0,10)
    top_id = otuID.slice(0,10)
    var data = [{
      values: top_val,
      labels: top_id,
      type: 'pie'
    }];
    
    var layout = {
      // title: 'Pie Chart',
      height: 1000,
      width: 1000
    };
    
    Plotly.newPlot('pie', data, layout);
})
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
