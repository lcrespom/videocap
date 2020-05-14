import * as recorder from './recorder.js'
import * as draw from './draw.js'


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
    let pose = await net.estimateSinglePose(video, { flipHorizontal: true })
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    drawVideo()
    draw.drawPose(pose.keypoints, ctx)
    recorder.sendPose(pose)
    requestAnimationFrame(() => captureVideo(w, h))
}

function drawVideo() {
    ctx.save()
    ctx.scale(-1, 1)
    ctx.translate(-video.videoWidth, 0)
    ctx.drawImage(video, 0, 0)
    ctx.restore()
}


async function main() {
    net = await posenet.load({
        architecture: 'MobileNetV1',    // Or ResNet50
        outputStride: 16,
        inputResolution: 250,
        multiplier: 0.5,
        quantBytes: 2
    })
    startWebcam()
    recorder.init(WIDTH, HEIGHT)
}

main()
