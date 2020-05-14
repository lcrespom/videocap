function keypoints2map(keypoints) {
    let kpMap = {}
    for (let kp of keypoints)
        kpMap[kp.part] = kp
    return kpMap
}

function drawSegment({ ctx, kpMap, minConfidence }, from, to) {
    let kpFrom = kpMap[from]
    let kpTo = kpMap[to]
    if (kpFrom.score < minConfidence || kpTo.score < minConfidence)
        return
    let {x: x1, y: y1} = kpFrom.position
    let {x: x2, y: y2} = kpTo.position
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
}

export function drawPose(keypoints, ctx, minConfidence = 0.5, scale = 1) {
    // nose, leftEye, rightEye, leftEar, rightEar,
    // leftShoulder, rightShoulder, leftElbow, rightElbow,
    // leftWrist, rightWrist, leftHip, rightHip,
    // leftKnee, rightKnee, leftAnkle, rightAnkle
    let kpMap = keypoints2map(keypoints)
    ctx.save()
    ctx.strokeStyle = 'cyan'
    ctx.lineWidth = 2
    ctx.beginPath()
    // Torso
    let drawInfo = { ctx, kpMap, minConfidence }
    drawSegment(drawInfo, 'leftShoulder', 'rightShoulder')
    drawSegment(drawInfo, 'leftShoulder', 'leftHip')
    drawSegment(drawInfo, 'rightShoulder', 'rightHip')
    drawSegment(drawInfo, 'leftHip', 'rightHip')
    // Arms
    drawSegment(drawInfo, 'leftShoulder', 'leftElbow')
    drawSegment(drawInfo, 'leftElbow', 'leftWrist')
    drawSegment(drawInfo, 'rightShoulder', 'rightElbow')
    drawSegment(drawInfo, 'rightElbow', 'rightWrist')
    // Legs
    drawSegment(drawInfo, 'leftHip', 'leftKnee')
    drawSegment(drawInfo, 'leftKnee', 'leftAnkle')
    drawSegment(drawInfo, 'rightHip', 'rightKnee')
    drawSegment(drawInfo, 'rightKnee', 'rightAnkle')
    // Draw it
    ctx.stroke()
    ctx.restore()
}
