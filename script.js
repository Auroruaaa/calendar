const events = [];

function parseNaturalInput(input) {
  const now = new Date();
  const match = input.match(/(.+?) at (\d{1,2})(:(\d{2}))?(am|pm)?/i);
  if (!match) return null;
  const title = match[1].trim();
  let hour = parseInt(match[2]);
  const minute = match[4] ? parseInt(match[4]) : 0;
  const period = match[5]?.toLowerCase();
  if (period === 'pm' && hour < 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
  const end = new Date(start.getTime() + 60000); // 1 minute duration
  return { title, start, end };
}

function addEvent() {
  const input = document.getElementById('task-input').value;
  const parsed = parseNaturalInput(input);
  if (!parsed) {
    alert("Try something like: 'Meeting at 2:00pm'");
    return;
  }
  events.push(parsed);
  document.getElementById('task-input').value = '';
  renderCalendar();
}

function renderCalendar() {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const row = document.createElement('div');
    row.className = 'hour-row';
    const label = document.createElement('div');
    label.className = 'hour-label';
    label.innerText = `${i}:00`;
    row.appendChild(label);

    events.forEach(event => {
      const hour = event.start.getHours();
      const min = event.start.getMinutes();
      if (hour === i) {
        const top = (min / 60) * 80;
        const duration = Math.max((event.end - event.start) / 60000, 1);
        const bar = document.createElement('div');
        bar.className = 'event-bar';
        bar.style.top = `${top}px`;
        bar.style.height = `${duration}px`;
        bar.innerText = event.title;
        row.appendChild(bar);
      }
    });

    calendar.appendChild(row);
  }
}
