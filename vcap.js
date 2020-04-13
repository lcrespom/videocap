import * as filters from './filters.js'


const WIDTH = 320
const HEIGHT = 200

let video = document.getElementById('inputv')
let inCanvas = document.getElementById('capture')
let inCtx = inCanvas.getContext('2d')
let outCanvas = document.getElementById('outputv')
let outCtx = outCanvas.getContext('2d')
let framect = 0
const FRAME_SKIP = 4
let captureCol = null
let filteredImgData = null


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
            inCanvas.width = w
            inCanvas.height = h
            outCanvas.width = w
            outCanvas.height = h
            captureVideo(w, h)
        }
    })
}

function captureVideo(w, h) {
    requestAnimationFrame(() => captureVideo(w, h))
    framect++
    if (framect % FRAME_SKIP != 0) return
    inCtx.drawImage(video, 0, 0)
    renderOutput(inCtx.getImageData(0, 0, w, h), w, h)
}

function renderOutput(imgData, w, h) {
    imgData = filters.mirror(imgData)
    imgData = filters.contrast(imgData, 100)
    filteredImgData = imgData
    if (captureCol) {
    }
    outCtx.putImageData(imgData, 0, 0)
    if (!captureCol) {
        outCtx.strokeStyle = (framect/FRAME_SKIP) % 2 ? '#0000ff' : '#ffff00'
        outCtx.lineWidth = 2
        outCtx.strokeRect(w/2 - 8, h/2 - 8, 16, 16)
    }
}

function captureColor() {
    // Check https://stackoverflow.com/a/39147465/2342681 for rgb to hue
    captureCol = [255, 0, 128]
    let data = filteredImgData.data
    let w = filteredImgData.width
    let h = filteredImgData.height
    let r = 0, g = 0, b = 0
    for (let y = h/2 - 8; y <= h/2 + 8; y++) {
        for (let x = w/2 - 8; x <= w/2 + 8; x++) {
            let i = (y*w + x) * 4
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
        }
    }
    const avg = x => Math.round(x/(17*17))
    captureCol = [avg(r), avg(g), avg(b)]
    console.log(captureCol)
}


function main() {
    startWebcam()
    document.getElementById('getcolor').onclick = captureColor
}

main()