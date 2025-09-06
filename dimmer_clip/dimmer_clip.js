const defaultParams = {
  topLength: 100,
  topWidth: 30,
  bottomLength: 90,
  height: 20,
  topHeight: 5,
  filletRadius: 2,
};

/** @typedef { typeof import("replicad") } replicadLib */
/** @type {function(replicadLib, typeof defaultParams): any} */
function main(
  {
    draw,
    drawEllipse,
    drawCircle,
    makeSphere,
    FaceFinder,
    basicFaceExtrusion,
    sketchRectangle,
    drawFaceOutline,
  },
  { topLength, topWidth, bottomLength, height, topHeight, filletRadius }
) {
  const bottomDelta = topLength - bottomLength;
  const bottomWidth = topWidth - bottomDelta;
  let topSideSketch = draw()
    .sagittaArc(topWidth, 0, topHeight)
    .close()
    .sketchOnPlane("XZ");
  let top = topSideSketch.extrude(-topLength);

  let topSketch = draw()
    .lineTo([topWidth, 0])
    .lineTo([topWidth, topLength])
    .lineTo([0, topLength])
    .close()
    .sketchOnPlane("XY");

  let bottomSketch = draw()
    .lineTo([bottomWidth, 0])
    .lineTo([bottomWidth, bottomLength])
    .lineTo([0, bottomLength])
    .close()
    .translate([bottomDelta / 2, bottomDelta / 2])
    .sketchOnPlane("XY", -height);

  // let bottomSketch = sketchRectangle(bottomWidth, d.bottomLength, "XY");
  // let bottomSketch = drawFaceOutline((f) => f.inPlane("XY", 0));

  let bottom = topSketch.loftWith(bottomSketch);
  let dimmer = bottom.fuse(top).fillet(filletRadius).translate([0, 0, height]);
  // console.log("bottom", bottom);

  // bottom = drawCircle(defaultParams.bottomRadius).sketchOnPlane("XY").extrude(defaultParams.height);

  const components = [dimmer];

  return components;
}

globalThis.main = main;
