const timerButtons = document.querySelectorAll('.timer__button');
const timerInputField = document.querySelector('[name=minutes]');
const form = document.querySelector('#custom')
const displayTimeLeftElem = document.querySelector('.display__time-left');
const displayEndTimeElem = document.querySelector('.display__end-time');
let timeInterval;

function displayTimer(timerValue) {
    const mins = Math.floor(timerValue / 60);
    const secs = String(timerValue % 60).padStart(2, '0');
    const display = `${mins}:${secs}`;
    document.title = display;
    displayTimeLeftElem.textContent = display;
}

function displayEndTime(totalSeconds) {
    // Get the starting time nad convert it into seconds
    const startTime = new Date();
    const startHours = startTime.getHours();
    const startMins = startTime.getMinutes();
    const startSecs = startTime.getSeconds();
    
    const startSeconds = startHours * 3600 + startMins * 60 + startSecs;

    // Calculate the ending time in seconds
    let endSeconds = startSeconds + Number(totalSeconds);

    // Convert the ending time to humanly readable format
    const endHours = Math.floor(endSeconds / 3600);
    endSeconds %= 3600;
    const endMins = Math.floor(endSeconds / 60);
    endSeconds %= 60;
    const endSecs = endSeconds; 

    displayEndTimeElem.textContent = `Be back at ${endHours}:${endMins}:${endSecs}`;
}

function handleTimer(totalSeconds) {
    if (timeInterval) {
        clearInterval(timeInterval);
    }
    timerValue = Number(totalSeconds);
    displayTimer(timerValue);

    // Make the timer count back
    timeInterval = setInterval(() => {
        displayTimer(timerValue - 1);
        if (timerValue > 1) {
            return timerValue -= 1;
        }
    }, 1000);

    // Display session end time
    displayEndTime(totalSeconds);
}

timerButtons.forEach(button => button.addEventListener('click', (e) => {
    handleTimer(e.target.dataset.time);
}));
timerInputField.addEventListener('change', (e) => {
    timerInputField.textContent = "";
    handleTimer(e.target.value * 60);
});
form.addEventListener('submit', (e) => {
    e.preventDefault();
});
