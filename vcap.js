const WIDTH = 600
const HEIGHT = 500

let video = document.getElementById('inputv')
let canvas = document.getElementById('outputv')
let ctx = canvas.getContext('2d')
let net

function startWebcam() {
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
    ctx.save()
    ctx.scale(-1, 1)
    ctx.translate(-video.videoWidth, 0)
    ctx.drawImage(video, 0, 0)
    ctx.restore()
    let pose = await getPose(video)
    requestAnimationFrame(() => captureVideo(w, h))
}

async function getPose(video) {
    let pose = await net.estimateSinglePose(video, { flipHorizontal: true });
    drawKeypoints(pose.keypoints)
    //console.dir(pose)
}

function keypoints2map(keypoints) {
    let kpMap = {}
    for (let kp of keypoints)
        kpMap[kp.part] = kp
    return kpMap
}

function drawSegment(ctx, kpMap, from, to) {}

function drawKeypoints(keypoints, ctx, minConfidence = 0.5, scale = 1) {
    // nose, leftEye, rightEye, leftEar, rightEar,
    // leftShoulder, rightShoulder, leftElbow, rightElbow,
    // leftWrist, rightWrist, leftHip, rightHip,
    // leftKnee, rightKnee, leftAnkle, rightAnkle
    let kpMap = keypoints2map(keypoints)
    drawSegment(ctx, kpMap, 'leftShoulder', 'rightShoulder')
    drawSegment(ctx, kpMap, 'leftShoulder', 'leftHip')
    drawSegment(ctx, kpMap, 'rightShoulder', 'rightHip')
    drawSegment(ctx, kpMap, 'leftHip', 'rightHip')
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