'use strict'

var gElCanvas
var gCtx

var gImgs = [
  { id: 1, url: "imgs/1.jpg", keywords: ["happy", "smile"] },
  { id: 2, url: "imgs/2.jpg", keywords: ["crazy", "funny"] },
  { id: 3, url: "imgs/3.jpg", keywords: ["sad", "cry"] },
]

var gMeme = {
  selectedImgId: 5,
  txts: [
    {
      line: "I never eat Falafel",
      size: 20,
      align: "left",
      color: "red",
    },
  ],
}

function onInit() {
  gElCanvas = document.querySelector("canvas")
  gCtx = gElCanvas.getContext("2d")
  resizeCanvas()
  addListeners()
  renderGallery()
}

function renderGallery() {
  const strHTMLs = gImgs.map(
    (img) => `<img src="${img.url}" onclick="onSelectMemeImg(this)" />`,
  )
  document.querySelector(".select-img-container").innerHTML = strHTMLs.join("")
}

function resizeCanvas() {
  const elContainer = document.querySelector(".canvas-container")
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
}

function onSelectPic(picId) {
  gCtx.drawImage(picId, 0, 0, gElCanvas.width, gElCanvas.height)
}

function onSelectMemeImg(elImg) {
  renderImg(elImg)
}

function renderImg(img) {
  gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
  gMeme.txts.forEach((txt, idx) => renderText(txt, idx))
}

function renderText(txt, lineIdx) {
  gCtx.font = `${txt.size}px Arial`
  gCtx.fillStyle = txt.color
  gCtx.textAlign = txt.align
  const x =
    txt.align === "center"
      ? gElCanvas.width / 2
      : txt.align === "right"
        ? gElCanvas.width - 10
        : 10
  const y = 30 + lineIdx * (txt.size + 10)
  gCtx.fillText(txt.line, x, y)
}

function addListeners() {
  addMouseListeners()
  addTouchListeners()
}

function addMouseListeners() {
  gElCanvas.addEventListener("mousedown", onDown)
  gElCanvas.addEventListener("mousemove", onMove)
  gElCanvas.addEventListener("mouseup", onUp)
}

function addTouchListeners() {
  gElCanvas.addEventListener("touchstart", onDown)
  gElCanvas.addEventListener("touchmove", onMove)
  gElCanvas.addEventListener("touchend", onUp)
}

function onDown() {}

function onMove() {}

function onUp() {}