'use strict'

var gElcanvas
var gCtx

function onInit() {
	gElcanvas = document.querySelector("canvas")
	gCtx = gElcanvas.getContext("2d")
	resizeCanvas()
	renderMeme()
}

function renderMeme() {
	onSelectPic(picId)
	renderImg(img)
	renderText(text)
}

function resizeCanvas() {
	const elContainer = document.querySelector('.canvas-container')   
	gElcanvas.width = elContainer.offsetWidth
    gElcanvas.height = elContainer.offsetHeight
}

function onSelectPic(picId) {
	gCtx.drawImage(picId, 0, 0, gCanvas.width, gCanvas.height)
}

function renderImg(img) {
	 gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderText(text) {
	 gElCanvas.height = (Text.naturalHeight / text.naturalWidth) * gElCanvas.width
    gCtx.drawText(text, 0, 0, gElCanvas.width, gElCanvas.height)
}

function addListeners() {
	addMouseListeners()
	addTouchListeners()
}

function addMouseListeners() {
	gElcanvas.addEventlistener("mousedown", onDown)
	gElcanvas.addEventlistener("mousemove", onMove)
	gElcanvas.addEventlistener("mouseup", onUp)
}

function addTouchListeners() {
	gElcanvas.addEventlistener("touchstart", onDown)
	gElcanvas.addEventlistener("touchmove", onMove)
	gElcanvas.addEventlistener("touchend", onUp)
}