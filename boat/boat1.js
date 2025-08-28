const defaultParams = {};

const HULL_LENGTH = 200;
const HULL_WIDTH = HULL_LENGTH * 0.2;
const WIDE_POINT = 0.6;

const HULL_HEIGHT = 15;

const FIN_LENGTH = 15;
const FIN_WIDTH = 4;
const FIN_HEIGHT = -20;

const FRONT_FIN_OFFSET = HULL_LENGTH * -0.25;
const BACK_FIN_OFFSET = HULL_LENGTH * 0.3;

/** @typedef { typeof import("replicad") } replicadLib */
/** @type {function(replicadLib, typeof defaultParams): any} */
function main({ draw, drawEllipse }, {}) {
  let hull = draw([-HULL_LENGTH * 0.5, 0]); // bow tip on centerline

  hull = hull.smoothSpline(HULL_LENGTH * WIDE_POINT, HULL_WIDTH * 0.5, { endTangent: [1, 0], startFactor: 1 });
  hull = hull.smoothSpline(HULL_LENGTH * (1 - WIDE_POINT), HULL_WIDTH * -0.5, { endTangent: [1, 0], startFactor: 1 });

  hull = hull.closeWithMirror();

  hull = hull.sketchOnPlane().extrude(HULL_HEIGHT);

  hull = hull.fillet(2, (e) => e.inDirection("Z"));

  hull = hull.fillet(1.9, (e) => e.inPlane("XY", 0)); // Bottom curved edges

  let frontFin = drawEllipse(FIN_LENGTH, FIN_WIDTH);
  frontFin = frontFin.sketchOnPlane().extrude(FIN_HEIGHT);
  frontFin = frontFin.translate([FRONT_FIN_OFFSET, 0]);
  //   frontFin = frontFin.fillet(0.1, (e) => e.inPlane("XY", FIN_HEIGHT));

  let backFin = drawEllipse(FIN_LENGTH, FIN_WIDTH);
  backFin = backFin.sketchOnPlane().extrude(FIN_HEIGHT);
  backFin = backFin.translate([BACK_FIN_OFFSET, 0]);

  return [hull, frontFin, backFin];
}

globalThis.main = main;
