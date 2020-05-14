let startTime
let recording = false
let recBut = document.getElementById('record')
let playBut = document.getElementById('play')
let recData
let playPos


export function init() {
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
    let time = Date.now() - startTime
    recData.push({ time, pose })
}

function startRecording() {
    playBut.disabled = true
    recBut.innerText = 'Stop recording'
    startTime = Date.now()
    recData = []
}

function stopRecording() {
    playBut.disabled = false
    recBut.innerText = 'Record dance'
}


function playStep() {
    let time = Date.now() - startTime
    let item = recData[playPos]
    if (item.time >= time) {
        drawPose(item.pose)
        playPos++
    }
    if (playPos >= recData.length) return
    requestAnimationFrame(playStep)
}

function playRecording() {
    playPos = 0
    startTime = Date.now()
    playStep()
    //console.dir(recData)
}