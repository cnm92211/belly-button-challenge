// Use the D3 library to read in `samples.json`.
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((importedData) => {
  let data = importedData;

  // Populate dropdown with ids
  let idSelect = d3.select("#selDataset");
  data.names.forEach((name) => {
    idSelect.append("option").text(name);
  });

  // Initialize with data from the first ID
  buildCharts(data.names[0]);
  buildMetadata(data.names[0]);
});

function optionChanged(newId) {
  // Fetch new data each time a new sample is selected
  buildCharts(newId);
  buildMetadata(newId);
}

function buildCharts(sampleId) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let samples = data.samples.filter(sample => sample.id === sampleId)[0];
    let otuIds = samples.otu_ids;
    let otuLabels = samples.otu_labels;
    let sampleValues = samples.sample_values;

    // Bar chart
    let barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    Plotly.newPlot("bar", barData);

    // Bubble chart
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    }];

    Plotly.newPlot("bubble", bubbleData);

    // Gauge chart
    let metadata = data.metadata.filter(meta => meta.id == sampleId)[0];
    let washFreq = metadata.wfreq;

    // Calculate the degrees for the dial pointer based on the washing frequency
    let degrees = 180 - (washFreq * 20), // Adjust the multiplier based on the data range
    radius = 0.6;
let radians = degrees * Math.PI / 180;
let x = radius * Math.cos(radians);
let y = radius * Math.sin(radians);

// Set up the path for the dial pointer
let mainPath = 'M -.0 -0.035 L .0 0.035 L ',
    cX = String(x),
    cY = String(y),
    pathEnd = ' Z';
let path = mainPath + cX + " " + cY + pathEnd;

// Set up the layout for the gauge chart
let gaugeLayout = {
    shapes: [{
        type: 'path',
        path: path,
        fillcolor: 'red',
        line: {
            color: 'red'
        }
    }],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
    xaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] },
    yaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] }
};

// Set up the data for the gauge chart
let gaugeData = [{
    type: 'scatter',
    x: [0],
    y: [0],
    marker: { size: 12, color: 'red' },
    showlegend: false,
    name: 'Freq',
    text: washFreq,
    hoverinfo: 'text+name'
},
{
    values: [50 / 6, 50 / 6, 50 / 6, 50 / 6, 50 / 6, 50 / 6, 50],
    rotation: 90,
    text: ['8-9', '6-7', '4-5', '2-3', '1-2', '0-1', ''], // Adjust the text to match the range of the data
    textinfo: 'text',
    textposition: 'inside',
    marker: {
        colors: ['rgba(0, 105, 11, .5)', 'rgba(10, 120, 22, .5)',
            'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
            'rgba(255, 255, 255, 0)']
    },
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
    hoverinfo: 'label',
    hole: 0.5,
    type: 'pie',
    showlegend: false
}]; // end of gaugeData

// Call Plotly to plot the gauge chart on the page
Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}

function buildMetadata(sampleId) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let metadata = data.metadata.filter(meta => meta.id == sampleId)[0];
    let metaDiv = d3.select("#sample-metadata");

    // Clear any existing metadata
    metaDiv.html("");

    // Populate the metadata
    Object.entries(metadata).forEach(([key, value]) => {
      metaDiv.append("p").text(`${key}: ${value}`);
    });
  });
}