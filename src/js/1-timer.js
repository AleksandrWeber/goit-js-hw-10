import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// DOM elements
const datetimePickerInput = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const timerDisplay = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

// State
let userSelectedDate = null;
let timerInterval = null;

// Helper functions
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateDisplay(milliseconds) {
  const { days, hours, minutes, seconds } = convertMs(milliseconds);

  timerDisplay.days.textContent = addLeadingZero(days);
  timerDisplay.hours.textContent = addLeadingZero(hours);
  timerDisplay.minutes.textContent = addLeadingZero(minutes);
  timerDisplay.seconds.textContent = addLeadingZero(seconds);
}

function startTimer() {
  // Disable input and button during countdown
  datetimePickerInput.disabled = true;
  startButton.disabled = true;

  const startTime = Date.now();

  timerInterval = setInterval(() => {
    const currentTime = Date.now();
    const timeRemaining = userSelectedDate.getTime() - currentTime;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      updateDisplay(0);
      datetimePickerInput.disabled = false;
      return;
    }

    updateDisplay(timeRemaining);
  }, 1000);
}

// Initialize flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = new Date();

    if (selectedDate <= now) {
      userSelectedDate = null;
      startButton.disabled = true;
      iziToast.show({
        title: 'Error',
        message: 'Please choose a date in the future',
        color: 'red',
        position: 'topRight',
      });
      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr(datetimePickerInput, options);

// Event listeners
startButton.addEventListener('click', startTimer);
