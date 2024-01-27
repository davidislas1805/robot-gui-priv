const X_AXIS_LINE = {
  name: "x-axis",
  showlegend: false,
  mode: "lines",
  type: "scatter3d",
  hoverinfo: "none",
  x: [0.0, 4.0],
  y: [0.0, 0.0],
  z: [0.0, 0.0],
  line: {
    color: "red",
    width: 3
  }
};
  
const X_AXIS_CONE = {
  type: "cone",
  x: [4.0],
  y: [0.0],
  z: [0.0],
  u: [2],
  v: [0],
  w: [0],
  anchor: "tip",
  hoverinfo: "none",
  colorscale: [[0, "red"], [1, "red"]],
  showscale: false,
};
  
const Y_AXIS_LINE = {
  name: "y-axis",
  showlegend: false,
  mode: "lines",
  type: "scatter3d",
  hoverinfo: "none",
  x: [0.0, 0.0],
  y: [0.0, 4.0],
  z: [0.0, 0.0],
  line: {
    color: "green",
    width: 3
  }
};
  
const Y_AXIS_CONE = {
  type: "cone",
  x: [0.0],
  y: [4.0],
  z: [0.0],
  u: [0],
  v: [2],
  w: [0],
  anchor: "tip",
  hoverinfo: "none",
  colorscale: [[0, "green"], [1, "green"]],
  showscale: false,
};

const Z_AXIS_LINE = {
  name: "z-axis",
  showlegend: false,
  mode: "lines",
  type: "scatter3d",
  hoverinfo: "none",
  x: [0.0, 0.0],
  y: [0.0, 0.0],
  z: [0.0, 4],
  line: {
    color: "blue",
    width: 3
  }
};
  
const Z_AXIS_CONE = {
  type: "cone",
  x: [0.0],
  y: [0.0],
  z: [4],
  u: [0],
  v: [0],
  w: [2],
  anchor: "tip", // make cone tip be at endpoint
  hoverinfo: "none",
  colorscale: [[0, "blue"], [1, "blue"]], // color all cones blue
  showscale: false,
};

const WORLD_FRAME = [X_AXIS_LINE, X_AXIS_CONE, Y_AXIS_LINE, Y_AXIS_CONE, Z_AXIS_LINE, Z_AXIS_CONE];

const CAMERA = {
  eye: {
    x: 0.22242532437792786,
    y: 0.1216321754220013,
    z: 0.12246465935601678}, // y: 1.5, x: 0, z: 0
  center: {y: 0, x: 0, z: 0}, 
  up: {y: 0, x: 0, z: 1}
}

const SCENE = {
  xaxis: {
    nticks: 1,
    range: [-60, 60],
    zerolinecolor: "black",
    showbackground: false
  },
  yaxis: {
    nticks: 1,
    range: [-60, 60],
    zerolinecolor: "black",
    showbackground: false,
  },
  zaxis: {
    nticks: 1,
    range: [-60, 60],
    zerolinecolor: "black",
    showbackground: false,
  },
  aspectmode: "manual",
  aspectratio: { x: 1, y: 1, z: 1 },
  camera: CAMERA,
}

const LAYOUT = {
  title: "<b>3D VIEWER</b>",
  font: {
    family: 'Arial',
    size: 18,
    color: 'white'
  },
  scene: SCENE,
  paper_bgcolor: "#282828"//"rgb(23, 33, 43)"
}

const CONFIG = {
  displaylogo: false,
  displayModeBar: false,
  responsive: true,
}

const base_link_length = 5;
const link1_length = 10;
const link2_length = 5;
const link3_length = 0;
const link4_length = 0;
const link5_length = 2;

export {base_link_length,link1_length, link2_length, link3_length, link4_length, link5_length, WORLD_FRAME, LAYOUT, CONFIG}