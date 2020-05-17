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

function midPoint(kp1, kp2) {
    return {
        position: {
            x: (kp1.position.x + kp2.position.x) / 2,
            y: (kp1.position.y + kp2.position.y) / 2
        },
        score: Math.min(kp1.score, kp2.score)
    }
}

function translate(kp1, kp2) {
    const HEAD_FLATTEN = 0.7
    let dx = kp2.position.x - kp1.position.x
    let dy = kp2.position.y - kp1.position.y
    return {
        position: {
            x: kp2.position.x + dx * HEAD_FLATTEN,
            y: kp2.position.y + dy * HEAD_FLATTEN
        },
        score: Math.min(kp1.score, kp2.score)
    }
}

export function drawPose(keypoints, ctx, style = 'cyan', minConfidence = 0.5) {
    // nose, leftEye, rightEye, leftEar, rightEar,
    // leftShoulder, rightShoulder, leftElbow, rightElbow,
    // leftWrist, rightWrist, leftHip, rightHip,
    // leftKnee, rightKnee, leftAnkle, rightAnkle
    let kpMap = keypoints2map(keypoints)
    kpMap.neck = midPoint(kpMap.leftShoulder, kpMap.rightShoulder)
    kpMap.hat = translate(kpMap.neck, midPoint(kpMap.leftEar, kpMap.rightEar))
    ctx.save()
    ctx.strokeStyle = style
    ctx.lineWidth = 3
    ctx.beginPath()
    let drawInfo = { ctx, kpMap, minConfidence }
    // Head
    drawSegment(drawInfo, 'neck', 'leftEar')
    drawSegment(drawInfo, 'neck', 'rightEar')
    drawSegment(drawInfo, 'hat', 'leftEar')
    drawSegment(drawInfo, 'hat', 'rightEar')
    // Torso
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
