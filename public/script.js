document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');

  const response = await fetch('/api/events');
  const events = await response.json();

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    allDaySlot: false,
    events: events,

    // to enable deletion of events
    eventClick: async function(info) {
      const confirmed = confirm(`Cancel booking for "${info.event.title}"?`);
      if (!confirmed) return;
    
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: info.event.title,
          start: info.event.start.toISOString(),
          end: info.event.end.toISOString()
        })
      });
    
      const result = await response.json();
      alert(result.message);
    
      if (result.status === 'success') {
        info.event.remove(); // Remove event from UI
      }
    }

    
  });

  calendar.render();
});
