'use strict'

var gElCanvas
var gCtx

var gImgs = [
  { id: 1, url: "imgs/1.jpg", keywords: ["happy", "smile"] },
  { id: 2, url: "imgs/2.jpg", keywords: ["crazy", "funny"] },
  { id: 3, url: "imgs/3.jpg", keywords: ["sad", "cry"] },
  { id: 4, url: "imgs/4.jpg", keywords: ["slepping", "cat"] },
  { id: 5, url: "imgs/5.jpg", keywords: ["baby", "cute"] },
  { id: 6, url: "imgs/6.jpg", keywords: ["man", "history"] },
  { id: 7, url: "imgs/7.jpg", keywords: ["kid", "eyes"] },
  { id: 8, url: "imgs/8.jpg", keywords: ["clown", "fantazy"] },
  { id: 9, url: "imgs/9.jpg", keywords: ["kid", "scared"] },
  { id: 10, url: "imgs/10.jpg", keywords: ["president", "failed"] },
  { id: 11, url: "imgs/11.jpg", keywords: ["man", "hug"] },
  { id: 12, url: "imgs/12.jpg", keywords: ["man", "right"] },
  { id: 13, url: "imgs/13.jpg", keywords: ["man", "drink"] },
  { id: 14, url: "imgs/14.jpg", keywords: ["man", "mystry"] },
  { id: 15, url: "imgs/15.jpg", keywords: ["man", "hair"] },
  { id: 16, url: "imgs/16.jpg", keywords: ["man", "face"] },
  { id: 17, url: "imgs/17.jpg", keywords: ["man", "speach"] },
  { id: 18, url: "imgs/18.jpg", keywords: ["movie", "animation"] },
]

var gMeme = {
  selectedImgId: 3,
  txts: [
    {
      line: "I never eat Falafel",
      size: 20,
      align: "left",
      color: "red",
    },
  ],
}

function onSearch (elSearch) {
  var value = elSearch.value
  var filteredImgs = gImgs.filter(img => img.keywords.some((keyword) => keyword.includes(value)))
  console.log(filteredImgs);
  renderGallery(filteredImgs)
 
}

function onInit() {
  gElCanvas = document.querySelector("canvas")
  gCtx = gElCanvas.getContext("2d")
  resizeCanvas()
  addListeners()
  renderGallery()
}

function getImgIdxById (id) {
  return gImgs.findIndex(img => img.id === id)
}

function renderGallery(imgs = null) {
  const imgsToRender = imgs ? imgs : gImgs
  const strHTMLs = imgsToRender.map(
    (img) => `<img src="${img.url}" onclick="onSelectMemeImg(this)" />`,
  )
  document.querySelector(".select-img-container").innerHTML = strHTMLs.join("")
}

function resizeCanvas() {
  const elContainer = document.querySelector(".canvas-container")
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
}

function onSelectMemeImg(elImg) {
  renderImg(elImg)
}

function renderImg(img) {
  gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
  gMeme.txts.forEach((txt, idx) => renderText(txt, idx));
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

function getMeme() {
	return gMeme
}

function onInput(elTxt) {
	const meme = getMeme()
	const value = elTxt.value
	meme.txts[0].line = value
  const imgIdx = getImgIdxById(gMeme.selectedImgId)
  renderImg(gImgs[imgIdx])
 }

 function onDownloadImg(elLink) {
  const dataURL = gElCanvas.toDataURL('image/jpeg')
  elLink.href = dataURL
}

function onDown() {}

function onMove() {}

function onUp() {}