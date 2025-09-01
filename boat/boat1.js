const defaultParams = {};

const HULL_LENGTH = 250;
const HULL_WIDTH = HULL_LENGTH * 0.15;
const WIDE_POINT = 0.6;

const HULL_HEIGHT = 15;

const FIN_LENGTH = 15;
const FIN_WIDTH = 4;
const FIN_HEIGHT = -30;

const FRONT_FIN_OFFSET = HULL_LENGTH * -0.25;
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
async function main({ draw, drawEllipse, drawCircle, importSTL }, {}) {
  let hull = draw([-HULL_LENGTH * 0.5, 0]);

  hull = hull.smoothSpline(HULL_LENGTH * WIDE_POINT, HULL_WIDTH * 0.5, { endTangent: [1, 0], startFactor: 1 });
  hull = hull.smoothSpline(HULL_LENGTH * (1 - WIDE_POINT), HULL_WIDTH * -0.5, { endTangent: [1, 0], startFactor: 1 });

  hull = hull.closeWithMirror();

  hull = hull.sketchOnPlane().extrude(HULL_HEIGHT);

  hull = hull.fillet(1, (e) => e.inDirection("Z"));

  hull = hull.fillet(1.9, (e) => e.inPlane("XY", 0));

  let frontFin = drawEllipse(FIN_LENGTH, FIN_WIDTH);
  frontFin = frontFin.sketchOnPlane().extrude(FIN_HEIGHT);
  frontFin = frontFin.translate([FRONT_FIN_OFFSET, 0]);

  let backFin = drawEllipse(FIN_LENGTH, FIN_WIDTH);
  backFin = backFin.sketchOnPlane().extrude(FIN_HEIGHT);
  backFin = backFin.translate([BACK_FIN_OFFSET, 0]);

  let dummyProp = drawCircle(PROP_RADIUS);
  dummyProp = dummyProp.sketchOnPlane("YZ");
  dummyProp = dummyProp.extrude(PROP_THICKNESS).fillet(3);

  const backPosition = HULL_LENGTH * 0.5 - PROP_THICKNESS / 2;
  dummyProp = dummyProp.translate([backPosition, 0, BORE_HEIGHT]);

  let boreDriller = drawCircle(BORE_RADIUS);
  boreDriller = boreDriller.sketchOnPlane("YZ");
  boreDriller = boreDriller.extrude(HULL_LENGTH * 0.3);
  boreDriller = boreDriller.translate([HULL_LENGTH * 0.15, 0, BORE_HEIGHT]);

  let rubberBandPropClip = drawCircle(SHAFT_RADIUS);
  rubberBandPropClip = rubberBandPropClip.sketchOnPlane("YZ");
  rubberBandPropClip = rubberBandPropClip.extrude(FIN_LENGTH);
  const shaftPosition = BACK_FIN_OFFSET - FIN_LENGTH * 3;
  rubberBandPropClip = rubberBandPropClip.translate([shaftPosition, 0, BORE_HEIGHT]);
  rubberBandPropClip = rubberBandPropClip.fillet(SHAFT_RADIUS, (e) => e.inPlane("YZ", shaftPosition));

  let boatBody = hull.fuse(frontFin).fuse(backFin);
  boatBody = boatBody.cut(boreDriller);
  dummyProp = dummyProp.cut(boreDriller);

  const components = [boatBody, dummyProp, rubberBandPropClip];

  console.log("model updated at ", new Date().getTime());

  return components;
}

globalThis.main = main;
