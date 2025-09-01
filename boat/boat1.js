const defaultParams = {};

const HULL_LENGTH = 200;
const HULL_WIDTH = 30;
const WIDE_POINT = 0.66;

const HullCurve1 = {
  startPoint: [0, 0],
  startControlPoint: [HULL_LENGTH * 0.4, HULL_WIDTH * 0.2],
  endPoint: [HULL_LENGTH * WIDE_POINT, HULL_WIDTH * 0.5],
  endControlPoint: [HULL_LENGTH * 0.4, HULL_WIDTH * 0.5],
};

const HullCurve2 = {
  startPoint: [HULL_LENGTH * WIDE_POINT, HULL_WIDTH * 0.5],
  startControlPoint: [HULL_LENGTH * 0.8, HULL_WIDTH * 0.5],
  endPoint: [HULL_LENGTH, 0],
  endControlPoint: [HULL_LENGTH * 0.9, HULL_WIDTH * 0.1],
};

const HULL_HEIGHT = 15;

const FIN_LENGTH = 15;
const FIN_WIDTH = 4;
const FIN_HEIGHT = 30;

const FRONT_FIN_OFFSET = HULL_LENGTH * 0.25;
const BACK_FIN_OFFSET = HULL_LENGTH * 0.35;

const PROP_SCALE = 0.66;

const PROP_DIAMETER = 60 * PROP_SCALE;
const PROP_THICKNESS = 18 * PROP_SCALE;
const PROP_RADIUS = PROP_DIAMETER / 2;

const BORE_HEIGHT = FIN_HEIGHT * 0.8;

const BORE_DIAMETER = 3 * PROP_SCALE;
const BORE_RADIUS = BORE_DIAMETER / 2;

const SHAFT_DIAMETER = 10;
const SHAFT_RADIUS = SHAFT_DIAMETER / 2;

/** @typedef { typeof import("replicad") } replicadLib */
/** @type {function(replicadLib, typeof defaultParams): any} */
function main({ draw, drawEllipse, drawCircle }, {}) {
  // const hullPoints = [
  //   [-HULL_LENGTH * 0.5, 0],
  //   [-HULL_LENGTH * 0.3, HULL_WIDTH * 0.3],
  //   [-HULL_LENGTH * 0.1, HULL_WIDTH * 0.45],
  //   [HULL_LENGTH * WIDE_POINT - HULL_LENGTH * 0.5, HULL_WIDTH * 0.5],
  //   [HULL_LENGTH * 0.3, HULL_WIDTH * 0.4],
  //   [HULL_LENGTH * 0.45, HULL_WIDTH * 0.1],
  //   [HULL_LENGTH * 0.5, 0],
  //   // [HULL_LENGTH * 0.45, -HULL_WIDTH * 0.1],
  //   [HULL_LENGTH * 0.3, -HULL_WIDTH * 0.4],
  //   [HULL_LENGTH * WIDE_POINT - HULL_LENGTH * 0.5, -HULL_WIDTH * 0.5],
  //   [-HULL_LENGTH * 0.1, -HULL_WIDTH * 0.45],
  //   [-HULL_LENGTH * 0.3, -HULL_WIDTH * 0.3],
  //   [-HULL_LENGTH * 0.5, 0],
  // ];
  let hull = draw(HullCurve1.startPoint)
    .cubicBezierCurveTo(HullCurve1.endPoint, HullCurve1.startControlPoint, HullCurve1.endControlPoint)
    .cubicBezierCurveTo(HullCurve2.endPoint, HullCurve2.startControlPoint, HullCurve2.endControlPoint)
    .closeWithMirror();

  // const controlPoints = [
  //   drawCircle(1.5).translate(HullCurve1.startPoint),
  //   drawCircle(1.5).translate(HullCurve1.startControlPoint),
  //   drawCircle(1.5).translate(HullCurve1.endControlPoint),
  //   drawCircle(1.5).translate(HullCurve1.endPoint),
  //   drawCircle(1.5).translate(HullCurve2.startControlPoint),
  //   drawCircle(1.5).translate(HullCurve2.endControlPoint),
  //   drawCircle(1.5).translate(HullCurve2.endPoint),
  // ];

  hull = hull.sketchOnPlane().extrude(HULL_HEIGHT);

  // hull = hull.fillet(1, (e) => e.inDirection("Z"));

  hull = hull.fillet(5, (e) => e.inPlane("XY", 0));

  let frontFin = drawEllipse(FIN_LENGTH, FIN_WIDTH);
  frontFin = frontFin.sketchOnPlane().extrude(-(FIN_HEIGHT + 5));
  frontFin = frontFin.translate([FRONT_FIN_OFFSET, 0, 5]);

  // let backFin = drawEllipse(FIN_LENGTH, FIN_WIDTH);
  // backFin = backFin.sketchOnPlane().extrude(FIN_HEIGHT);
  // backFin = backFin.translate([BACK_FIN_OFFSET, 0]);

  // let dummyProp = drawCircle(PROP_RADIUS);
  // dummyProp = dummyProp.sketchOnPlane("YZ");
  // dummyProp = dummyProp.extrude(PROP_THICKNESS).fillet(3);

  // const backPosition = HULL_LENGTH * 0.5 - PROP_THICKNESS / 2;
  // dummyProp = dummyProp.translate([backPosition, 0, BORE_HEIGHT]);

  // let boreDriller = drawCircle(BORE_RADIUS);
  // boreDriller = boreDriller.sketchOnPlane("YZ");
  // boreDriller = boreDriller.extrude(HULL_LENGTH * 0.3);
  // boreDriller = boreDriller.translate([HULL_LENGTH * 0.15, 0, BORE_HEIGHT]);

  // let rubberBandPropClip = drawCircle(SHAFT_RADIUS);
  // rubberBandPropClip = rubberBandPropClip.sketchOnPlane("YZ");
  // rubberBandPropClip = rubberBandPropClip.extrude(FIN_LENGTH);
  // const shaftPosition = BACK_FIN_OFFSET - FIN_LENGTH * 3;
  // rubberBandPropClip = rubberBandPropClip.translate([shaftPosition, 0, BORE_HEIGHT]);
  // rubberBandPropClip = rubberBandPropClip.fillet(SHAFT_RADIUS, (e) => e.inPlane("YZ", shaftPosition));

  // let boatBody = hull.fuse(frontFin).fuse(backFin);
  // boatBody = boatBody.cut(boreDriller);
  // dummyProp = dummyProp.cut(boreDriller);

  // const components = [hull, ...controlPoints];
  const components = [hull, frontFin];

  console.log("model updated at ", new Date().getTime());

  return components;
}

globalThis.main = main;
