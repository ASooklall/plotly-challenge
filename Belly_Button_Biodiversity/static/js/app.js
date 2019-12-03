function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
  // var selID = d3.select("#selDataset").node.text()
  // console.log(selID)

  var url = "/metadata/940";
  d3.json(url).then(data =>{
    // console.log(sample)

    // Use d3 to select the panel with id of `#sample-metadata`

    var select = d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
    select.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (let [key, value] of Object.entries(data)){
      console.log(`${key}:${value}`)
      select.append("p").html(`${key}: ${value}`).style('font-weight','600')
    };
    // console.log(sample)
 
  




    // BONUS: Build the Gauge Chart
    function buildGauge (value) {
      var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: value,
          title: { text: "Washing Frequency" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            bar: { color: "darkblue" },
            axis: { range: [0, 9] },
            steps: [
              { range: [0, 3], color: "red" },
              { range: [3, 6], color: "yellow" },
              { range: [6, 9], color: "green" }
            ]}
        }
      ];
      
      var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', data, layout);
    };
    buildGauge(data.WFREQ)



 });
};

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/940"
  d3.json(url).then(function(sample) {
    // console.log(sample)

    var otuID = sample.otu_ids;
    var sampleVal = sample.sample_values;
    var otuLabel = sample.otu_labels;
    // console.log(otuID)
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otuID,
      y: sampleVal,
      mode: 'markers',
      marker: {
        size: sampleVal,
        color: otuID
      },
      hovertext: otuLabel
    };
    
    var data = [trace1];
    
    var layout = {
      showlegend: false,
      height: 400,
      width: 800
    };
    
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,

    top_val = sampleVal.sort((first, second) => second.first).slice(0,10);
    top_id = otuID
    top_label = otuLabel

    var data = [{
      values: top_val,
      labels: top_id,
      type: 'pie',
      hovertext:top_label
    }];
    
    var layout = {
      // title: 'Pie Chart',
      // height: 1000,
      // width: 1000
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
