// memoryGame.js
import {
  createAndOpenWindow
} from './main.js'

class MemoryGame {
  constructor (windowContent) {
    this.windowContent = windowContent
    this.moves = 0
    this.timer = 0
    this.timerInterval = null
    this.currentFocusIndex = 0
    this.totalCards = 16 // Default total cards
    this.gridSize = { rows: 4, cols: 4 } // Default grid size
    this.openCards = []
    const pairsCount = this.totalCards / 2
    this.generateCardValues(pairsCount)

    this.bindEventListeners()
    this.startGame()
  }

  /**
   * Binds event listeners to various elements of the memory game.
   */
  bindEventListeners () {
    // Restart Button
    const restartButton = this.windowContent.querySelector('#restartButton')
    restartButton.addEventListener('click', () => this.startGame())

    // Grid Size Buttons
    const grid4x4Button = this.windowContent.querySelector('#grid4x4Button')
    grid4x4Button.addEventListener('click', () => this.setGridSize(4, 4))

    const grid2x2Button = this.windowContent.querySelector('#grid2x2Button')
    grid2x2Button.addEventListener('click', () => this.setGridSize(2, 2))

    const grid4x2Button = this.windowContent.querySelector('#grid4x2Button')
    grid4x2Button.addEventListener('click', () => this.setGridSize(4, 2))

    // Keydown event for navigation
    document.addEventListener('keydown', (e) => this.handleKeyDown(e))
  }

  /**
   * Sets the grid size for the memory game board and starts the game.
   * @param {number} rows - The number of rows in the grid.
   * @param {number} cols - The number of columns in the grid.
   */
  setGridSize (rows, cols) {
    this.gridSize = { rows, cols }
    this.updateGridLayout(cols)
    this.startGame()
    // Hide grid size buttons and show the game container
    const gridSizeButtons = this.windowContent.querySelector('.grid-size-buttons')
    gridSizeButtons.style.display = 'none'

    const gameContainer = this.windowContent.querySelector('.game-container')
    gameContainer.style.display = 'block'

    // Set focus to the game board
    const memoryBoard = this.windowContent.querySelector('#gameBoard')
    memoryBoard.focus()
  }
  /**
   * Updates the layout of the memory game board based on the number of columns.
   * @param {number} cols - The number of columns in the grid.
   */

  updateGridLayout (cols) {
    const memoryBoard = this.windowContent.querySelector('#gameBoard')
    memoryBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
  }

  /**
   * Initializes and starts a new game of memory.
   */
  startGame () {
    // Clear previous game settings
    clearInterval(this.timerInterval)
    this.memoryBoard = this.windowContent.querySelector('#gameBoard')
    this.memoryBoard.innerHTML = ''
    this.moves = 0
    this.updateMoveCounter()
    this.timer = 0
    this.updateTimerDisplay()
    this.timerInterval = setInterval(() => this.updateTimer(), 1000)

    // Reset and generate new game
    this.currentFocusIndex = 0
    this.totalCards = this.gridSize.rows * this.gridSize.cols

    // Generate card values and create card elements
    const pairsCount = this.totalCards / 2
    const cardValues = this.generateCardValues(pairsCount)
    cardValues.forEach((cardValue, index) => {
      const cardElement = this.createCardElement(cardValue, index)
      this.memoryBoard.appendChild(cardElement)
    })

    const memoryBoard = this.windowContent.querySelector('#gameBoard')
    memoryBoard.style.display = 'grid' // Ensure the board is visible
    // Reveal cards temporarily at the start of the game
    this.revealCardsTemporarily()
    // Reset the victory message
    const victoryMessage = this.windowContent.querySelector('.victory-message')
    victoryMessage.textContent = '' // Reset the text content
    victoryMessage.style.display = 'none' // Hide the victory message
  }

  //  Reveal cards temporarily
  revealCardsTemporarily () {
    const allCards = this.memoryBoard.querySelectorAll('.memory-tile')
    allCards.forEach(card => card.classList.add('flipped'))

    setTimeout(() => {
      allCards.forEach(card => card.classList.remove('flipped'))
    }, 2000) // 2000 milliseconds = 2 seconds
  }

  /**
   * Generates a shuffled array of card values for the memory game.
   * @param {number} pairsCount - The number of pairs of cards to generate.
   * @returns {Array} An array of shuffled card values.
   */
  generateCardValues (pairsCount) {
    const cardValues = []

    // Generate an array of image indices (assuming you have 8 unique images)
    const imageIndices = Array.from({ length: 8 }, (_, i) => i)

    // Randomly pick 'pairsCount' indices from the available images
    for (let i = 0; i < pairsCount; i++) {
      // Pick a random index and remove it from the array to avoid duplicates
      const randomIndex = Math.floor(Math.random() * imageIndices.length)
      const imageIndex = imageIndices.splice(randomIndex, 1)[0]
      cardValues.push(imageIndex, imageIndex) // Add the pair to the card values
    }

    // Shuffle the card values for randomness in layout
    return this.shuffle(cardValues)
  }

  /**
   * Creates a card element for the memory game.
   * @param {number} cardValue - The value associated with the card.
   * @param {number} index - The index of the card in the grid.
   * @returns {HTMLElement} The created card element.
   */
  createCardElement (cardValue, index) {
    const cardElement = document.createElement('div')
    cardElement.classList.add('memory-tile')

    // Determine the class to add based on cardValue
    const cardClass = `card${cardValue}`
    cardElement.classList.add(cardClass)

    // Create the front (hidden) and back (visible) of the card
    const cardFront = document.createElement('div')
    cardFront.classList.add('card-front')

    const cardBack = document.createElement('div')
    cardBack.classList.add('card-back')

    cardElement.appendChild(cardFront)
    cardElement.appendChild(cardBack)

    cardElement.dataset.value = cardValue
    cardElement.addEventListener('click', () => this.flipCard(cardElement))

    cardElement.tabIndex = 0 // Make the card focusable
    cardElement.dataset.index = index // Assign an index to each card

    return cardElement
  }

  /**
   * Flips a card on the memory game board.
   * @param {HTMLElement} card - The card element to flip.
   */
  flipCard (card) {
    if (this.openCards.length < 2 && !card.classList.contains('flipped')) {
      card.classList.add('flipped')
      this.openCards.push(card)

      if (this.openCards.length === 2) {
        setTimeout(this.checkForMatch.bind(this), 500) // Bind 'this' to ensure correct context
        this.moves++ // Increment moves
        this.updateMoveCounter() // Update move counter display
      }
    }
  }

  /**
   * Checks if the two currently flipped cards are a match.
   */
  checkForMatch () {
    const [firstCard, secondCard] = this.openCards

    if (firstCard.dataset.value === secondCard.dataset.value) {
      // Cards match
      firstCard.classList.add('match')
      secondCard.classList.add('match')
    } else {
      // Cards don't match
      firstCard.classList.remove('flipped')
      secondCard.classList.remove('flipped')
    }

    this.openCards = [] // Reset the openCards array for the next turn

    // Optionally, check if the game is over
    this.checkGameOver()
  }

  /**
   * Stops the game timer.
   */
  stopTimer () {
    clearInterval(this.timerInterval)
  }

  /**
   * Checks if the game is over (i.e., all pairs have been matched).
   */

  checkGameOver () {
    const allMatched = this.memoryBoard.querySelectorAll('.memory-tile.match').length
    if (allMatched === this.totalCards) {
      this.stopTimer() // Stop the timer

      // Hide the game board
      const memoryBoard = this.windowContent.querySelector('#gameBoard')
      memoryBoard.style.display = 'none'

      // Show the victory message
      setTimeout(() => {
        const victoryMessage = this.windowContent.querySelector('.victory-message')
        victoryMessage.textContent = 'Congratulations! You have matched all the cards!'
        victoryMessage.style.display = 'block' // Show victory message within the game container
      }, 500)
    }
  }

  /**
   * Handles keydown events for navigation and interaction within the game.
   * @param {Event} e - The keydown event object.
   */
  handleKeyDown (e) {
    const totalColumns = this.gridSize.cols
    const allCards = this.memoryBoard.querySelectorAll('.memory-tile')
    let focusedCardIndex = this.currentFocusIndex

    if (!this.windowContent.contains(document.activeElement)) {
      return // Do nothing if focus is outside the game board
    }

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault() // Prevent default page scroll
        focusedCardIndex = (focusedCardIndex + 1) % allCards.length
        break
      case 'ArrowLeft':
        e.preventDefault() // Prevent default page scroll
        focusedCardIndex = (focusedCardIndex - 1 + allCards.length) % allCards.length
        break
      case 'ArrowUp':
        e.preventDefault() // Prevent default page scroll
        focusedCardIndex = (focusedCardIndex - totalColumns + allCards.length) % allCards.length
        break
      case 'ArrowDown':
        e.preventDefault() // Prevent default page scroll
        focusedCardIndex = (focusedCardIndex + totalColumns) % allCards.length
        break
      case 'Enter':
        e.preventDefault() // Prevent default action on Enter
        this.flipCardIfNotFlipped(focusedCardIndex)
        return // Skip focusing the card to allow the flip animation to complete
    }

    this.focusCard(focusedCardIndex)
  }

  /**
   * Sets focus on a specific card in the game.
   * @param {number} index - The index of the card to focus.
   */
  focusCard (index) {
    const allCards = this.memoryBoard.querySelectorAll('.memory-tile')
    if (index >= 0 && index < allCards.length) {
      allCards[index].focus()
      this.currentFocusIndex = index // Update current focus index
    }
  }

  /**
   * Flips a card if it is not already flipped.
   * @param {number} index - The index of the card to flip.
   */
  flipCardIfNotFlipped (index) {
    const allCards = this.memoryBoard.querySelectorAll('.memory-tile')
    if (index >= 0 && index < allCards.length) {
      const card = allCards[index]
      if (!card.classList.contains('flipped')) {
        this.flipCard(card)
      }
    }
  }

  /**
   * Updates the timer for the game.
   */
  updateTimer () {
    this.timer++
    this.updateTimerDisplay()
  }

  /**
   * Updates the display showing the current time elapsed in the game.
   */
  updateTimerDisplay () {
    const minutes = Math.floor(this.timer / 60)
    const seconds = this.timer % 60
    const timerDisplay = this.windowContent.querySelector('#timer')
    timerDisplay.textContent = `Time: ${minutes}m ${seconds}s`
  }

  /**
   * Updates the move counter display in the game.
   */
  updateMoveCounter () {
    const moveCounter = this.windowContent.querySelector('#moveCounter')
    moveCounter.textContent = `Moves: ${this.moves}`
  }

  /**
   * Shuffles an array in place.
   * @param {Array} array - The array to shuffle.
   * @returns {Array} The shuffled array.
   */
  shuffle (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]] // Swap elements
    }
    return array
  }
}

/**
 * This function sets up and opens a memory game when called.
 */
function openMemory () {
  // Usage
  document.addEventListener('DOMContentLoaded', function () {
    const memoryGameButton = document.getElementById('btn-memory-game')
    if (memoryGameButton) {
      memoryGameButton.addEventListener('click', function () {
        const newMemoryGameWindow = createAndOpenWindow('Memory Game', getMemoryGameHtml())

        // Initially hide the game container and only show grid size buttons
        const gameContainer = newMemoryGameWindow.querySelector('.game-container')
        gameContainer.style.display = 'none'

        const gridSizeButtons = newMemoryGameWindow.querySelector('.grid-size-buttons')
        gridSizeButtons.style.display = 'block'

        return new MemoryGame(newMemoryGameWindow.querySelector('.window-content'))
      })
    }
  })
}

/**
 * Generates HTML content for a memory game interface.
 *  @returns {string} A string containing the HTML structure for the memory game interface.
 */
function getMemoryGameHtml () {
  return `
        <div class="grid-size-buttons">
          <button id="grid4x4Button">Create 4x4 Grid</button>
          <button id="grid2x2Button">Create 2x2 Grid</button>
          <button id="grid4x2Button">Create 4x2 Grid</button>
        </div>
        <div class="game-container">
          <div class="game-board" id="gameBoard" tabindex="0"></div>
          <div class="game-info">
            <span id="moveCounter">Moves: 0</span>
            <span id="timer">Time: 0m 0s</span>
            <button id="restartButton">Restart Game</button>
          </div>
          <div class="victory-message"></div>
        </div>
      `
}

openMemory()
