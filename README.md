# Student Profile Application

## 1. Project Description

This project is a Cordova-based Student Profile application for ITCC 41 Mobile Development.

It began as a multi-page student profile with sections for personal information, skills, projects, and contact details. Later activities added profile editing and camera support. For Activity 7, I connected the application to Supabase so profile data is no longer stored only on the device.

The current version includes account registration, login, protected pages, database-backed profile data, profile editing, profile picture updates, logout, and CRUD operations.

## 2. Application Pages

### Profile

The Profile page is the main page of the application. It displays the authenticated student's profile picture, Student ID, name, tagline, course, year level, About Me information, and skills.

The student can also enter Edit Profile mode to update profile information or change the profile picture.

### About

The About page contains background information, interests, educational details, and personal goals.

Some information on this page, including the student's course, year level, and About Me content, comes from the profile stored in Supabase.

### Skills

The Skills page displays the skills stored in the authenticated student's profile.

When the Skills field is updated from the Profile page and saved, the Skills page retrieves the updated list from the database.

### Projects

The Projects page contains selected projects, short descriptions, the student's contributions, and the technologies used.

### Contact

The Contact page contains the student's contact details and social links.

### Login

The Login page allows a registered student to sign in using an email address and password.

After successful authentication, the student is taken to the protected Profile page.

### Register

The Register page creates a new student account.

It collects:

- Student ID
- Full Name
- Email
- Course
- Year Level
- Password
- Confirm Password

The password is checked against the required rules before registration is submitted.

## 3. Authentication

Authentication is handled through Supabase Auth.

The login flow is:

**Login → Supabase Authentication → Valid Session → Student Profile**

If the credentials are invalid, the application displays an error and does not grant access.

Protected pages use `auth-guard.js` to check for an authenticated session. If no valid session exists, the user is redirected to `login.html`.

## 4. Student Profile Management

After logging in, the student can:

- View profile information retrieved from Supabase.
- Select **Edit Profile** to modify profile information.
- Update the name, tagline, course, year level, About Me section, and skills.
- Save changes to the database.
- Cancel editing without saving.
- Capture and upload a new profile picture.
- Log out of the application.
- Use the controlled Delete Profile operation for the profile record.

Profile changes are saved in Supabase instead of relying on `localStorage`.

## 5. Database Integration

The application uses **Supabase PostgreSQL** for profile data.

The `profiles` table stores:

- User ID
- Student ID
- Name
- Tagline
- Course
- Year Level
- About Me
- Skills
- Profile picture reference
- Created timestamp
- Updated timestamp

The `user_id` connects each profile record to the corresponding Supabase Auth user.

Row Level Security policies are used so an authenticated user can only read, create, update, or delete their own profile record.

## 6. API / Backend

Supabase provides the backend services used by the application.

The basic architecture is:

**Cordova Application → Supabase Auth / REST API / Storage → PostgreSQL Database / Storage**

The Cordova application communicates with Supabase through the Supabase JavaScript client. It does not connect directly to PostgreSQL using database credentials.

Supabase Storage is used for profile pictures.

## 7. CRUD Operations

The application demonstrates all four basic CRUD operations.

### Create

A student profile record is created when a new account is registered.

### Read

After login, the application retrieves the profile that belongs to the authenticated user and displays it on the Profile page.

The Skills page also reads the current skill list from the same profile record.

### Update

When the student edits the profile and selects Save, the matching profile record is updated in Supabase.

Updating the profile picture also updates the stored profile picture reference.

### Delete

The Delete Profile option performs a controlled delete operation on the authenticated user's profile record.

This feature is intended for demonstration or test accounts. After the profile record is deleted, the user is signed out and returned to the Login page.

## 8. Camera Integration

The Activity 6 camera feature is still used in Activity 7.

The flow is:

**Edit Profile → Change Picture → Open Device Camera → Capture Image → Upload to Supabase Storage → Update Profile Record**

The Cordova Camera plugin provides access to the device camera through `navigator.camera.getPicture()`.

After a picture is captured, the image data is uploaded to the `profile-pictures` Supabase Storage bucket. The stored image path is then associated with the student's profile record.

The application also handles camera cancellation and camera-related errors so a failed or canceled camera action does not crash the application.

## 9. Data Persistence

Profile information is stored in Supabase rather than only on the device.

The expected persistence flow is:

**Update Profile → Save to Database → Logout → Login Again → Retrieve Updated Profile**

Because the information is stored in the database, saved profile changes remain available after logging out, reopening the application, or starting another session with the same account.

The profile picture reference is also stored with the profile record.

## 10. Responsive Design

The interface uses responsive CSS and viewport settings so the application works across different screen sizes.

### Mobile

Cards, forms, authentication pages, profile content, and navigation adjust to smaller screens.

### Tablet

Spacing and content widths expand while keeping the layout readable and usable.

### Desktop

The application uses a larger maximum content width and multi-column layouts where appropriate.

CSS media queries are used to handle layout changes between mobile, tablet, and desktop sizes.

## 11. Security

The application uses the following security measures:

- Passwords are handled by Supabase Auth and are not stored in the `profiles` table.
- Direct PostgreSQL database credentials are not included in the Cordova application.
- The local `www/js/supabase-config.js` file is excluded from Git.
- `supabase-config.example.js` contains placeholders only.
- Supabase Row Level Security restricts profile access to the authenticated owner.
- Storage policies restrict profile picture changes to the authenticated user's own storage folder.
- Protected pages check for a valid session before allowing access.

## 12. How to Run

### Requirements

Install the following before running the project:

- Node.js and npm
- Apache Cordova CLI
- Android Studio and Android SDK
- An Android emulator or physical Android device

A physical Android device is recommended for testing the camera.

### Project Setup

1. Clone the repository and open the project directory.

2. Install the project dependencies:

```bash
npm install
```

The post-install setup copies the Supabase browser library into `www/js/supabase.js`.

3. Copy:

```text
www/js/supabase-config.example.js
```

to:

```text
www/js/supabase-config.js
```

4. Add the local Supabase project URL and publishable key to `www/js/supabase-config.js`.

Do not commit this local file.

5. Open the Supabase SQL Editor and run `setup.sql` to create the profile table, Row Level Security policies, storage bucket, and storage policies.

6. If the Android platform has not been added yet, run:

```bash
cordova platform add android
```

7. Prepare and build the project:

```bash
cordova prepare android
cordova build android
```

8. Run the application on an emulator or connected Android device:

```bash
cordova run android
```

## 13. Test Account

Use a dedicated demonstration account for grading.

Do not use a personal university password or any other personal account password.

If a test account is required, replace the placeholders below with credentials created only for demonstration:

```text
Email: [DEMO ACCOUNT EMAIL]
Password: [DEMO-ONLY PASSWORD]
```

## 14. Application Screenshots

## Activity 7 Testing

### Valid Login

Enter valid demo credentials.

**Expected result:** The authenticated student's profile is displayed.

### Invalid Login

Enter incorrect credentials.

**Expected result:** Access is denied and an error message is displayed.

### Profile Retrieval

Log in successfully.

**Expected result:** The authenticated student's profile information is retrieved from Supabase.

Modify profile information and select Save.

**Expected result:** The database record is updated and a success message is displayed.

### Verify Update

Log out and log in again.

**Expected result:** The previously updated information is still displayed.

### Camera

Enter Edit Profile mode and capture a new profile picture.

**Expected result:** The captured picture is uploaded and displayed as the new profile picture.

Select Logout.

**Expected result:** The Supabase session is cleared and the user returns to the Login page.

### Data Persistence

Restart the application and log in again.

**Expected result:** Previously saved database information is retrieved successfully.

## Technologies Used

- Apache Cordova
- HTML
- CSS
- JavaScript
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Cordova Camera Plugin
