(function() {

const WIDTH = 320
const HEIGHT = 200

let video = document.getElementById('inputv')
let inCanvas = document.getElementById('capture')
let inCtx = inCanvas.getContext('2d')
let outCanvas = document.getElementById('outputv')
let outCtx = outCanvas.getContext('2d')
let framect = 0
const FRAME_SKIP = 4

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


function captureVideo(w, h) {
    requestAnimationFrame(() => captureVideo(w, h))
    framect++
    if (framect % FRAME_SKIP != 0) return
    inCtx.drawImage(video, 0, 0)
    renderOutput(inCtx.getImageData(0, 0, w, h))
}

function renderOutput(imgData) {
    outCtx.putImageData(grayscale(imgData), 0, 0)
}

function grayscale(imgData) {
    let i = 0
    let data = imgData.data
    for (let y = 0; y < imgData.height; y++) {
        for (let x = 0; x < imgData.width; x++) {
            let r = data[i]
            let g = data[i + 1]
            let b = data[i + 2]
            let gray = 0.3 * r + 0.59 * g + 0.11 * b
            data[i] = gray
            data[i + 1] = gray
            data[i + 2] = gray
            i += 4
        }
    }
    return imgData
}

})()