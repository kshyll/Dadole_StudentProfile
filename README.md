# Student Profile Application

## 1. Project Description

This project is a Cordova-based Student Profile application created for ITCC 41 Mobile Development.

The project started as a multi-page student profile and was later extended with profile editing and camera integration. For Activity 7, the application was converted into a database-driven application using Supabase for authentication, profile data, and profile picture storage.

The application now supports account registration, login, protected pages, database-backed profile management, profile picture updates, logout, and CRUD operations.

## 2. Application Pages

### Profile

The Profile page is the main page of the application. It displays the authenticated student's profile picture, Student ID, name, tagline, course, year level, About Me information, and skills.

The student can enter Edit Profile mode to update profile information and change the profile picture.

### About

The About page contains the student's background, interests, educational information, and goals. Profile-related information such as the course, year level, and About Me content is loaded from the student's database record.

### Skills

The Skills page displays the skills saved in the authenticated student's profile. Changes made to the Skills field on the Profile page are retrieved from the database and reflected on the Skills page.

### Projects

The Projects page presents selected student projects, project descriptions, contributions, and technologies used.

### Contact

The Contact page contains the student's contact information and social links.

### Login

The Login page allows a registered student to sign in using an email address and password. A successful login gives access to the protected student profile pages.

### Register

The Register page allows a new student account to be created. It collects the Student ID, full name, email, course, year level, password, and password confirmation.

Password requirements are checked before account creation.

## 3. Authentication

Authentication is handled through Supabase Auth.

The basic flow is:

**Login → Supabase Authentication → Valid Session → Student Profile**

If the credentials are invalid, access is denied and an error message is displayed.

Protected pages use an authentication guard. If there is no valid session, the user is redirected to the Login page.

## 4. Student Profile Management

After logging in, the student can:

- View profile information retrieved from the database.
- Select **Edit Profile** to modify profile information.
- Update the name, tagline, course, year level, About Me section, and skills.
- Save the changes to the database.
- Cancel editing without saving changes.
- Capture and upload a new profile picture.
- Log out of the application.
- Perform the controlled Delete operation on the profile record.

Profile changes are saved in Supabase rather than relying on localStorage.

## 5. Database Integration

The project uses **Supabase PostgreSQL** as its database.

The `profiles` table stores information associated with an authenticated user, including:

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

The `user_id` connects the profile record to the corresponding Supabase Auth user.

Row Level Security policies are used so an authenticated user can only read, create, update, or delete their own profile record.

## 6. API / Backend

Supabase is used as the backend service for the project.

The application architecture is:

**Cordova Application → Supabase Auth / REST API / Storage → PostgreSQL Database / Storage**

The Cordova application does not contain direct PostgreSQL database credentials. Authentication and database requests are made through the Supabase client API.

Supabase Storage is used for profile pictures.

## 7. CRUD Operations

The application demonstrates the four basic CRUD operations.

### Create

A student profile record is created when a new account is registered.

### Read

After login, the application retrieves the profile belonging to the authenticated user and displays it on the Profile page.

The Skills page also reads the current skill data from the profile record.

### Update

When the student edits the profile and selects Save, the matching profile record is updated in Supabase.

Profile picture changes also update the stored profile picture reference.

### Delete

The Delete Profile option performs a controlled Delete operation by deleting the authenticated user's profile record.

The Delete operation is intended for demonstration or test accounts. After deletion, the user is signed out and returned to the Login page.

## 8. Camera Integration

The Activity 6 camera functionality is retained in Activity 7.

The process is:

**Edit Profile → Change Picture → Open Device Camera → Capture Image → Upload to Supabase Storage → Update Profile Record**

The Cordova Camera plugin provides access to the device camera through `navigator.camera.getPicture()`.

The captured image is converted into uploadable image data and stored in the `profile-pictures` Supabase Storage bucket. The image path is then associated with the student's profile record.

Camera cancellation and camera errors are handled so the application remains usable if a picture is not captured.

## 9. Data Persistence

Profile information is stored in Supabase instead of only on the device.

The expected persistence flow is:

**Update Profile → Save to Database → Logout → Login Again → Retrieve Updated Profile**

Because the updated profile is stored in the database, the data remains available after logging out, reopening the application, or using another application session with the same account.

Profile picture references are also stored with the profile record.

## 10. Responsive Design

The application uses responsive CSS and viewport settings so the interface can adjust to different screen sizes.

### Mobile

Cards, forms, profile content, authentication pages, and navigation are adjusted for smaller screens.

### Tablet

Spacing and content widths expand while maintaining readable forms and profile layouts.

### Desktop

The content uses a larger maximum width and multi-column layouts where appropriate.

The design uses CSS media queries to provide responsive behavior across mobile, tablet, and desktop screen sizes.

## 11. Security

The application applies the following security measures:

- Passwords are handled by Supabase Auth and are not stored in the profile table.
- Direct PostgreSQL database credentials are not included in the Cordova application.
- The local `www/js/supabase-config.js` file is excluded from Git.
- `supabase-config.example.js` contains placeholders only and does not contain real project credentials.
- Supabase Row Level Security restricts profile access to the authenticated owner.
- Storage policies restrict profile picture changes to the authenticated user's own storage folder.
- Protected application pages check for a valid authenticated session before allowing access.

## 12. How to Run

### Requirements

Install the following before running the project:

- Node.js and npm
- Apache Cordova CLI
- Android Studio and Android SDK
- An Android emulator or physical Android device

A physical device is recommended when testing the camera.

### Project Setup

1. Clone the repository and open the project directory.
2. Run:

```bash
npm install
```

The post-install setup copies the Supabase browser library into `www/js/supabase.js`.

3. Create the local Supabase configuration file by copying:

```text
www/js/supabase-config.example.js
```

to:

```text
www/js/supabase-config.js
```

4. Add the local Supabase project URL and publishable key to `www/js/supabase-config.js`.

Do not commit this local file.

5. Open the Supabase SQL Editor and run the project's `setup.sql` file to create the profile table, Row Level Security policies, storage bucket, and storage policies.

6. If the Android platform is not installed, run:

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

Create a dedicated demonstration account for grading.

Do not use a personal university password or any other personal account password.

Replace the placeholders below with credentials for a demo-only account if required by the instructor:

```text
Email: [DEMO ACCOUNT EMAIL]
Password: [DEMO-ONLY PASSWORD]
```

## 14. Application Screenshots

Before final submission, add a `screenshots` folder to the repository and include screenshots for the required Activity 7 functions.

### Login Page

![Login Page](screenshots/login.png)

### Successful Login

![Successful Login](screenshots/successful-login.png)

### Student Profile

![Student Profile](screenshots/student-profile.png)

### Edit Profile

![Edit Profile](screenshots/edit-profile.png)

### Updated Profile

![Updated Profile](screenshots/updated-profile.png)

### Profile Picture / Camera

![Profile Picture Camera](screenshots/camera-profile-picture.png)

### Logout

![Logout](screenshots/logout.png)

### Database Functionality

![Database Functionality](screenshots/database-profile-record.png)

## Activity 7 Testing

The following tests should be completed before submission.

### Valid Login

Enter valid demo credentials.

**Expected result:** The authenticated student's profile is displayed.

### Invalid Login

Enter incorrect credentials.

**Expected result:** Access is denied and an error message is displayed.

### Profile Retrieval

Log in successfully.

**Expected result:** The authenticated student's profile information is retrieved from Supabase.

### Edit Profile

Modify profile information and select Save.

**Expected result:** The database record is updated and a success message is displayed.

### Verify Update

Log out and log in again.

**Expected result:** The previously updated information is still displayed.

### Camera

Enter Edit Profile mode and capture a new profile picture.

**Expected result:** The captured picture is uploaded and displayed as the new profile picture.

### Logout

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
