const cols = document.querySelectorAll('.col')

// переключение цвета путем нажатия пробела
document.addEventListener('keydown', (event) => {
  event.preventDefault()
  if (event.code.toLowerCase() === 'space') {
    setRandomColors()
  }
})

document.addEventListener('click', (event) => {
  // слушаю событие клик и ищу именно те элементы на странице, у которых есть data-type 'lock'
  const type = event.target.dataset.type

  if (type === 'lock') {

    // теперь нужно менять класс именно у тега i
    const node =
      // сразу перевожу в нижний регистр
      // а если это была кнопка, то нужно получить первого ребенка
      // теперь если посмотреть на node - это всегда иконка
      event.target.tagName.toLowerCase() === 'i'
        ? event.target
        : event.target.children[0]

    // при помощи метода toggle меняю класс
    node.classList.toggle('fa-lock-open')
    node.classList.toggle('fa-lock')
  } else if (type === 'copy') {
    copyToClickboard(event.target.textContent)
  }
})

// функция получения рандомных цветов
function gerenerateRandomColor() {
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


// функция копирования по клику
function copyToClickboard(text) {
  return navigator.clipboard.writeText(text)
}

// подключаю в проект библиотеку chroma


// функция выведения рандомных цветов
function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : []

  cols.forEach((col, index) => {
    // если иконка заблокирована - не менять цвет
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

// создую массив цветов для того, чтобы можно было передать дизайнеру
// создав переменную colors в нее записываю цвета в функции setRandomColors
function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1)
    })
    .join('-')
}

// получение цветов из хеша
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
