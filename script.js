function generateSchedule() {
  const input = document.getElementById("taskInput").value;
  const schedule = document.getElementById("schedule");
  schedule.innerHTML = "";

  const startHour = 0;
  const endHour = 24;

  // Show date at top if available
  const dateLine = input.split("\n").find(line => /^[A-Z][a-z]{2,}\.? \d{1,2}(st|nd|rd|th)?/.test(line));
  const dateContainer = document.getElementById("schedule-date");
  if (dateContainer && dateLine) {
    dateContainer.textContent = `Schedule for ${dateLine.trim()}`;
  }

  // Draw hourly grid
  for (let h = startHour; h <= endHour; h++) {
    const timeSlot = document.createElement("div");
    timeSlot.className = "time-slot";
    const label = document.createElement("div");
    label.className = "time-label";
    label.innerText = `${String(h).padStart(2, "0")}:00`;
    timeSlot.appendChild(label);
    schedule.appendChild(timeSlot);
  }

  // Parse events
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

  // Group overlapping events
  function groupOverlappingEvents(events) {
    const clusters = [];

    events.forEach(event => {
      let added = false;
      for (const cluster of clusters) {
        if (cluster.some(e => !(event.endTime <= e.startTime || event.startTime >= e.endTime))) {
          cluster.push(event);
          added = true;
          break;
        }
      }
      if (!added) {
        clusters.push([event]);
      }
    });

    return clusters;
  }

  const clusters = groupOverlappingEvents(events);

  clusters.forEach(cluster => {
    cluster.sort((a, b) => a.startTime - b.startTime);
    cluster.forEach((event, idx) => {
      const topPercent = ((event.startTime - startHour) / (endHour - startHour)) * 100;
      const heightPercent = ((event.endTime - event.startTime) / (endHour - startHour)) * 100;

      const eventDiv = document.createElement("div");
      eventDiv.className = "event";
      eventDiv.innerText = event.title;

      const width = 100 / cluster.length;
      eventDiv.style.width = `calc(${width}% - 5px)`;
      eventDiv.style.left = `calc(${idx * width}% + 60px)`; // 60px offset for time labels
      eventDiv.style.top = `${topPercent}%`;
      eventDiv.style.height = `${heightPercent}%`;
      eventDiv.style.position = "absolute";

      schedule.appendChild(eventDiv);
    });
  });
}
