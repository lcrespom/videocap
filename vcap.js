const WIDTH = 400
const HEIGHT = 400

let video = document.getElementById('inputv')
let canvas = document.getElementById('outputv')
let ctx = canvas.getContext('2d')

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

function captureVideo(w, h) {
    ctx.save()
    ctx.scale(-1, 1)
    ctx.translate(-video.videoWidth, 0)
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    ctx.restore()
    requestAnimationFrame(() => captureVideo(w, h))
}


function main() {
    startWebcam()
}

main()