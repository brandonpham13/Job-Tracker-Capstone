# Job Tracker App - Frontend

Front-end for web application for tracking job and internship applications and professional contacts. The app allows users to log applications, manage contacts, and view basic trends about their job search.

---

## Features

### Applications

- Add new job/internship applications
- View all saved applications in a table
- Delete applications
- Filter and sort applications
- View and edit application details

### Contacts

- Add professional contacts
- View contacts in a table
- Delete contacts
- Filter contacts
- View and edit contact details

### Trends

- View summary data including:
  - Top required skills
  - Applications matching user skills

### Authentication UI

- Login page
- Registration page

---

## How It Works

- Built using **HTML, CSS, and vanilla JavaScript**
- Page-specific logic is handled in `index.js`
- DOM-based rendering and interaction
- Modals (overlays) are shown/hidden using CSS classes
- Forms currently simulate submission (no backend connected)

---

## Known Limitations

- No backend or database integration (data is not persisted)
- Only single-row delete handling in current implementation (needs event delegation improvement)
- Some form inputs are not yet validated or connected to storage logic

---

## Future Improvements

- Add backend API
- Persist data using a database
- Add real authentication system

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome (icons)

---
