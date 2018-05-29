const SECOND = 1000;

const wait = (func, ms) => setTimeout(func, ms);

// After we save, show some "you just saved!" text for a fraction of a second
const informUserOfOptionsSave = () => {
  // Update status to let user know options were saved.
  const statusEl = document.getElementById('status');
  statusEl.textContent = 'Options Saved!';
  wait(() => statusEl.textContent = '', 2 * SECOND);
};

// Returns an array of the currently-checked weekdays
const getWorkWeekDaysFromDom = () => {
  const days = [];
  iterateThroughWorkWeekCheckboxes(checkbox => {
    if (checkbox.checked) days.push(checkbox.id);
  });
  return days;
};

// Converts the time string from a time input into a time object
const getParsedTimeFromDom = startOrEnd => {
  const timeString = getTimeFromDom(startOrEnd);
  const [hours, minutes] = timeStringToHoursAndMinutes(timeString);
  return {
    hours: hours > 12 ? hours - 12 : hours,
    minutes,
    amPm: hours > 12 ? `PM` : `AM`
  };
};

// Saves options from the UI to chrome.storage when the "Save" button is clicked
bindHandler('click', document.getElementById('save'), () => {
    chrome.storage.sync.set({
      action: getRadioValue(`action`),
      confirmationMessage: document.getElementById(`confirmationMessage`).value,
      workWeekDays: JSON.stringify(getWorkWeekDaysFromDom()),
      workWeekEnd: JSON.stringify(getParsedTimeFromDom(`end`)),
      workWeekStart: JSON.stringify(getParsedTimeFromDom(`start`)),
    }, informUserOfOptionsSave);
    window.close();
  }
);
