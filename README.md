# Dadole Student Profile

## 1. Project Description

Dadole Student Profile is a responsive student profile application developed using Apache Cordova, HTML, CSS, and JavaScript.

This project continues the Student Profile application developed in Activity 4 and introduces JavaScript-based profile editing for Activity 5.

The application contains five main pages:

- Profile
- About
- Skills
- Projects
- Contact

Activity 5 adds an Edit Profile feature that allows profile information to be changed directly from the Profile page without manually editing the HTML source code.

The application also uses JavaScript validation and localStorage so that saved profile information remains available even after the application is closed and reopened.

---

## 2. Application Pages

### Profile

The Profile page serves as the homepage of the application.

It displays:

- Profile picture
- Full name
- Tagline
- Course
- Year level
- About Me description
- Skills

The Profile page also contains the Edit Profile feature introduced in Activity 5.

When Edit Profile is selected, the displayed profile information becomes editable directly in its existing location.

### About

The About page contains more detailed information about me, including:

- Personal introduction
- Interests
- Educational background
- Goals and aspirations

The page provides additional information that is not included in the shorter Profile page description.

### Skills

The Skills page presents the technical skills and areas that I am currently developing.

These include areas such as:

- Programming
- Web Development
- Mobile Development
- UI/UX Design
- Database Management

Each skill includes a short description.

### Projects

The Projects page contains selected projects that I have worked on.

Each project includes:

- Project title
- Description
- My role or contribution
- Technologies or tools used

Some project cards also link directly to the deployed project website.

### Contact

The Contact page contains ways to connect with me, including:

- Email
- GitHub
- Instagram

The contact items are displayed as clickable cards for easier access.

---

## 3. Profile Editing

Activity 5 introduces an Edit Profile feature on the Profile page.

The Edit Profile button is located in the upper-right area of the application header.

When the button is selected, the existing profile information changes into an inline editing interface.

Instead of opening a separate editing page or modal, the user edits the information directly where it is normally displayed.

The following information can be modified:

- Full Name
- Tagline
- Course
- Year Level
- About Me
- Skills

Pencil indicators are displayed beside editable information while the application is in edit mode.

The tagline is an additional editable field included in the application. The required Activity 5 fields are also fully supported.

---

## 4. JavaScript Functionality

JavaScript is used to control the Activity 5 profile editing functionality.

The main JavaScript file is:

www/js/profile.js

### Form Handling

The editable profile information is contained inside an HTML form. JavaScript listens for the form submission and prevents the browser from performing a normal page submission.The entered values are retrieved using JavaScript and processed before being saved.

### Edit Profile

Selecting Edit Profile activates edit mode.

During edit mode:

- The normal profile values become editable fields.
- Pencil indicators appear.
- The Edit Profile button is replaced by Save and Cancel buttons.

The editing interface remains in the same layout as the normal profile view.

### Validation

JavaScript validates the required fields before allowing the profile to be saved.

The following fields cannot be empty:

- Full Name
- Course
- Year Level
- About Me

If a required field is empty, JavaScript prevents the save operation and displays an appropriate validation message.

Example:

Please enter your full name.

The invalid field is also focused so the user can correct the information.

### Dynamic Profile Updates

After valid profile information is saved, JavaScript updates the displayed profile immediately.

For example:

Before:

3rd Year

After editing and saving:

4th Year

The user does not need to manually change the HTML source code. JavaScript updates the Document Object Model (DOM) to display the new information.

### Save

When Save is selected:

1. JavaScript retrieves the edited values.
2. Required fields are validated.
3. The updated profile information is stored.
4. The visible profile information is updated.
5. Edit mode is closed.
6. The application returns to the normal Profile view.

### Cancel

When Cancel is selected:

- The edited information is discarded.
- Nothing is saved to localStorage.
- Previously saved profile information is restored.
- Edit mode is closed.
- The application returns to the normal Profile view.

---

## 5. Local Data Storage

The application uses the browser's localStorage feature to save profile information on the device.

The following information is stored:

- Full Name
- Tagline
- Course
- Year Level
- About Me
- Skills

The profile information is converted into JSON before being stored using:

JSON.stringify()

When the application starts, the saved data is retrieved using:

localStorage.getItem()

The JSON data is then converted back into a JavaScript object using:

JSON.parse()

If saved profile information exists, the application displays the saved information.

If no saved information exists, the application uses the default profile information defined in JavaScript. This allows the user's updated profile to remain available after closing and reopening the application.

---

## 6. Responsive Design

The application uses a responsive and mobile-first design.

It is designed to work across:

- Mobile devices
- Tablets
- Desktop or laptop screens

The layout automatically adjusts depending on the available screen width.

### Mobile

On smaller screens:

- The profile image is displayed above the profile information.
- Content is arranged vertically.
- Navigation remains accessible at the bottom of the screen.
- Text and cards fit within the available screen width.

### Tablet

On tablet-sized screens:

- Spacing and content widths increase.
- Cards use more available screen space.
- The layout remains easy to read and navigate.

### Desktop

On larger screens:

- The profile image can appear beside the profile information.
- Content is displayed using wider layouts.
- Cards and sections use additional horizontal space while remaining centered.

The application avoids unnecessary horizontal scrolling, overlapping content, distorted images, and cut-off text.

---

## 7. How to Run

### Requirements

Make sure the following are installed:

- Node.js
- npm
- Apache Cordova CLI
- Android Studio
- Android SDK
- Android emulator or Android device

### Open the Project

Open Terminal and navigate to the project folder.

Example:
cd DadoleStudentProfile

## Install Dependencies

Run:
npm install

## Add Android Platform

If Android platform is not installed:
cordova platform add android

## Build the Application

Run:
cordova build android

## Run the Application

Using an emulator or connected Android device:
cordova run android

---

# 8. Application Screenshots

## Student Profile

<img width="1293" height="713" alt="Screenshot 2026-09-20 at 3 29 58 AM" src="https://github.com/user-attachments/assets/ff28b52e-d2b6-45c0-bf41-f3a6e76b3b36" />

---

## Edit Profile

<img width="1278" height="707" alt="Screenshot 2026-09-20 at 3 30 59 AM" src="https://github.com/user-attachments/assets/065686d0-fd20-4284-be9a-68b0709cfd13" />

---

## Updated Profile

<img width="1279" height="705" alt="Screenshot 2026-09-20 at 3 31 08 AM" src="https://github.com/user-attachments/assets/a43dcdb4-a9ca-409a-a9b6-845614a2f230" />

---

## Contact

<img width="1273" height="700" alt="Screenshot 2026-09-20 at 3 44 06 AM" src="https://github.com/user-attachments/assets/5b2c7caa-a97e-4afb-a141-3bacdf84728c" />
