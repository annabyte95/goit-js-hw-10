import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;

const startBtn = document.querySelector("[data-start]");
startBtn.disabled = true;
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");
const input = document.querySelector("#datetime-picker");

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
        startBtn.disabled = true;
        
        iziToast.error({
            message: 'Please choose a date in the future',
        });
    } else {
        startBtn.disabled = false;
    }
  },
};

const picker = flatpickr("#datetime-picker", options);

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    input.disabled = true;
    picker.set("clickOpens", false);

    const timeId = setInterval(() => {
    const timeLeft = userSelectedDate - new Date();

    if (timeLeft <= 0) {
    clearInterval(timeId);

    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";

    input.disabled = false;
    picker.set('clickOpens', true);
    startBtn.disabled = true;

    return;
}
    const timerData = convertMs(timeLeft);

    daysEl.textContent = String(timerData.days).padStart(2, "0");
    hoursEl.textContent = String(timerData.hours).padStart(2, "0");
    minutesEl.textContent = String(timerData.minutes).padStart(2, "0");
    secondsEl.textContent = String(timerData.seconds).padStart(2, "0");
    }, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
