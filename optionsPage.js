const updateEnabledTextFromDom = () => {
  let workWeekDays = [];
  iterateThroughWorkWeekCheckboxes(input => {
    if (input.checked) workWeekDays.push(input.id)
  });
  const startTime = getFormattedTimeFromDom(`start`);
  const endTime = getFormattedTimeFromDom(`end`);
  updateEnabledText(workWeekDays, startTime, endTime);
};

const bindHandler = (event, el, handler) =>
  el.addEventListener(event, handler);

const bindHandlerById = (event, id, handler) =>
  bindHandler(event, document.getElementById(id), handler);



// Parses the provided time string then returns a new string that's 1 min later
const addOneMinute = timeString => {
  const [hours, minutes] = timeStringToHoursAndMinutes(timeString);
  // NOTE: ensureStartBeforeEnd ensures hours/minutes is never 23:59
  return minutes === 59
    ? `${zeroPad(hours + 1)}:00` // eg. 2:59 => 3:00
    : `${zeroPad(hours)}:${zeroPad(minutes + 1)}`; // eg: 2:42 => 2:43
};

// Parses the provided time string then returns a new string that's 1 min sooner
const subtractOneMinute = timeString => {
  const [hours, minutes] = timeStringToHoursAndMinutes(timeString);
  // NOTE: ensureStartBeforeEnd ensures hours/minutes is never 0:00
  return minutes
    ? `${zeroPad(hours)}:${zeroPad(minutes - 1)}` // eg. 2:42 => 1:41
    : `${zeroPad(hours - 1)}:${59}`; // eg: 2:00 => 1:59
};

// Determines whether the start time is before the end time
const startIsBeforeEnd = (start, end) => toMinutes(start) < toMinutes(end);

// Handler for time input changes to ensure the start time comes before the end
const ensureStartBeforeEnd = (e) => {
  const startEl = document.getElementById(`weekly-start`);
  const endEl = document.getElementById(`weekly-end`);
  let startTime = getTimeFromDom(`start`);
  let endTime = getTimeFromDom(`end`);

  if (startIsBeforeEnd(startTime, endTime)) return;

  // Problem #1: Start time is at max time, so no end time is possible
  if (startTime === `23:59`) {
    startTime = `23:58`;
    startEl.value = startTime;
  }
  // Problem #2: End time is at min time, so no start time is possible
  if (endTime === `00:00`) {
    endTime = `00:01`;
    endEl.value = endTime;
  }

  if (e.target.id === `weekly-end`) {
    // Problem #3: the end time was changed to be before/equal to the start time
    endEl.value = addOneMinute(startTime);

    // NOTE: Alerts don't work because (it seems) I'm doing embedded options
    // alert(`The selected end time must come after the selected start time.`);
  } else if  (e.target.id === `weekly-start`) {
    // Problem #4: the start time was changed to be after/equal to the end time
    startEl.value = subtractOneMinute(endTime);

    // NOTE: Alerts don't work because (it seems) I'm doing embedded options
    // alert(`The selected start time must come before the selected end time.`);
  }
};

bindHandlerById(`change`, `weekly-start`, ensureStartBeforeEnd);
bindHandlerById(`change`, `weekly-end`, ensureStartBeforeEnd);
bindHandlerById(`click`, `weekly-start`, ensureStartBeforeEnd);
bindHandlerById(`click`, `weekly-end`, ensureStartBeforeEnd);

// When the user changes the time/day inputs update the enabled summary text
iterateThroughWorkWeekCheckboxes(checkbox => {
  bindHandler (`click`, checkbox, updateEnabledTextFromDom);
});

bindHandlerById(`change`, `weekly-end`, updateEnabledTextFromDom);
bindHandlerById(`change`, `weekly-start`, updateEnabledTextFromDom);
bindHandlerById(`click`, `weekly-end`, updateEnabledTextFromDom);
bindHandlerById(`click`, `weekly-start`, updateEnabledTextFromDom);

const handleRadioClick = e => {
  const action = getRadioValue(`action`);
  const messageEl = document.getElementById(`confirmationMessageContainer`);
  toggleEl(messageEl, action === `confirm`);
};
iterateThroughActionRadioButtons(actionRadio => {
  bindHandler(`click`, actionRadio, handleRadioClick);
});