'use strict'

function onInit() {
	gElCanvas = document.querySelector('canvas')
	gCtx = gElCanvas.getContext('2d')

	resizeCanvas()
	addListeners()
	renderPics()
}

function resizeCanvas() {
	const elContainer = document.querySelector('.canvas-container')
	gElCanvas.width = elContainer.clientWidth
}

function addListeners() {
	addMouseListeners()
	addTouchListeners()
}

function addMouseListeners() {
	gElCanvas.addEventListener('mousedown', onDown)
	gElCanvas.addEventListener('mousemove', onMove)
	gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
	gElCanvas.addEventListener('touchstart', onDown)
	gElCanvas.addEventListener('touchmove', onMove)
	gElCanvas.addEventListener('touchend', onUp)
}

///////////////////////////////////////////////

function onDown(ev) {
	if (gBrush.selectedImg) {
		const pos = getEvPos(ev)
		gCtx.drawImage(gBrush.selectedImg, pos.x - 25, pos.y - 25, 50, 50)
	} else {
		gIsMouseDown = true
		gStartPos = getEvPos(ev)

        onMove(ev)
	}
}

function onMove(ev) {
	if (!gIsMouseDown) return

	const pos = getEvPos(ev)
	draw(pos.x, pos.y)
	gStartPos = pos
}

function onUp() {
	gIsMouseDown = false
}

function getEvPos(ev) {
	const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

	let pos = {
		x: ev.offsetX,
		y: ev.offsetY,
	}

	if (TOUCH_EVS.includes(ev.type)) {
		// Prevent triggering the mouse ev
		ev.preventDefault()
		// Gets the first touch point
		ev = ev.changedTouches[0]
		// Calc the right pos according to the touch screen
		pos = {
			x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
			y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
		}
	}
	return pos
}

//////////////////////////////////

function draw(x, y) {
	switch (gBrush.shape) {
		case 'square':
			drawRect(x, y)
			break
		case 'circle':
			drawArc(x, y)
			break
		case 'line':
			drawLine(x, y)
			break
	}
}

function drawLine(x, y) {
	gCtx.beginPath()
	gCtx.moveTo(gStartPos.x, gStartPos.y)
	gCtx.lineTo(x, y)
	gCtx.lineWidth = gBrush.size
	gCtx.strokeStyle = gBrush.fillColor
	gCtx.stroke()
}

function drawArc(x, y) {
	gCtx.beginPath()
    gCtx.fillStyle = gCtx.strokeStyle = gBrush.fillColor
	gCtx.lineWidth = 1
	gCtx.arc(x, y, gBrush.size, 0, 2 * Math.PI)

	gBrush.mode === 'fill' ? gCtx.fill() : gCtx.stroke()

}
function drawRect(x, y) {
	gCtx.beginPath()
	gCtx.fillStyle = gCtx.strokeStyle = gBrush.fillColor
	gCtx.lineWidth = 1

    if (gBrush.mode === 'fill') {
        gCtx.fillRect(x, y, gBrush.size, gBrush.size)
    } else {
        gCtx.strokeRect(x, y, gBrush.size, gBrush.size)
    }
}

//////////////////////////////////////

function onRandomize() {
    const shape = randomizeSelect('.shape-picker')
    onSetShape(shape)

    const size = randomizeSelect('.size-picker')
    onSetSize(size)

    const mode = randomizeSelect('.mode-picker')
    onSetMode(mode)

    const elColor = document.querySelector('.color-picker')
    elColor.value = getRandomColor()
    onSetColor(elColor.value)
}

function randomizeSelect(selector) {
    const elSelect = document.querySelector(selector)
    const values = Array.from(elSelect.options).map(option => option.value)

    elSelect.value = pickRandom(values)
    return elSelect.value
}

function onSetColor(color) {
	gBrush.fillColor = color
	unSelectImg()
}

function onSetSize(size) {
	gBrush.size = size
	unSelectImg()
}

function onSetShape(shape) {
	gBrush.shape = shape
	unSelectImg()
}

function onSetMode(mode) {
    gBrush.mode = mode
    unSelectImg()
}

function onClearCanvas() {
	gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

////////////////////////////////////

function onSelectImg(elImg) {
	if (gBrush.selectedImg === elImg) {
		gBrush.selectedImg.classList.remove('selected')
		gBrush.selectedImg = null
	} else {
		if (gBrush.selectedImg) gBrush.selectedImg.classList.remove('selected')
		gBrush.selectedImg = elImg
		elImg.classList.add('selected')
	}
}

function unSelectImg() {
	if (!gBrush.selectedImg) return
	gBrush.selectedImg.classList.remove('selected')
	gBrush.selectedImg = null
}

//////////////////////////////////////////

function onSavePic() {
	const data = gElCanvas.toDataURL()
	addPic(data)
	renderPics()
}

function renderPics() {
	const pics = getPics()
	const strHTMLs = pics.map(pic => {
		return `
        <article>
            <button onclick="onRemovePic('${pic.id}')">x</button>
            <img src="${pic.data}" onclick="onSelectPic('${pic.id}')">
        </article>
        `
	})

	const elPics = document.querySelector('.pic-list')
	elPics.innerHTML = strHTMLs.join('')
}

function onRemovePic(picId) {
	removePic(picId)
	renderPics()
}

function onSelectPic(picId) {
	const elImg = new Image()
	const pic = getPicById(picId)

	elImg.src = pic.data
	elImg.onload = () => renderImg(elImg)
}

function renderImg(img) {
	gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
	gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

////////////////////////////////////

function onDownloadImg(elLink) {
	elLink.href = gElCanvas.toDataURL()
	// Set a name for the downloaded file
	elLink.download = 'my-perfect-img'
}

////////////////////////////////////////////////

// The next 2 functions handle IMAGE UPLOADING to img tag from file system:

function onImgInput(ev) {
    const elFilePicker = document.querySelector('.file-picker')
    loadImageFromInput(ev, renderImg)

    elFilePicker.value = ''
}

function loadImageFromInput(ev, onImageReady) {
	const reader = new FileReader()

	reader.onload = event => {
		const img = new Image()
        
		img.onload = () => onImageReady(img)
		img.src = event.target.result
	}
	reader.readAsDataURL(ev.target.files[0])
}

////////////////////////////////

// The next 2 functions handle UPLOADING img to facebook:

function onUploadImg(ev) {
	ev.preventDefault()
	const canvasData = gElCanvas.toDataURL('image/jpeg')

	// After a succesful upload, allow the user to share on Facebook
	function onSuccess(uploadedImgUrl) {
		const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
		console.log('encodedUploadedImgUrl:', encodedUploadedImgUrl)
		document.querySelector('.share-container').innerHTML = `
            <a href="${uploadedImgUrl}" target="_blank">Uploaded picture</a>
            <p>Image url: ${uploadedImgUrl}</p>
            <button class="btn-facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}')">
                Share on Facebook  
            </button>`
	}

	uploadImg(canvasData, onSuccess)
}

async function uploadImg(imgData, onSuccess) {
	const CLOUD_NAME = 'webify'
	const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

	const formData = new FormData()
	formData.append('file', imgData)
	formData.append('upload_preset', 'webify')

	try {
		const res = await fetch(UPLOAD_URL, {
			method: 'POST',
			body: formData,
		})
		const data = await res.json()
		console.log('Cloudinary response:', data)
		onSuccess(data.secure_url)
	} catch (err) {
		console.log(err)
	}
}

ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

const squareImgPaths = [
  'meme-imgs (square)/1.jpg',
  'meme-imgs (square)/2.jpg',
  'meme-imgs (square)/3.jpg',
  // add more file names here
];

function renderSquareImages() {
  const elContainer = document.querySelector('.select-img-container');
  squareImgPaths.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.onclick = () => onSelectImg(img);
    elContainer.appendChild(img);
  });
}

renderSquareImages();

function renderSquareImages(count) {
  const elContainer = document.querySelector('.select-img-container');
  for (let i = 1; i <= count; i++) {
    const img = document.createElement('img');
    img.src = `meme-imgs (square)/${i}.jpg`;
    img.onclick = () => onSelectImg(img);
    elContainer.appendChild(img);
  }
}

renderSquareImages(20);

img.src = `meme-imgs-square/${i}.jpg`;