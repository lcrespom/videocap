import * as draw from './draw.js'


let startTime
let recording = false
let recBut = document.getElementById('record')
let playBut = document.getElementById('play')
let recData
let playPos
let ctx


export function init(targetCtx) {
    ctx = targetCtx
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
    localStorage.setItem('dance', { poses: recData })
}


function playStep() {
    let time = performance.now() - startTime
    let item = recData[playPos]
    if (time >= item.time) {
        draw.drawPose(item.pose.keypoints, ctx, 'red')
        playPos++
    }
    if (playPos < recData.length)
        requestAnimationFrame(playStep)
}

function playRecording() {
    playPos = 0
    startTime = performance.now()
    playStep()
    //console.dir(recData)
}