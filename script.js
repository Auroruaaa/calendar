// const events = [];

// function parseNaturalInput(input) {
//   const now = new Date();
//   const match = input.match(/(.+?) at (\d{1,2})(:(\d{2}))?(am|pm)?/i);
//   if (!match) return null;
//   const title = match[1].trim();
//   let hour = parseInt(match[2]);
//   const minute = match[4] ? parseInt(match[4]) : 0;
//   const period = match[5]?.toLowerCase();
//   if (period === 'pm' && hour < 12) hour += 12;
//   if (period === 'am' && hour === 12) hour = 0;
//   const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
//   const end = new Date(start.getTime() + 60000); // 1 minute duration
//   return { title, start, end };
// }

// function addEvent() {
//   const input = document.getElementById('task-input').value;
//   const parsed = parseNaturalInput(input);
//   if (!parsed) {
//     alert("Try something like: 'Meeting at 2:00pm'");
//     return;
//   }
//   events.push(parsed);
//   document.getElementById('task-input').value = '';
//   renderCalendar();
// }

// function renderCalendar() {
//   const calendar = document.getElementById('calendar');
//   calendar.innerHTML = '';
//   for (let i = 0; i < 24; i++) {
//     const row = document.createElement('div');
//     row.className = 'hour-row';
//     const label = document.createElement('div');
//     label.className = 'hour-label';
//     label.innerText = `${i}:00`;
//     row.appendChild(label);

//     events.forEach(event => {
//       const hour = event.start.getHours();
//       const min = event.start.getMinutes();
//       if (hour === i) {
//         const top = (min / 60) * 80;
//         const duration = Math.max((event.end - event.start) / 60000, 1);
//         const bar = document.createElement('div');
//         bar.className = 'event-bar';
//         bar.style.top = `${top}px`;
//         bar.style.height = `${duration}px`;
//         bar.innerText = event.title;
//         row.appendChild(bar);
//       }
//     });

//     calendar.appendChild(row);
//   }
// }


// Current Version

// function generateSchedule() {
//   const input = document.getElementById("taskInput").value;
//   const schedule = document.getElementById("schedule");
//   schedule.innerHTML = "";

//   const startHour = 0;
//   const endHour = 24;

// New Feature: multiple events at the same time
function generateSchedule() {
  const input = document.getElementById("taskInput").value;
  const schedule = document.getElementById("schedule");
  schedule.innerHTML = "";

  const startHour = 0;
  const endHour = 24;

  // Create hourly grid
  for (let h = startHour; h <= endHour; h++) {
    const timeSlot = document.createElement("div");
    timeSlot.className = "time-slot";
    const label = document.createElement("div");
    label.className = "time-label";
    label.innerText = `${String(h).padStart(2, "0")}:00`;
    timeSlot.appendChild(label);
    schedule.appendChild(timeSlot);
  }

  const lines = input.split("\n").filter(line => /\d/.test(line));
  let events = [];

  for (let line of lines) {
    const match = line.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s+(.*)/);
    if (!match) continue;

    const [_, start, end, title] = match;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startTime = sh + sm / 60;
    const endTime = eh + em / 60;

    events.push({ startTime, endTime, title });
  }

  // Detect overlaps
  events.sort((a, b) => a.startTime - b.startTime);

  for (let i = 0; i < events.length; i++) {
    const overlapping = [events[i]];
    for (let j = i + 1; j < events.length; j++) {
      if (events[j].startTime < events[i].endTime) {
        overlapping.push(events[j]);
        i = j; // Skip next loop
      } else {
        break;
      }
    }

    // Render each overlapping event with correct width/left
    overlapping.forEach((e, idx) => {
      const topPercent = ((e.startTime - startHour) / (endHour - startHour)) * 100;
      const heightPercent = ((e.endTime - e.startTime) / (endHour - startHour)) * 100;

      const eventDiv = document.createElement("div");
      eventDiv.className = "event";
      eventDiv.innerText = e.title;

      eventDiv.style.position = "absolute";
      eventDiv.style.top = `${topPercent}%`;
      eventDiv.style.height = `${heightPercent}%`;

      const width = 100 / overlapping.length;
      eventDiv.style.width = `calc(${width}% - 5px)`;
      eventDiv.style.left = `calc(${idx * width}% + 60px)`; // Offset for time label

      schedule.appendChild(eventDiv);
    });
  }
}

  // Create hourly grid
  for (let h = startHour; h <= endHour; h++) {
    const timeSlot = document.createElement("div");
    timeSlot.className = "time-slot";
    const label = document.createElement("div");
    label.className = "time-label";
    label.innerText = `${String(h).padStart(2, "0")}:00`;
    timeSlot.appendChild(label);
    schedule.appendChild(timeSlot);
  }

  const lines = input.split("\n").filter(line => /\d/.test(line));
  for (let line of lines) {
    const match = line.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s+(.*)/);
    if (!match) continue;

    const [_, start, end, title] = match;

    const startParts = start.split(":").map(Number);
    const endParts = end.split(":").map(Number);
    const startTime = startParts[0] + startParts[1] / 60;
    const endTime = endParts[0] + endParts[1] / 60;

    // const topPercent = ((startTime - startHour) / (endHour - startHour)) * 100;
    // const heightPercent = ((endTime - startTime) / (endHour - startHour)) * 100;

    const eventDiv = document.createElement("div");
    eventDiv.className = "event";
    // eventDiv.style.top = `calc(${topPercent}% + ${startTime - startHour}px)`;
    // eventDiv.style.top = `${topPercent}%`;
    // eventDiv.style.height = `calc(${heightPercent}% - 2px)`;
    const hourHeight = 60;
    const startOffset = (startTime - startHour) * hourHeight;
    const blockHeight = (endTime - startTime) * hourHeight - 1;
    
    eventDiv.style.top = `${startOffset}px`;
    eventDiv.style.height = `${blockHeight}px`;

    eventDiv.innerText = title;
    eventDiv.style.position = "absolute";

    schedule.appendChild(eventDiv);
  }
}
