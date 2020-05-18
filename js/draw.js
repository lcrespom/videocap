// Keypoint names:
//  Head: nose, leftEye, rightEye, leftEar, rightEar
//  Torso: leftShoulder, rightShoulder, leftHip, rightHip
//  Arms: leftElbow, rightElbow, leftWrist, rightWrist
//  Legs: leftKnee, rightKnee, leftAnkle, rightAnkle

function keypoints2map(keypoints) {
    let kpMap = {}
    for (let kp of keypoints)
        kpMap[kp.part] = kp
    return kpMap
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

function drawLines({ ctx, kpMap, minConfidence }, pnames) {
    for (let pname of pnames)
        if (kpMap[pname].score < minConfidence) return
    let { x, y } = kpMap[pnames[0]].position
    ctx.moveTo(x, y)
    for (let i = 1; i < pnames.length; i++) {
        let { x, y } = kpMap[pnames[i]].position
        ctx.lineTo(x, y)
    }
}

function fillPolygon({ ctx, kpMap, minConfidence }, pnames) {
    let points = pnames.map(n => kpMap[n])
    for (let p of points)
        if (p.score < minConfidence) return
    ctx.beginPath()
    ctx.moveTo(points[0].position.x, points[0].position.y)
    for (let i = 1; i < points.length; i++)
        ctx.lineTo(points[i].position.x, points[i].position.y)
    ctx.lineTo(points[0].position.x, points[0].position.y)
    ctx.closePath()
    ctx.fill()
}

function drawHeadAndTorso(drawInfo) {
    // Head
    drawLines(drawInfo, ['neck', 'rightEar', 'hat', 'leftEar', 'neck'])
    // Torso
    drawLines(drawInfo, [
        'leftShoulder', 'leftHip', 'rightHip', 'rightShoulder', 'leftShoulder'
    ])
}

function fillHeadAndTorso(drawInfo) {
    fillPolygon(drawInfo, ['neck', 'rightEar', 'hat', 'leftEar'] )
    fillPolygon(drawInfo,
        ['leftShoulder', 'leftHip', 'rightHip', 'rightShoulder'])
}

function drawArmsAndLegs(drawInfo) {
    // Arms
    drawLines(drawInfo, ['leftShoulder', 'leftElbow', 'leftWrist'])
    drawLines(drawInfo, ['rightShoulder', 'rightElbow', 'rightWrist'])
    // Legs
    drawLines(drawInfo, ['leftHip', 'leftKnee', 'leftAnkle'])
    drawLines(drawInfo, ['rightHip', 'rightKnee', 'rightAnkle'])
}

function initDrawInfo(keypoints, ctx, style, minConfidence) {
    let kpMap = keypoints2map(keypoints)
    kpMap.neck = midPoint(kpMap.leftShoulder, kpMap.rightShoulder)
    kpMap.hat = translate(kpMap.neck, midPoint(kpMap.leftEar, kpMap.rightEar))
    ctx.strokeStyle = style
    return { ctx, kpMap, minConfidence }
}

export function drawPose(keypoints, ctx, style = 'lime', minConfidence = 0.5) {
    ctx.save()
    ctx.beginPath()
    ctx.lineJoin = 'round'
    ctx.lineWidth = 5
    let drawInfo = initDrawInfo(keypoints, ctx, style, minConfidence)
    drawHeadAndTorso(drawInfo)
    drawArmsAndLegs(drawInfo)
    ctx.stroke()
    ctx.restore()
}

export function fillPose(keypoints, ctx, style = 'red', minConfidence = 0.5) {
    ctx.save()
    ctx.lineJoin = 'round'
    ctx.lineWidth = 15
    ctx.fillStyle = style
    let drawInfo = initDrawInfo(keypoints, ctx, style, minConfidence)
    fillHeadAndTorso(drawInfo)
    ctx.beginPath()
    drawArmsAndLegs(drawInfo)
    ctx.stroke()
    ctx.restore()
}