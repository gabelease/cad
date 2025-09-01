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
const FIN_SLOPE = 0.5;

const FRONT_FIN_OFFSET = HULL_LENGTH * 0.25;
const BACK_FIN_OFFSET = HULL_LENGTH * 0.85;

const PROP_SCALE = 0.75;

const PROP_DIAMETER = 60 * PROP_SCALE;
const PROP_THICKNESS = 18 * PROP_SCALE;
const PROP_RADIUS = PROP_DIAMETER / 2;

const BORE_HEIGHT = FIN_HEIGHT * 0.85;
const FRONT_NOTCH_RADIUS = 4;
const FRONT_NOTCH_OFFSET = 2;
const BACK_NOTCH_OFFSET = 8;
const BACK_NOTCH_HEIGHT = 11;

const BORE_DIAMETER = 3 * PROP_SCALE;
const BORE_RADIUS = BORE_DIAMETER / 2;

const SHAFT_DIAMETER = 10;
const SHAFT_RADIUS = SHAFT_DIAMETER / 2;

/** @typedef { typeof import("replicad") } replicadLib */
/** @type {function(replicadLib, typeof defaultParams): any} */
function main({ draw, drawEllipse, drawCircle, makeSphere }, {}) {
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

  let frontFinTop = drawEllipse(FIN_LENGTH, FIN_WIDTH).sketchOnPlane();
  let frontFinBottom = drawEllipse(FIN_LENGTH * 0.5, FIN_WIDTH)
    .translate(FIN_LENGTH * 0.5)
    .sketchOnPlane("XY", -(FIN_HEIGHT + 5));
  let frontFin = frontFinTop.loftWith(frontFinBottom).translate([FRONT_FIN_OFFSET, 0, 5]);

  let frontNotch = drawCircle(FRONT_NOTCH_RADIUS)
    .sketchOnPlane("XZ")
    .extrude(-10)
    .translate([FRONT_FIN_OFFSET - FRONT_NOTCH_OFFSET, -5, -BORE_HEIGHT]);

  frontFin = frontFin.cut(frontNotch);

  // let backFin = drawEllipse(FIN_LENGTH, FIN_WIDTH);
  // backFin = backFin.sketchOnPlane().extrude(-(FIN_HEIGHT + 5), { extrusionProfile: { profile: "linear", endFactor: FIN_SLOPE } });
  // backFin = backFin.rotate(-10, [0, 0, 0], [0, 1, 0]).translate([BACK_FIN_OFFSET, 0, 5]);

  let backFinTop = drawEllipse(FIN_LENGTH, FIN_WIDTH).sketchOnPlane();
  let backFinBottom = drawEllipse(FIN_LENGTH * 0.5, FIN_WIDTH)
    .translate(FIN_LENGTH * 0.5)
    .sketchOnPlane("XY", -(FIN_HEIGHT + 5));
  let backFin = backFinTop.loftWith(backFinBottom).translate([BACK_FIN_OFFSET, 0, 5]);

  let backNotch = draw()
    .lineTo([-20, 0])
    .lineTo([-20, -20])
    .lineTo([0, -20])
    .lineTo([0, 0])
    .close()
    .fillet(3)
    .sketchOnPlane("XZ")
    .extrude(FIN_WIDTH * 4)
    .translate([BACK_FIN_OFFSET + FIN_LENGTH - BACK_NOTCH_OFFSET, FIN_WIDTH * 2, -FIN_HEIGHT + BACK_NOTCH_HEIGHT]);

  let dummyProp = drawCircle(PROP_RADIUS);
  dummyProp = dummyProp.sketchOnPlane("YZ");
  dummyProp = dummyProp.extrude(PROP_THICKNESS).fillet(3);

  const backPosition = BACK_FIN_OFFSET + FIN_LENGTH + 2;
  dummyProp = dummyProp.translate([backPosition, 0, -BORE_HEIGHT]);

  let boreDriller = drawCircle(BORE_RADIUS);
  boreDriller = boreDriller.sketchOnPlane("YZ");
  boreDriller = boreDriller.extrude(HULL_LENGTH);
  boreDriller = boreDriller.translate([HULL_LENGTH * 0.5, 0, -BORE_HEIGHT]);

  let rubberBandPropClip = drawCircle(SHAFT_RADIUS);
  rubberBandPropClip = rubberBandPropClip.sketchOnPlane("YZ");
  rubberBandPropClip = rubberBandPropClip
    .extrude(-FIN_LENGTH * 1.5)
    .fillet(4, (e) => e.inPlane("YZ", -FIN_LENGTH * 1.5))
    .fillet(SHAFT_RADIUS * 0.5, (e) => e.inPlane("YZ", 0));

  let rubberBandClipHole = drawCircle(2).sketchOnPlane("XY").extrude(20).translate([-15, 0, -10]);
  rubberBandPropClip = rubberBandPropClip.cut(rubberBandClipHole);

  // let clipHole = drawCircle(BORE_RADIUS)
  //   .sketchOnPlane("YZ")
  //   .extrude(-FIN_LENGTH * 1);
  // rubberBandPropClip = rubberBandPropClip.cut(clipHole);

  const shaftPosition = BACK_FIN_OFFSET - FIN_LENGTH * 3;
  rubberBandPropClip = rubberBandPropClip.translate([BACK_FIN_OFFSET + FIN_LENGTH - BACK_NOTCH_OFFSET, 0, -BORE_HEIGHT]).cut(boreDriller);
  // rubberBandPropClip = rubberBandPropClip.fillet(SHAFT_RADIUS, (e) => e.inPlane("YZ", shaftPosition));

  let boatBody = hull.fuse(frontFin).fuse(backFin);
  boatBody = boatBody.cut(boreDriller).cut(backNotch);
  dummyProp = dummyProp.cut(boreDriller);

  // const components = [hull, ...controlPoints];
  const components = [rubberBandPropClip];
  console.log("model updated at ", new Date().getTime());

  return components;
}

globalThis.main = main;
