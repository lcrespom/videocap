let startTime
let recording = false
let recBut = document.getElementById('record')
let playBut = document.getElementById('play')
let recData
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
        document.location = '/'
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
    let danceStr = JSON.stringify({ poses: recData })
    localStorage.setItem('dance', danceStr)
}
