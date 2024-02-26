const cols = document.querySelectorAll('.col')

// switch color by pressing spacebar
document.addEventListener('keydown', (event) => {
  event.preventDefault()
  if (event.code.toLowerCase() === 'space') {
    setRandomColors()
  }
})

document.addEventListener('click', (event) => {
  // listen to the click event and look for exactly those elements on the page that have data-type 'lock'
  const type = event.target.dataset.type

  if (type === 'lock') {

    // now it is necessary to change the class specifically for the 'i' tag
    const node =
      // immediately convert to lowercase
      // and if it was a button, then you need to get the first child
      // now if you look at the node - it's always an icon
      event.target.tagName.toLowerCase() === 'i'
        ? event.target
        : event.target.children[0]

    // using the toggle method to change the class
    node.classList.toggle('fa-lock-open')
    node.classList.toggle('fa-lock')
  } else if (type === 'copy') {
    copyToClipboard(event.target.textContent)
  }
})

// function to get random colors
function generateRandomColor() {
  // RGB
  // #FF0000
  // #00FF00
  // #0000FF

  const hexCodes = '0123456789ABCDEF'
  let color = ''
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
  }
  return '#' + color
}


// function to copy on click
function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

// connecting chroma library to the project


// function to output random colors
function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : []

  cols.forEach((col, index) => {
    // if the icon is locked - do not change the color
    const isLocked = col.querySelector('i').classList.contains('fa-lock')

    const text = col.querySelector('h2')
    const button = col.querySelector('button')

    if (isLocked) {
      colors.push(text.textContent)
      return
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random()

    if (!isInitial) {
      colors.push(color)
    }

    text.textContent = color
    col.style.background = color

    setTextColor(text, color)
    setTextColor(button, color)
  })

  updateColorsHash(colors)
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance()
  text.style.color = luminance > 0.5 ? 'black' : 'white'
}

// creating an array of colors so that it can be passed to the designer
// by creating a colors variable, I write colors in the setRandomColors function
function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1)
    })
    .join('-')
}

// getting colors from the hash
function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map((color) => '#' + color)
  }
  return []
}

setRandomColors(true)
