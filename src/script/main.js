// main.js

let zIndexCounter = 1 // Global zIndex counter

/**
 * Enables dragging functionality for a specified DOM element and brings it to the front by adjusting its z-index.
 * @param {HTMLElement} elem - The HTML element to be made draggable. It can be a window, a dialog box, etc.
 */
function makeDraggable (elem) {
  let pos1 = 0
  let pos2 = 0
  let pos3 = 0
  let pos4 = 0

  const bringToFront = () => {
    elem.style.zIndex = zIndexCounter++
  }

  // Function for handling mouse down on the entire element
  const onMouseDown = (e) => {
    e = e || window.event
    bringToFront()
  }

  const dragMouseDown = (e) => {
    e = e || window.event
    e.preventDefault()
    bringToFront() // Also bring to front when title-bar is clicked

    // Get the initial mouse cursor position
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag
  }

  // Bind the onMouseDown function to the entire element
  elem.onmousedown = onMouseDown

  // Bind the dragMouseDown function to the title bar
  const titleBar = elem.querySelector('.title-bar')
  if (titleBar) {
    titleBar.onmousedown = (e) => {
      dragMouseDown(e)
      e.stopPropagation() // Prevent the onMouseDown event of the parent element
    }
  }

  const elementDrag = (e) => {
    e = e || window.event
    e.preventDefault()

    // Calculate the new cursor position
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY

    // Set the element's new position
    let newTop = elem.offsetTop - pos2
    let newLeft = elem.offsetLeft - pos1

    // Boundary check for top and left
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - elem.offsetHeight))
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - elem.offsetWidth))

    elem.style.top = newTop + 'px'
    elem.style.left = newLeft + 'px'
  }

  const closeDragElement = () => {
    // Stop moving when mouse button is released
    document.onmouseup = null
    document.onmousemove = null
  }
}

/**
 * Creates and opens a new draggable window on the 'desktop'.
 * @param {string} title - The title of the new window, which is displayed in the title bar at the top of the window.
 * @param {string} content - The HTML content to be displayed inside the window's content area. This can be any valid HTML, such as forms, text, images, etc.
 * @returns {HTMLElement} The newly created window element, allowing for additional manipulation or reference outside of this function.
 */
export function createAndOpenWindow (title, content) {
  const newWindow = document.createElement('div')
  newWindow.className = 'window'
  newWindow.style.zIndex = zIndexCounter++
  newWindow.innerHTML = `
        <div class="title-bar">
            <span class="title">${title}</span>
            <span class="close-icon">X</span>
        </div>
        <div class="window-content">
            ${content}
        </div>
    `

  document.getElementById('desktop').appendChild(newWindow)
  newWindow.style.left = Math.random() * 100 + 'px'
  newWindow.style.top = Math.random() * 100 + 'px'
  // Set focus to the window content
  newWindow.querySelector('.window-content').focus()
  makeDraggable(newWindow)

  newWindow.querySelector('.close-icon').addEventListener('click', () => newWindow.remove())

  // Set focus to a specified element within the window, like the first button or input
  const focusableElement = newWindow.querySelector('button, input, [tabindex]:not([tabindex="-1"])')
  if (focusableElement) {
    focusableElement.focus()
  }
  return newWindow // Return the newly created window element
}
