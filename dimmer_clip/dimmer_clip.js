const defaultParams = {
  topLength: 100,
  bottomLength: 90,
  topWidth: 30,
  bodyHeight: 20,
  topHeight: 5,
  filletRadius: 2,
  cordHeight: 3,
  cordWidth: 6,
  cordLength: 30,
  cordBottomOffset: 2,
  baseOffsetX: 10,
  baseOffsetY: 5,
  baseFillet: 5,
  baseHeight: 20,
  baseThickness: 2,
  holeDiameter: 4,
  countersinkDiameter: 8,
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
    baseOffsetX,
    baseOffsetY,
    baseFillet,
    baseHeight,
    baseThickness,
    holeDiameter,
    countersinkDiameter,
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

  // Create base rectangle on XY-plane, with padding extending beyond top sketch
  const baseWidth = topWidth + 2 * baseOffsetX;
  const baseLength = topLength + 2 * baseOffsetY;

  let baseSketch = draw()
    .lineTo([baseWidth, 0])
    .lineTo([baseWidth, baseLength])
    .lineTo([0, baseLength])
    .close()
    .fillet(baseFillet)
    .translate([-baseOffsetX, -baseOffsetY])
    .sketchOnPlane("XY");

  let base = baseSketch.extrude(baseHeight).translate([0, 0, -baseThickness]);

  const xCenter = topWidth / 2;
  const yCenter = baseLength / 2;

  const holeXOffset = topWidth / 2 + baseOffsetX / 2;

  let rightHole = drawCircle(holeDiameter / 2)
    .translate([xCenter, yCenter])
    .translate([holeXOffset])
    .sketchOnPlane("XY", -baseThickness * 1.5)
    .extrude(baseHeight * 1.5);

  let leftHole = rightHole.clone().translate([-(holeXOffset * 2), 0, 0]);

  // let mirroredHole = singleHole.mirror([1, 0, 0], [0, holeYCenter, 0], "plane");

  // let holes = singleHole.fuse(mirroredHole);

  base = base.cut(rightHole);
  base = base.cut(leftHole);

  // Create countersink holes at same positions, starting from base height and extruding down 3mm
  let rightCountersink = drawCircle(countersinkDiameter / 2)
    .translate([xCenter, yCenter])
    .translate([holeXOffset])
    .sketchOnPlane("XY", baseHeight - baseThickness)
    .extrude(-3);

  let leftCountersink = drawCircle(countersinkDiameter / 2)
    .translate([xCenter, yCenter])
    .translate([-holeXOffset])
    .sketchOnPlane("XY", baseHeight - baseThickness)
    .extrude(-3);

  base = base.cut(rightCountersink);
  base = base.cut(leftCountersink);

  const components = [base, dimmer, cordStub];

  return components;
}

globalThis.main = main;
