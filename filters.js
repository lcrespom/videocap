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


// See https://stackoverflow.com/a/37714937/2342681
export function contrast(imgData, contrast) {  // Input range [-100..100]
    let d = imgData.data
    contrast = (contrast/100) + 1  // Convert to decimal & shift range: [0..2]
    let intercept = 128 * (1 - contrast)
    for (let i = 0; i < d.length; i += 4) {   // r, g, b, a
        d[i] = d[i] * contrast + intercept
        d[i+1] = d[i+1] * contrast + intercept
        d[i+2] = d[i+2] * contrast + intercept
    }
    return imgData
}
