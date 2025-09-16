const defaultParams = {
  topLength: 100,
  bottomLength: 90,
  topWidth: 30,
  bodyHeight: 20,
  topHeight: 5,
  filletRadius: 2,
  cordHeight: 3,
  cordWidth: 6,
  cordLength: 15,
  cordBottomOffset: 2,
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
  {
    topLength,
    topWidth,
    bottomLength,
    bodyHeight,
    topHeight,
    filletRadius,
    cordHeight,
    cordWidth,
    cordLength,
    cordBottomOffset,
  }
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
    .sketchOnPlane("XY", -bodyHeight);

  // let bottomSketch = sketchRectangle(bottomWidth, d.bottomLength, "XY");
  // let bottomSketch = drawFaceOutline((f) => f.inPlane("XY", 0));

  let bottom = topSketch.loftWith(bottomSketch);

  // Create cord stub on XZ plane
  let cordStub = draw()
    .lineTo([cordWidth, 0])
    .lineTo([cordWidth, cordHeight])
    .lineTo([0, cordHeight])
    .close()
    .fillet(cordHeight / 2 - 0.01)
    .sketchOnPlane("XZ")
    .extrude(cordLength)
    .translate([topWidth / 2 - cordWidth / 2, 10, cordBottomOffset]);

  let dimmer = bottom
    .fuse(top)
    // .fuse(cordStub)
    .fillet(filletRadius)
    .translate([0, 0, bodyHeight]);
  // console.log("bottom", bottom);

  // bottom = drawCircle(defaultParams.bottomRadius).sketchOnPlane("XY").extrude(defaultParams.height);

  const components = [cordStub, dimmer];

  return components;
}

globalThis.main = main;
