// Get the display element
const display = document.getElementById('display');
// Variable to store the current input/expression
let currentExpression = '';
// Flag to check if the last action was equals, to clear display on next number input
let lastActionWasEquals = false;

/**
 * Shows a custom message box instead of alert().
 * @param {string} message - The message to display.
 */
function showMessageBox(message) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    messageText.textContent = message;
    messageBox.style.display = 'flex'; // Show the message box
}

/**
 * Hides the custom message box.
 */
function hideMessageBox() {
    const messageBox = document.getElementById('messageBox');
    messageBox.style.display = 'none'; // Hide the message box
}

/**
 * Appends a character (number or operator) to the current expression.
 * @param {string} char - The character to append.
 */
function appendCharacter(char) {
    // If the last action was equals and a number is pressed, start a new calculation
    if (lastActionWasEquals && !isNaN(char)) {
        currentExpression = ''; // Clear previous result
        lastActionWasEquals = false;
    } else if (lastActionWasEquals && (char === '+' || char === '-' || char === '*' || char === '/')) {
        // If last action was equals and an operator is pressed, continue with the result
        lastActionWasEquals = false;
    } else if (lastActionWasEquals && char === '.') {
        // If last action was equals and dot is pressed, start a new calculation with "0."
        currentExpression = '0.'; // Start with "0."
        lastActionWasEquals = false;
        display.textContent = currentExpression; // Update display immediately
        return; // Exit to prevent double appending
    }

    // Prevent multiple decimal points in a single number
    if (char === '.') {
        // Check if there's already a decimal point in the current number segment
        const parts = currentExpression.split(/[\+\-\*\/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) {
            // If the last number already has a decimal, do nothing
            return;
        }
        if (currentExpression === '' || /[+\-*/]$/.test(currentExpression)) {
             // If display is empty or ends with an operator, prepend "0."
            currentExpression += '0.';
        } else {
            currentExpression += char;
        }
    } else {
        currentExpression += char;
    }

    display.textContent = currentExpression;
}

/**
 * Clears the display and resets the expression.
 */
function clearDisplay() {
    currentExpression = '';
    display.textContent = '0';
    lastActionWasEquals = false;
}

/**
 * Calculates the result of the current expression.
 */
function calculateResult() {
    if (currentExpression === '') {
        display.textContent = '0';
        return;
    }

    try {
        // Evaluate the expression using eval(). Be cautious with eval() in production for user inputs.
        // For a simple calculator, it's generally fine, but for complex apps, consider a custom parser.
        let result = eval(currentExpression);

        // Handle division by zero
        if (!isFinite(result)) {
            showMessageBox("Error: Division by zero or invalid operation.");
            currentExpression = ''; // Clear expression on error
            display.textContent = 'Error';
            lastActionWasEquals = true;
            return;
        }

        // Format result to a fixed number of decimal places if it's a float to avoid long decimals
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(8)); // Limit to 8 decimal places
        }

        display.textContent = result;
        currentExpression = result.toString(); // Set expression to result for chained operations
        lastActionWasEquals = true; // Set flag
    } catch (e) {
        showMessageBox("Error: Invalid expression.");
        currentExpression = ''; // Clear expression on error
        display.textContent = 'Error';
        lastActionWasEquals = true; // Set flag
    }
}

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if ((key >= '0' && key <= '9') || key === '.') {
        appendCharacter(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendCharacter(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevent default Enter behavior (e.g., form submission)
        calculateResult();
    } else if (key === 'Backspace') {
        currentExpression = currentExpression.slice(0, -1);
        display.textContent = currentExpression === '' ? '0' : currentExpression;
        lastActionWasEquals = false;
    } else if (key === 'Escape') {
        clearDisplay();
    }
});
