export function grayscale(imgData) {
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

function swapArr(a, i, j) {
    let z = a[i]
    a[i] = a[j]
    a[j] = z
}

export function mirror(imgData) {
    let data = imgData.data
    let width = imgData.width
    let w2 = Math.floor(width / 2)
    for (let y = 0; y < imgData.height; y++) {
        for (let x = 0; x < w2; x++) {
            let i = (y * width + x) * 4
            let j = ((y + 1) * width - x) * 4
            swapArr(data, i, j)
            swapArr(data, i + 1, j + 1)
            swapArr(data, i + 2, j + 2)
        }
    }
    return imgData
}