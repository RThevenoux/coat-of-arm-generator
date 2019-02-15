import Bezier from 'bezier-js';
import paper from 'paper';

let BezierTool = {
    beziersToPath: beziersToPath,
    curveToBezier: curveToBezier
}

export default BezierTool;

function curveToBezier(curve) {
    let p1 = curve.point1;
    let handle1 = curve.points[1]; // Do not use curve.handle1 to have absolute position;
    let handle2 = curve.points[2]; // Idem
    let p2 = curve.point2;

    if (p1.x == handle1.x && p1.y == handle1.y) {
        // If p1 == handle1, Bezier.offset() method fail
        // So, slighty change handle1 with the tangent to minize visual effect
        handle1 = handle1.add(curve.getTangentAtTime(0));
    }

    return new Bezier(
        p1.x, p1.y,
        handle1.x, handle1.y,
        handle2.x, handle2.y,
        p2.x, p2.y);
}

function beziersToPath(beziers) {
    let path = new paper.Path();

    let firstLine = beziers[0];
    let start = firstLine.points[0];
    let handleOut = relativePoint(start, firstLine.points[1]);
    let firstSegment = new paper.Segment(start, null, handleOut);
    path.add(firstSegment);

    for (let i = 1; i < beziers.length; i++) {
        let beforeLine = beziers[i - 1];
        let afterLine = beziers[i];

        let start = afterLine.points[0];
        let handleIn = relativePoint(start, beforeLine.points[2]);
        let handleOut = relativePoint(start, afterLine.points[1]);
        let segment = new paper.Segment(start, handleIn, handleOut);
        path.add(segment);
    }

    let lastLine = beziers[beziers.length - 1];
    let end = lastLine.points[3];
    let handleIn = relativePoint(end, lastLine.points[2]);
    let lastSegment = new paper.Segment(end, handleIn, null);
    path.add(lastSegment);

    return path;
}

function relativePoint(reference, point) {
    return {
        x: point.x - reference.x,
        y: point.y - reference.y
    }
}