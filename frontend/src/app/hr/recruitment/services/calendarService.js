// services/calendarService.js
const { google } = require('googleapis');
const calendar = google.calendar('v3');

const createCalendarEvent = async (auth, event) => {
  try {
    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary',
      resource: event
    });
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

module.exports = { createCalendarEvent };