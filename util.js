// default setting values (9-5 Mon-Fri)
const defaultValues = {
  action: `prohibit`,
  confirmationMessage: `You are currently blocked from commenting on the Web.` +
  `  Would you like to temporarily disable blocking?`,
  workWeekDays: JSON.stringify([`mon`, `tues`, `wed`, `thur`, `fri`]),
  workWeekEnd: JSON.stringify({ hours: 5, minutes: `00`, amPm: `PM` }),
  workWeekStart: JSON.stringify({ hours: 9, minutes: `00`, amPm: `AM` })
};

// Gets the current options' values, then passes them to the provided function
const getOptionsValues = func =>
  chrome.storage.sync.get(defaultValues, values => {
    values.days = JSON.parse(values.workWeekDays);
    values.start = JSON.parse(values.workWeekStart);
    values.end = JSON.parse(values.workWeekEnd);
    func(values);
  });

// Given an object with hours and amPm properties, returns the hours, plus
// twelve if the amPm is PM
const get24HoursFromTimeObject = ({ hours, amPm }) =>
  parseInt(hours) + (amPm === `PM` ? 12 : 0);

// Given '13:05' returns [13, 5]; used to see if one time is after another
const timeStringToHoursAndMinutes = timeString => {
  const [hours, minutes] = timeString.split(`:`);
  return [parseInt(hours), parseInt(minutes)];
};

// Converts { hours: 1, minutes: 30, amPm: AM } => 90
const timeObjectToMinutes = timeObject =>
  get24HoursFromTimeObject(timeObject) * 60 + parseInt(timeObject.minutes);

function timeStringToMinutes(timeStringOrObject) {
  const [hours, minutes] = timeStringToHoursAndMinutes(timeStringOrObject);
  return hours * 60 + minutes;
}

// Converts 1:30 => 90 (so that we can more easily compare times)
const toMinutes = timeStringOrObject =>
    typeof timeStringOrObject ===  `string`
      ? timeStringToMinutes(timeStringOrObject)
      : timeObjectToMinutes(timeStringOrObject);