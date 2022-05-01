const originalImageEl = document.querySelector('.original-image')
const originalImageCanvasEl = document.querySelector('.original-image_canvas')
const croppedImageWrapperEl = document.querySelector('.cropped-image_wrapper')

function drawCanvas(x, y, width, height) {
  croppedImageWrapperEl.innerHTML = ''

  const newCanvasEl = document.createElement('canvas')

  let newCanvasElWidth, newCanvasElHeight
  if (Math.abs(width) <= Math.abs(height)) {
    newCanvasElHeight = originalImageEl.height
    newCanvasElWidth = newCanvasElHeight * width / height
  } else {
    newCanvasElWidth = originalImageEl.width
    newCanvasElHeight = newCanvasElWidth * height / width
  }
  newCanvasEl.width = newCanvasElWidth
  newCanvasEl.height = newCanvasElHeight
  
  const imageEl = document.createElement('img')
  imageEl.addEventListener('load', () => {    
    const rate = imageEl.width / originalImageEl.width
    newCanvasEl.getContext('2d').drawImage(
      imageEl, 
      x * rate, 
      y * rate, 
      width * rate, 
      height * rate, 
      (newCanvasElWidth - newCanvasElWidth * 0.9) / 2, 
      (newCanvasElHeight - newCanvasElHeight * 0.9) / 2, 
      newCanvasElWidth * 0.9, 
      newCanvasElHeight * 0.9,
    )
  })
  imageEl.src = './image.jpeg'
  
  croppedImageWrapperEl.append(newCanvasEl)
}

function init() {
  originalImageCanvasEl.width = originalImageEl.width
  originalImageCanvasEl.height = originalImageEl.height
  
  const colorRed = '#ff0000'
  const context = originalImageCanvasEl.getContext('2d')
  context.lineWidth = 3
  context.strokeStyle = colorRed

  let sX, sY, eX, eY
  let isDrawing = false
  const originalImageCanvasRect = originalImageCanvasEl.getBoundingClientRect()
  const originalImageCanvasX = originalImageCanvasRect.x
  const originalImageCanvasY = originalImageCanvasRect.y

  originalImageCanvasEl.addEventListener('mousedown', e => {
    sX = parseInt(e.clientX - originalImageCanvasX)
    sY = parseInt(e.clientY - originalImageCanvasY)
    isDrawing = true
  })
  originalImageCanvasEl.addEventListener('mousemove', e => {
    if (!isDrawing) return
    eX = parseInt(e.clientX - originalImageCanvasX)
    eY = parseInt(e.clientY - originalImageCanvasY)
    context.clearRect(0, 0, originalImageCanvasEl.width, originalImageCanvasEl.height)
    context.strokeRect(sX, sY, eX - sX, eY - sY)
  })
  originalImageCanvasEl.addEventListener('mouseup', () => {
    isDrawing = false
    const threshold = 10
    const width = eX - sX
    const height = eY - sY
    Math.abs(width) > threshold && Math.abs(height) > threshold && drawCanvas(sX, sY, width, height)
  })
}

window.addEventListener('load', () => init())
