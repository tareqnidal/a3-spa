import { createAndOpenWindow } from './main.js'

/**
 * Function to generate the HTML for the chat interface.
 *  @returns {string} HTML string for the chat interface layout.
 */
function getChatHtml () {
  return `
    <div class="username-container" style="display: block;">
      <input type="text" id="username-input" placeholder="Enter your username" />
      <button id="username-submit">Enter Chat</button>
    </div>
    <div class="chat-container" style="display: none;">
      <div class="chat-messages"></div>
      <div class="chat-input-container">
        <textarea class="chat-input"></textarea>
        <select class="emoji-picker">
        <option value="">Select Emoji</option>
        <option value="😀">😀</option>
        <option value="😢">😢</option>
        <option value="😂">😂</option>
        <option value="😍">😍 </option>
        <option value="😊">😊</option>
        <option value="😎">😎</option>
        <option value="😒">😒</option>
        <option value="😱">😱 -</option>
        <option value="👍">👍</option>
        <option value="👎">👎</option>
        <option value="👏">👏</option>
        <option value="💪">💪</option>
        </select>
      </div>
    </div>
  `
}

// Establishing WebSocket connection
const socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')
const globalMessageHistory = []
const onlineUsers = new Set()

// Handling incoming WebSocket messages
socket.onmessage = function (event) {
  const messageData = JSON.parse(event.data)
  // Omit heartbeat or server messages
  if (messageData.type === 'heartbeat' || messageData.username === 'Server') {
    return
  }
  // Handle user updates
  if (messageData.type === 'user-update') {
    if (messageData.action === 'joined') {
      onlineUsers.add(messageData.username)
    } else if (messageData.action === 'left') {
      onlineUsers.delete(messageData.username)
    }
  } else {
    globalMessageHistory.push(messageData)
    if (globalMessageHistory.length > 20) {
      globalMessageHistory.shift()
    }
    updateAllChatWindows()
  }
}

/**
 * Updates all chat windows with the latest messages.
 */
function updateAllChatWindows () {
  document.querySelectorAll('.chat-messages').forEach(chatMessages => {
    chatMessages.innerHTML = globalMessageHistory.map(msg =>
      `<p><b>${msg.username || 'Anonymous'}:</b> ${msg.data}</p>`
    ).join('')
    // Scroll to the bottom of the chat messages container
    chatMessages.scrollTop = chatMessages.scrollHeight
  })
}

/**
 * Initializes the chat interface for a given chat window.
 * Sets up the event listener for the username submission.
 * toggles the visibility of the username and chat containers.
 * and calls 'setupChatInterface' upon successful username submission.
 * @param {Element} chatWindow - The DOM element representing the chat window.
 */
function initializeChat (chatWindow) {
  const usernameInput = chatWindow.querySelector('#username-input')
  const usernameSubmit = chatWindow.querySelector('#username-submit')
  const usernameContainer = chatWindow.querySelector('.username-container')
  const chatContainer = chatWindow.querySelector('.chat-container')

  usernameSubmit.addEventListener('click', () => {
    const username = usernameInput.value.trim()
    if (username) {
      localStorage.setItem('username', username)
      usernameContainer.style.display = 'none'
      chatContainer.style.display = 'block'
      setupChatInterface(username, chatContainer)
    } else {
      alert('Please enter a username.')
    }
  })
}

/**
 * Setup chat interface components
 * @param {string} username - The username of the user in the chat session.
 * @param {Element} chatContainer - The DOM element representing the container for chat messages and input.
 */
function setupChatInterface (username, chatContainer) {
  const chatInput = chatContainer.querySelector('.chat-input')
  const emojiPicker = chatContainer.querySelector('.emoji-picker')
  const chatMessages = chatContainer.querySelector('.chat-messages')

  // Populate chat with historical messages
  chatMessages.innerHTML = globalMessageHistory.map(msg =>
    `<p><b>${msg.username || 'Anonymous'}:</b> ${msg.data}</p>`
  ).join('')

  // Function to handle sending messages
  const sendMessage = () => {
    const message = chatInput.value
    if (message.trim() !== '') {
      socket.send(JSON.stringify({
        type: 'message',
        data: message,
        username: username || 'Anonymous',
        channel: 'my, not so secret, channel',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }))
      chatInput.value = ''
      emojiPicker.value = '' // Reset emoji picker to default state
    }
  }

  // Attach event listeners
  chatInput.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) { // Enter key
      e.preventDefault()
      sendMessage()
    }
  })

  // Event listener for emoji selection
  emojiPicker.addEventListener('change', () => {
    chatInput.value += emojiPicker.value
    emojiPicker.value = ''
  })
}

// Event listener for opening the chat window
document.querySelector('.btn-chat').addEventListener('click', function () {
  // Create a new chat window and get a reference to it
  const chatWindowHtml = getChatHtml()
  const newChatWindow = createAndOpenWindow('Chat', chatWindowHtml)

  // Initialize the chat for the newly created window
  initializeChat(newChatWindow.querySelector('.window-content'))
})
