// Update current date and time
function updateCurrentDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    document.getElementById('currentDateTime').textContent =
        now.toLocaleDateString('en-US', options);
}

// Update character count
function updateCharCount() {
    const input = document.getElementById('dateInput');
    const charCount = document.getElementById('charCount');
    charCount.textContent = `${input.value.length}/12`;
}

// Check if string contains only alphabetic characters
function isOnlyAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

// Check if string is alphanumeric (contains both letters and numbers)
function isAlphanumeric(str) {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/.test(str);
}

// Parse date from various formats
function parseDate(dateString) {
    // Remove any extra spaces
    dateString = dateString.trim();

    // Try different date formats
    const formats = [
        // YYYY-MM-DD
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
        // MM/DD/YYYY
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        // DD-MM-YYYY
        /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
        // MM-DD-YYYY
        /^(\d{1,2})-(\d{1,2})-(\d{4})$/
    ];

    for (let i = 0; i < formats.length; i++) {
        const match = dateString.match(formats[i]);
        if (match) {
            let year, month, day;

            if (i === 0) { // YYYY-MM-DD
                year = parseInt(match[1]);
                month = parseInt(match[2]) - 1; // JS months are 0-indexed
                day = parseInt(match[3]);
            } else if (i === 1 || i === 3) { // MM/DD/YYYY or MM-DD-YYYY
                month = parseInt(match[1]) - 1;
                day = parseInt(match[2]);
                year = parseInt(match[3]);
            } else if (i === 2) { // DD-MM-YYYY
                day = parseInt(match[1]);
                month = parseInt(match[2]) - 1;
                year = parseInt(match[3]);
            }

            const date = new Date(year, month, day);

            // Check if the date is valid (handles invalid dates like Feb 30)
            if (date.getFullYear() === year &&
                date.getMonth() === month &&
                date.getDate() === day) {
                return date;
            }
        }
    }

    return null;
}

// Validate the input
function validateInput() {
    const input = document.getElementById('dateInput').value.trim();
    const resultContainer = document.getElementById('result');

    if (!input) {
        showResult('Please enter a date.', 'error');
        return;
    }

    // Check if input contains only alphabetic characters
    if (isOnlyAlphabetic(input)) {
        showResult('Invalid input: Only characters cannot be the input. Please enter a valid date.', 'error');
        return;
    }

    // Check if input is alphanumeric (contains both letters and numbers)
    if (isAlphanumeric(input)) {
        showResult('Invalid input: Cannot include characters. Please enter a valid date format.', 'error');
        return;
    }

    // Try to parse the date
    const parsedDate = parseDate(input);

    if (!parsedDate) {
        showResult('Invalid date format. Please use one of the supported formats.', 'error');
        return;
    }

    // Check if the date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    if (parsedDate <= today) {
        showResult('Invalid date: Please enter a future date (after today).', 'error');
        return;
    }

    // If we reach here, the date is valid and in the future
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formattedDate = parsedDate.toLocaleDateString('en-US', options);

    showResult(`✅ Valid future date: ${formattedDate}`, 'success');
}

// Show result with animation
function showResult(message, type) {
    const resultContainer = document.getElementById('result');
    resultContainer.textContent = message;
    resultContainer.className = `result-container ${type}`;

    // Trigger animation
    setTimeout(() => {
        resultContainer.classList.add('show');
    }, 10);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Update current date/time immediately and then every second
    updateCurrentDateTime();
    setInterval(updateCurrentDateTime, 1000);

    // Character count update
    const dateInput = document.getElementById('dateInput');
    dateInput.addEventListener('input', updateCharCount);

    // Validate button
    document.getElementById('validateBtn').addEventListener('click', validateInput);

    // Enter key validation
    dateInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            validateInput();
        }
    });

    // Clear result when user starts typing
    dateInput.addEventListener('input', function () {
        const resultContainer = document.getElementById('result');
        resultContainer.classList.remove('show');
    });
});
