const defaultParams = {};

/** @typedef { typeof import("replicad") } replicadLib */
/** @type {function(replicadLib, typeof defaultParams): any} */
function main({ draw }, {}) {
  let shape = draw().hLine(100).halfEllipse(0, 40, 10).hLine(-25).close();
  shape = shape.sketchOnPlane().extrude(50).fillet(10);
  return shape;
}

globalThis.main = main;
