import * as draw from './draw.js'


let startTime
let recording = false
let recBut = document.getElementById('record')
let playBut = document.getElementById('play')
let recData
let playPos
let canvas
let ctx


export function init(w, h) {
    initCanvas(w, h)
    recBut.addEventListener('click', _ => {
        recording = !recording
        if (recording)
            startRecording()
        else
            stopRecording()
    })
    playBut.addEventListener('click', _ => {
        playRecording()
    })
}

function initCanvas(w, h) {
    canvas = document.getElementById('replay')
    canvas.width = w
    canvas.height = h
    ctx = canvas.getContext('2d')
}

export function sendPose(pose) {
    if (!recording) return
    let time = performance.now() - startTime
    recData.push({ time, pose })
}

function startRecording() {
    playBut.disabled = true
    recBut.innerText = 'Stop recording'
    startTime = performance.now()
    recData = []
}

function stopRecording() {
    playBut.disabled = false
    recBut.innerText = 'Record dance'
}


function playStep() {
    let time = performance.now() - startTime
    let item = recData[playPos]
    if (item.time >= time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        draw.drawPose(item.pose.keypoints, ctx)
        playPos++
    }
    if (playPos < recData.length)
        requestAnimationFrame(playStep)
}

function playRecording() {
    playPos = 0
    startTime = performance.now()
    playStep()
}