// Checks one of the work week day checkboxes
const checkDay = day => document.getElementById(day).checked = true;

// Sets the input[time] value for the extension's start/end time
const setWeeklyStartOrEnd = (startOrEnd, { hours, minutes, amPm }) => {
  let actualHours = zeroPad(get24HoursFromTimeObject({ hours, amPm }));
  console.log(startOrEnd, { hours, minutes, amPm }, `${actualHours}:${zeroPad(minutes)}`)
  return document.getElementById(`weekly-${startOrEnd}`).value =
    `${actualHours}:${zeroPad(minutes)}`;
};

// TODO: Change "workWeekEnd/Start" everywhere to just "weekEnd/Start"

// Restore option values to the UI from the preferences stored in chrome.storage
document.addEventListener('DOMContentLoaded', () =>
  getOptionsValues(({ action, confirmationMessage, days, end, start }) => {
      days.forEach(checkDay);

      setWeeklyStartOrEnd(`start`, start);
      setWeeklyStartOrEnd(`end`, end);

      updateEnabledText(days, start, end);

      iterateThroughActionRadioButtons(actionRadio => {
        if (actionRadio.value === action) actionRadio.checked = true;
      });
      const messageEl = document.getElementById(`confirmationMessage`);
      messageEl.value = confirmationMessage;
      const container = document.getElementById(`confirmationMessageContainer`);
      toggleEl(container, action === `confirm`);
    }));
