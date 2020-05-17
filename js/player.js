import * as draw from './draw.js'


//TODO move to common file
const WIDTH = 600
const HEIGHT = 500

let playPos, startTime
let dance   // Put on your red shoes and dance the blues
let playBut = document.getElementById('play')
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')


function playStep() {
    let time = performance.now() - startTime
    let item = dance.poses[playPos]
    if (time >= item.time) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT)
        draw.drawPose(item.pose.keypoints, ctx, 'red')
        playPos++
    }
    if (playPos < dance.poses.length)
        requestAnimationFrame(playStep)
}

function playRecording() {
    playPos = 0
    startTime = performance.now()
    playStep()
}


function main() {
    let danceStr = localStorage.getItem('dance')
    if (!danceStr) return
    dance = JSON.parse(danceStr)
    console.dir(dance)
    playBut.disabled = false
    playBut.addEventListener('click', _ => {
        playRecording()
    })
    canvas.width = WIDTH
    canvas.height = HEIGHT
}

main()