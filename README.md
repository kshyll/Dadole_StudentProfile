<img width="926" height="2046" alt="7f7b5370-8f5e-44cb-853a-300c7ae96e64" src="https://github.com/user-attachments/assets/1982c513-bd8e-4905-bcdb-dfc0ae4ffb17" /># Student Profile Application

## 1. Project Description

The Student Profile application is a Cordova-based mobile application that presents student information through multiple pages. It contains a personal profile, background information, skills, projects, and contact details.

The application also allows the user to edit profile information and save changes using localStorage. For Activity 6, the application was extended with device camera integration so the user can capture and use a new profile picture directly from the application.

The application demonstrates how HTML, CSS, JavaScript, localStorage, and Cordova device APIs can work together in a mobile application.

## 2. Application Pages

### Profile

The Profile page is the main page of the application. It displays the student's profile picture, name, tagline, course, year level, description, and skills.

The Profile page also contains the Edit Profile functionality. When Edit Profile is selected, the user can modify their profile information and change their profile picture.

### About

The About page provides additional information about the student, including background, interests, education, and personal goals.

### Skills

The Skills page displays the student's technical skills and areas of knowledge or development.

### Projects

The Projects page presents selected projects completed or worked on by the student. It provides information about the projects and the student's involvement or contribution.

### Contact

The Contact page provides ways to communicate with or reach the student.

## 3. Profile Editing

The application allows the user to update profile information through the Edit Profile feature.

When the user selects Edit Profile, editable fields are displayed for information such as:

* Full Name
* Tagline
* Course
* Year Level
* About Me
* Skills

The user can either select Save to keep the changes or Cancel to leave edit mode.

When Save is selected, the updated profile information is stored using localStorage. This allows the information to remain available even after the application is closed and opened again.

The application reads the saved profile information from localStorage when the Profile page is loaded.

## 4. Camera Integration

The application uses the Cordova Camera plugin to access the device camera.

The camera feature is used for changing the student's profile picture.

The process is:

Change Profile Picture
↓
Open Camera
↓
Capture Image
↓
Return Image to Application
↓
Update Profile Picture

The Change Picture control is available as part of the profile editing interface.

When the user selects Change Picture, JavaScript calls the Cordova Camera API using:

navigator.camera.getPicture()

The camera is configured to use the device camera as the image source.

The application uses:

Camera.PictureSourceType.CAMERA

This tells Cordova that the application should open the device camera instead of selecting an existing image from the photo library.

The captured image is then returned to the JavaScript success function. The application processes the returned image and displays it as the new profile picture.

## 5. Device Feature Integration

Cordova is used because a normal web application mainly works inside a browser environment and does not directly provide the same JavaScript interface to native device features.

Cordova acts as a bridge between the JavaScript application and supported native device functionality.

For the camera feature, the Cordova Camera plugin provides the navigator.camera object.

The application waits for Cordova's deviceready event before considering the Cordova camera functionality ready for use.

After Cordova is ready, JavaScript can communicate with the camera plugin through:

navigator.camera.getPicture()

The camera plugin then communicates with the device camera.

The general process is:

JavaScript
↓
Cordova Camera Plugin
↓
Device Camera
↓
Captured Image
↓
Cordova Camera Plugin
↓
JavaScript Application

This allows the Student Profile application to access a native device feature while the application interface itself is built using HTML, CSS, and JavaScript.

## 6. Image Handling

When the user successfully captures a photograph, the camera plugin returns the captured image to the application's success function.

The application uses the captured image as the new profile picture.

The camera is configured to return image data using:

Camera.DestinationType.DATA_URL

The returned image data is used to create an image source that can be displayed by the profile image element.

The new image is assigned to the profile's photoUrl property.

The application then updates the profile picture displayed on the page.

The profile information, including photoUrl, is stored in localStorage.

The process is:

Capture Image
↓
Receive Image Data
↓
Store Image in photoUrl
↓
Update Profile Picture
↓
Save Profile to localStorage

When the application is opened again, the saved profile is retrieved from localStorage.

If a saved profile picture exists, the application uses the stored photoUrl as the source of the profile picture.

This allows the captured profile picture to remain available after restarting the application.

## 7. Error Handling

The application handles camera cancellation and camera-related errors to prevent the application from crashing.

### Camera Permission Denial

If the device does not allow the application to access the camera, the camera operation fails.

The application handles the failure and displays an appropriate message informing the user that the camera cannot be accessed and that device permissions should be checked.

Example:

Unable to access the camera. Please check your device permissions and try again.

The application remains open and usable.

### Camera Cancellation

If the user opens the camera but cancels without taking a picture, the application detects the cancellation.

The current profile picture is not replaced.

The user is returned to the application and receives a message indicating that the camera operation was canceled.

Example:

Camera was canceled. Your existing profile picture was kept.

### Camera Errors

The application also checks whether the Cordova Camera plugin is available before attempting to use it.

If the camera plugin is unavailable, the application displays an error message instead of attempting to call an unavailable camera function.

Other camera failures are handled through the error callback provided to:

navigator.camera.getPicture()

This prevents camera-related failures from causing the application to crash.

## 8. Responsive Design

The Student Profile application uses responsive HTML and CSS so that the interface can adjust to different screen sizes.

### Desktop

On larger screens, the application content is displayed within a controlled maximum width so that profile information remains readable and properly arranged.

### Tablet

The layout adjusts to the available screen width while maintaining readable spacing, profile cards, navigation, forms, and other interface elements.

### Mobile

The application includes responsive styling for smaller screens.

Profile images, cards, navigation elements, text, forms, and page spacing are adjusted to fit smaller displays.

The viewport is configured using:

<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

The CSS also uses responsive sizing and media queries to adjust the interface for different screen widths.

The profile picture uses object-fit: cover so that captured photographs remain properly fitted inside the profile picture area.

## 9. How to Run

### Requirements

Before running the project, make sure the following are installed:

* Node.js
* npm
* Apache Cordova CLI
* Android Studio and Android SDK for Android development
* A physical Android device or Android emulator

For iOS development, macOS and the required iOS development tools are needed.

### Step 1: Clone the Repository

Clone the Student Profile repository from GitHub.

git clone <repository-url>

Open the project folder.

cd <LastName>_StudentProfile

### Step 2: Install Project Dependencies

Install the dependencies listed in package.json.

npm install

If Cordova is not installed globally, install it using:

npm install -g cordova

Check that Cordova is installed correctly.

cordova --version

### Step 3: Add the Platform

If Android has not yet been added to the Cordova project, run:

cordova platform add android

To check the installed platforms, run:

cordova platform ls

### Step 4: Install the Camera Plugin

Install the Cordova Camera plugin using:

cordova plugin add cordova-plugin-camera

The plugin provides access to the navigator.camera API used by the JavaScript application.

Check that the camera plugin is installed using:

cordova plugin ls

The plugin list should include:

cordova-plugin-camera

### Step 5: Verify the Cordova Files

The project should contain the necessary Cordova configuration files, including:

* config.xml
* package.json
* www folder
* platform configuration
* plugin configuration

The application pages, stylesheets, JavaScript files, and images should be located inside the Cordova www directory.

The Profile page includes:

<script src="cordova.js"></script>

This allows the application to access Cordova APIs when running as a Cordova application.

## Step 6: How to Run

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

## Camera Testing

After running the application, perform the following tests.

### Test 1: Open Camera

1. Open the Profile page.
2. Select Edit Profile.
3. Select Change Picture.

Expected Result:

The device camera opens.

### Test 2: Capture Photo

1. Open the camera.
2. Capture a photograph.
3. Confirm the captured image if required by the device.

Expected Result:

The captured photograph appears as the profile picture.

### Test 3: Retake Photo

1. Select Change Picture again.
2. Capture another photograph.

Expected Result:

The new photograph replaces the previous profile picture.

### Test 4: Cancel Camera

1. Open the camera.
2. Cancel the camera without capturing a photograph.

Expected Result:

The existing profile picture remains unchanged, the application does not crash, and the user returns to the Profile page.

### Test 5: Restart Application

1. Capture a new profile picture.
2. Close the application.
3. Open the application again.

Expected Result:

The previously captured profile picture remains displayed because the image data is stored with the profile information in localStorage.

### Test 6: Camera Error

1. Disable or deny camera permission for the application.
2. Attempt to use Change Picture.

Expected Result:

The application displays an appropriate camera error or permission message and does not crash.

## Cordova Camera Feature Summary

The application uses the Cordova Camera plugin to connect JavaScript with the device camera.

The camera plugin is required because it provides the navigator.camera API used by the application.

JavaScript communicates with the camera using:

navigator.camera.getPicture(successCallback, errorCallback, options)

When the camera successfully returns an image, the success callback receives the captured image data.

The application then:

1. Receives the captured image.
2. Creates or uses the returned image data as the profile image source.
3. Updates the profile picture.
4. Stores the image information in the profile's photoUrl property.
5. Saves the updated profile using localStorage.
6. Restores the saved profile picture the next time the application is opened.

If the camera operation is canceled or fails, the error handling logic keeps the existing profile picture and provides feedback to the user.

---

# Application Screenshots

## Student Profile
<img width="926" height="2046" alt="ced87f8c-dbc3-46b1-93c5-7e6cfcce4af4" src="https://github.com/user-attachments/assets/075dc70c-b75b-4e9b-87ae-0535d9de7eae" />


---

## Change Profile Picture
<img width="926" height="2046" alt="1679ad61-d03b-4b9e-83bc-d9233526fbd5" src="https://github.com/user-attachments/assets/b7d83db8-bebe-4571-a190-b1396b3d1e31" />


---

## Camera
<img width="926" height="2046" alt="7f7b5370-8f5e-44cb-853a-300c7ae96e64" src="https://github.com/user-attachments/assets/4167261b-910a-4770-8132-3c06f0a40037" />
<img width="926" height="2046" alt="a70a5b50-b02a-4047-9ae6-99da70ec76f2" src="https://github.com/user-attachments/assets/1ca06c57-563e-4f24-9243-31184a42f63a" />

---

## Captured Image
<img width="926" height="2046" alt="d0dde92f-45c6-413f-a4af-d37dd4cbc3c2" src="https://github.com/user-attachments/assets/2a7e8433-7f8b-49ac-8717-db4439058b35" />


---
## Updated Profile Picture
<img width="926" height="2046" alt="b4b05ef4-f6df-49a4-867c-8c0f858c779b" src="https://github.com/user-attachments/assets/be28febd-d83e-4613-a87f-598a9ab3cbe5" />
