// Returns the time taken from either the start or end inputs
const getTimeFromDom = startOrEnd =>
  document.getElementById(`weekly-${startOrEnd}`).value;

// Returns time taken from either the start or end inputs with leading 0 removed
const getFormattedTimeFromDom = startOrEnd => {
  const rawTime = getTimeFromDom(startOrEnd);
  const [firstNumber, ...rest] = rawTime;
  return firstNumber === `0` ? rest.join(``) : rawTime;
};

// Sadly we can't do getElementsByName(`foo`).forEach, so use this instead
const iterateNodeList = (nodeList, func) => {
  for (let el of nodeList) {
    func(el);
  }
};

// Convenience function for iterating through the work week checkboxes
const iterateThroughWorkWeekCheckboxes = func =>
  iterateNodeList(document.getElementsByClassName(`work-week-day`), func);

// Convenience function for iterating through the action radio buttons
const iterateThroughActionRadioButtons = func =>
  iterateNodeList(document.getElementsByName(`action`), func);

// Returns the selected value for the radio buttons with the provided name
const getRadioValue = name => {
  let value;
  iterateNodeList(document.getElementsByName(name), radio => {
    if (radio.checked) value = radio.value;
  });
  return value;
};

// Hides or shows the provided element based on the provided "shown" boolean
const toggleEl = (el, shown) =>
  el.style.display = shown ? `block` : `none`;

// Uppercases the first character, ie. changes "foo bar" into "Foo bar"
const titleCase = original =>
  original.replace(/\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

// Time inputs expect "09:00", not "9:00"; this adds the leading 0
const zeroPad = hoursOrMinutes =>
  hoursOrMinutes < 10 ? `0${hoursOrMinutes}` : hoursOrMinutes;

// Given an object with time properties returns a string version of that time
const formatTimeObject = ({ hours, minutes, amPm }) =>
  `${hours}:${minutes} ${amPm}`;

// Converts a time string from an input (eg 13:05) into human time (eg. 1:05PM)
const formatTimeString = timeString => {
  const [hours, minutes] = timeStringToHoursAndMinutes(timeString);
  return hours > 12
    ? `${hours - 12}:${zeroPad(minutes)} PM`
    : timeString + ` AM`;
};

// Generates a time string (with AM/PM) from the provided object or string
// (object during initial load, string during operation, from time input)
const formatTime = time =>
  typeof time === `object` ? formatTimeObject(time) : formatTimeString(time);


// Updates the text that shows which days/times the extension is enabled for
const updateEnabledText = (workWeekDays, start, end) => {
  const baseTextEl = document.getElementById(`baseText`);
  const daysText = `${workWeekDays.map(titleCase).join(', ')}`;
  const startText = formatTime(start);
  const endText = formatTime(end);
  baseTextEl.innerText = `${daysText}: ${startText} - ${endText}`;
};
