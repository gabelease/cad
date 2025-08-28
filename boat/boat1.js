const defaultParams = {};

const HULL_LENGTH = 200;
const HULL_WIDTH = HULL_LENGTH * 0.2;
const WIDE_POINT = 0.6;

/** @typedef { typeof import("replicad") } replicadLib */
/** @type {function(replicadLib, typeof defaultParams): any} */
function main({ draw }, {}) {
  let shape = draw([0, 0]); // bow tip on centerline

  // Step 1: fair forward section
  shape = shape.smoothSpline(HULL_LENGTH * WIDE_POINT, HULL_WIDTH * 0.5, { endTangent: [1, 0], startFactor: 1 });
  shape = shape.smoothSpline(HULL_LENGTH * (1 - WIDE_POINT), HULL_WIDTH * -0.5, { endTangent: [1, 0], startFactor: 1 });

  // Step 2: widen toward max beam near mid/afterbody
  //   shape = shape.smoothSpline(HULL_WIDTH * 0.75, HULL_WIDTH * 0.45, { endTangent: [1, 0] });

  // Step 3: run aft to transom center
  //   shape = shape.lineTo([HULL_WIDTH, 0]);

  // Step 4: soften the transom corner
  //   shape = shape.customCorner(8);

  // Step 5: round the sharp bow point before closing
  //   shape = shape.customCorner(3);

  // Step 6: mirror to port and close profile
  shape = shape.closeWithMirror();

  shape = shape.sketchOnPlane().extrude(10);

  // First fillet the vertical edges (bow and stern)
  shape = shape.fillet(3, (e) => e.inDirection("Z"));

  // Now target the curved horizontal edges from the extruded spline
  // Option 1: Target edges in horizontal planes
  shape = shape.fillet(2.9, (e) => e.inPlane("XY", 0)); // Bottom curved edges
  //   shape = shape.fillet(1, (e) => e.inPlane("XY", 10)); // Top curved edges

  // Option 2: Alternative approach - target edges that are NOT vertical
  // shape = shape.fillet(1, (e) => e.not((edge) => edge.inDirection("Z")));

  return shape;
}

globalThis.main = main;
