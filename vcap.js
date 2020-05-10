const WIDTH = 600
const HEIGHT = 500

let video = document.getElementById('inputv')
let canvas = document.getElementById('outputv')
let ctx = canvas.getContext('2d')
let net

function startWebcam() {
    video.width = WIDTH
    video.height = HEIGHT
    let constraintObj = {
        audio: false,
        video: {
            facingMode: 'user',
            width: WIDTH,
            height: HEIGHT
        }
    }
    navigator.mediaDevices.getUserMedia(constraintObj)
    .then(mediaStreamObj => {
        // Connect the media stream to the input video element
        video.srcObject = mediaStreamObj
        video.onloadedmetadata = function(ev) {
            //show in the video element what is being captured by the webcam
            video.play()
            let w = video.videoWidth
            let h = video.videoHeight
            canvas.width = w
            canvas.height = h
            captureVideo(w, h)
        }
    })
}

async function captureVideo(w, h) {
    //ctx.clearRect(0, 0, WIDTH, HEIGHT)
    //drawVideo()
    let pose = await net.estimateSinglePose(video, { flipHorizontal: true })
    drawPose(pose.keypoints, ctx)
    requestAnimationFrame(() => captureVideo(w, h))
}

function drawVideo() {
    ctx.save()
    ctx.scale(-1, 1)
    ctx.translate(-video.videoWidth, 0)
    ctx.drawImage(video, 0, 0)
    ctx.restore()
}

function keypoints2map(keypoints) {
    let kpMap = {}
    for (let kp of keypoints)
        kpMap[kp.part] = kp
    return kpMap
}

function drawSegment(ctx, kpMap, from, to) {
    let {x: x1, y: y1} = kpMap[from].position
    let {x: x2, y: y2} = kpMap[to].position
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
}

function drawPose(keypoints, ctx, minConfidence = 0.5, scale = 1) {
    // nose, leftEye, rightEye, leftEar, rightEar,
    // leftShoulder, rightShoulder, leftElbow, rightElbow,
    // leftWrist, rightWrist, leftHip, rightHip,
    // leftKnee, rightKnee, leftAnkle, rightAnkle
    let kpMap = keypoints2map(keypoints)
    ctx.save()
    ctx.strokeStyle = 'cyan'
    ctx.lineWidth = 2
    ctx.beginPath()
    drawSegment(ctx, kpMap, 'leftShoulder', 'rightShoulder')
    drawSegment(ctx, kpMap, 'leftShoulder', 'leftHip')
    drawSegment(ctx, kpMap, 'rightShoulder', 'rightHip')
    drawSegment(ctx, kpMap, 'leftHip', 'rightHip')
    ctx.stroke()
    ctx.restore()
    console.log(kpMap.leftShoulder.position)
}


async function main() {
    net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: 500,
        multiplier: 0.5,
        quantBytes: 2
    })
    console.dir(net)
    startWebcam()
}

main()
