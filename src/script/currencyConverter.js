// currencyConverter.js
import {
  createAndOpenWindow
} from './main.js'

/**
 * Generates HTML content for a simple currency converter interface.
 * @returns {string} A string containing the HTML structure for the currency converter.
 */
function getCurrencyConverterHtml () {
  return `
    <div class="currency-converter">
        <input type="number" id="amount" placeholder="Amount" />
        <select id="fromCurrency">
            <!-- Currency options will be loaded here -->
        </select>
        <select id="toCurrency">
            <!-- Currency options will be loaded here -->
        </select>
        <button id="convert">Convert</button>
        <div id="result">Converted Amount: <span id="convertedAmount"></span></div>
    </div>
  `
}

document.addEventListener('DOMContentLoaded', function () {
  const currencyConverterButton = document.getElementById('btn-currency-converter')
  if (currencyConverterButton) {
    currencyConverterButton.addEventListener('click', function () {
      const newCurrencyConverterWindow = createAndOpenWindow('Currency Converter', getCurrencyConverterHtml())
      loadCurrencyConverter(newCurrencyConverterWindow.querySelector('.window-content'))
    })
  }
})

/**
 * Loads the currency converter functionality into the specified window content.
 * @param {HTMLElement} windowContent - The HTML element into which the currency converter
 *                                      will be loaded. This element should contain the
 *                                      necessary structure as defined in getCurrencyConverterHtml.
 */
export function loadCurrencyConverter (windowContent) {
  fetch('https://api.exchangerate-api.com/v4/latest/USD')
    .then(response => response.json())
    .then(data => {
      populateCurrencyOptions(windowContent, data.rates)
    })
    .catch(error => {
      console.error('Error fetching currency list:', error)
      // Handle errors, maybe show an error message to the user
    })

  const convertButton = windowContent.querySelector('#convert')
  convertButton.addEventListener('click', function () {
    const amount = windowContent.querySelector('#amount').value
    const fromCurrency = windowContent.querySelector('#fromCurrency').value
    const toCurrency = windowContent.querySelector('#toCurrency').value

    convertCurrency(amount, fromCurrency, toCurrency, windowContent)
  })
}

/**
 * Populates the 'from' and 'to' currency dropdowns in the provided window content
 * @param {HTMLElement} windowContent - The HTML element that contains the dropdowns
 *                                      for the currency converter. This should be the
 *                                      same element that is used in loadCurrencyConverter.
 * @param {object} rates - An object containing currency rates where keys are currency
 *                         codes (e.g., USD, EUR) and values are the corresponding rates.
 *                         These rates are used to populate the options in the currency
 *                         dropdowns.
 */
function populateCurrencyOptions (windowContent, rates) {
  const fromCurrencySelect = windowContent.querySelector('#fromCurrency')
  const toCurrencySelect = windowContent.querySelector('#toCurrency')

  Object.keys(rates).forEach(currency => {
    const option = new Option(currency, currency)
    fromCurrencySelect.add(option.cloneNode(true))
    toCurrencySelect.add(option)
  })
}

/**
 * Converts a specified amount from one currency to another and displays the result.
 * @param {number} amount - The amount of money to be converted.
 * @param {string} fromCurrency - The currency code (e.g., USD, EUR) of the amount to be converted from.
 * @param {string} toCurrency - The currency code (e.g., USD, EUR) of the currency to convert to.
 * @param {HTMLElement} windowContent - The HTML element that contains the interface
 *                                      where the result should be displayed.
 */
function convertCurrency (amount, fromCurrency, toCurrency, windowContent) {
  const amountInput = windowContent.querySelector('#amount')
  if (!amount || isNaN(amount)) {
    // If the amount is empty or not a number, set the border color to red
    amountInput.style.borderColor = 'red'
    return // Exit the function without doing the conversion
  } else {
    // Reset the border color if the input is valid
    amountInput.style.borderColor = '' // Resets to default style
  }

  fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
    .then(response => response.json())
    .then(data => {
      const rate = data.rates[toCurrency]
      const convertedAmount = (amount * rate).toFixed(2)
      windowContent.querySelector('#convertedAmount').innerText = `${convertedAmount} ${toCurrency}`
    })
    .catch(error => {
      console.error('Error fetching currency data:', error)
      // Handle errors, maybe show an error message to the user
    })
}
