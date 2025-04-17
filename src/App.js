import { useState } from 'react';

const parseNaturalInput = (input) => {
  const now = new Date();
  const match = input.match(/(.+?) at (\d{1,2})(:(\d{2}))?(am|pm)?/i);
  if (!match) return null;
  const title = match[1].trim();
  const hour = parseInt(match[2]);
  const minute = match[4] ? parseInt(match[4]) : 0;
  const period = match[5]?.toLowerCase();
  const startHour = period === 'pm' && hour < 12 ? hour + 12 : hour;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, minute);
  const end = new Date(start.getTime() + 60 * 1000); // default 1-minute duration
  return { title, start, end };
};

export default function CalendarApp() {
  const [input, setInput] = useState('');
  const [events, setEvents] = useState([]);

  const addEvent = () => {
    const parsed = parseNaturalInput(input);
    if (parsed) {
      setEvents([...events, parsed]);
      setInput('');
    } else {
      alert("Try: 'Meeting at 2:30pm'");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h1>Smart Calendar</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Lunch with John at 1:00pm"
          style={{ padding: 8, width: '60%' }}
        />
        <button onClick={addEvent} style={{ padding: 8, marginLeft: 8 }}>
          Add
        </button>
      </div>
      <div style={{ borderTop: '1px solid #ccc' }}>
        {[...Array(24)].map((_, i) => (
          <div key={i} style={{ borderBottom: '1px solid #eee', height: 80, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, fontSize: 12 }}>{i}:00</div>
            {events.map((event, idx) => {
              const hour = event.start.getHours();
              const min = event.start.getMinutes();
              const top = (hour + min / 60) * 80;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: 60,
                    top,
                    height: Math.max((event.end - event.start) / 60000, 1),
                    backgroundColor: '#3182ce',
                    color: '#fff',
                    fontSize: 12,
                    padding: '2px 4px',
                    borderRadius: 4
                  }}
                >
                  {event.title}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
