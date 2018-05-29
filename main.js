/**
 * Basic Chrome plug-in for blocking commenting (well, technically for blocking
 * HTML textareas, which are essential for commenting).
 *
 * TODO: Add a UI for setting the blocked time/days
 */

const MONDAY = 1;
const TUESDAY = 1;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;
const SUNDAY = 7;


// Adds a class to a textarea so we know not to block it
const preventFutureBlocking = el => el.className += ` disable-blocking`;

// Converts the hours of the provided date into minutes, adds in its actual
// minutes, then "rounds up" (adds one more minute if the seconds are non-zero)
const getCurrentRoundedUpMinutes = date =>
  date.getHours() * 60 + (date.getMinutes() + (date.getSeconds() ? 1 : 0));

const numericDayToWeekday = day => ({
    0: `sun`,
    1: `mon`,
    2: `tues`,
    3: `wed`,
    4: `thurs`,
    5: `fri`,
    6: `sat`
  })[day];

const handleFocus = ({ action, confirmationMessage, days, end, start }, e) => {
  const now = new Date();
  const textarea = e.target;
  const minutes = getCurrentRoundedUpMinutes(now);

  // console.log(1, minutes, toMinutes(start))
  // If the current time is before the blocked time period, do nothing
  if (minutes < toMinutes(start)) return;

  // console.log(2,  minutes, toMinutes(end))
  // If the current time is after the blocked time period, do nothing
  if (minutes > toMinutes(end)) return;

  // Only block during the specified days
  if (!days.includes(numericDayToWeekday(now.getDay()))) return;

  // console.log(3)
  // Only block textarea's
  if (textarea.tagName !== `TEXTAREA`) return;

  // console.log(4)
  // Don't block if the user has told us not to block this textarea
  if (textarea.className.includes(`disable-blocking`)) return;

  // console.log(5)
  // If the action is prohibit then just prohibit (prevent) and be done

  // Better (but un-tested) version
  // const shouldBlock =  action === `prohibit` || confirm(confirmationMessage);
  // if (shouldBlock) textarea.blur();
  // else preventFutureBlocking(textarea);

  if (action === `prohibit`) {
    alert(`No Comment: Commenting is currently prohibited.`);
    textarea.disabled = true;
    return textarea.blur();
  }

  // If the action is confirm then confirm with user
  // QUESTION: Why do we need a timeout?
  window.setTimeout(() => {
    if (confirm(confirmationMessage)) {
      preventFutureBlocking(textarea);
    } else {
      textarea.blur();
    }
  }, 1);
};

getOptionsValues(values => {
  // Hook up a focus handler to the whole body so we catch dynamically-added
  // textareas (but then ignore non-textareas inside the listener)
  const handleFocusWithOptionValues = handleFocus.bind(null, values);
  document.body.addEventListener('focus', handleFocusWithOptionValues, true);
});
