const STORAGE_KEY = "dadoleStudentProfile";

const defaultProfile = {
    fullName: "Trishya Dadole",
    tagline: "IT Student and Aspiring Developer",
    course: "BS Information Technology",
    yearLevel: "3rd Year",
    about: "I am an Information Technology student who enjoys learning how to build useful digital experiences through web and mobile development, design, and problem solving.",
    skills: [
        "Programming",
        "Web Development",
        "Mobile Development",
        "UI/UX Design",
        "Database Management",
        "Version Control"
    ],
    photoUrl: ""
};

let currentProfile = null;
let cordovaReady = false;
let appInitialized = false;
let cameraControlsInitialized = false;

function cleanText(value) {
    return String(value ?? "").trim();
}

function parseSkills(value) {
    const skills = Array.isArray(value)
        ? value
        : String(value ?? "").split(/[,\n]/);

    return [
        ...new Set(
            skills
                .map((skill) => cleanText(skill))
                .filter(Boolean)
        )
    ];
}

function cloneProfile(profile = defaultProfile) {
    return {
        fullName: cleanText(profile.fullName) || defaultProfile.fullName,
        tagline: cleanText(profile.tagline),
        course: cleanText(profile.course) || defaultProfile.course,
        yearLevel: cleanText(profile.yearLevel) || defaultProfile.yearLevel,
        about: cleanText(profile.about) || defaultProfile.about,
        skills: parseSkills(profile.skills),
        photoUrl: cleanText(profile.photoUrl)
    };
}

function getStoredProfile() {
    try {
        const savedProfile = localStorage.getItem(STORAGE_KEY);

        if (!savedProfile) {
            return cloneProfile(defaultProfile);
        }

        const parsedProfile = JSON.parse(savedProfile);

        if (
            !parsedProfile ||
            typeof parsedProfile !== "object" ||
            Array.isArray(parsedProfile)
        ) {
            return cloneProfile(defaultProfile);
        }

        const hasSavedTagline = Object.prototype.hasOwnProperty.call(
            parsedProfile,
            "tagline"
        );

        const hasSavedSkills = Object.prototype.hasOwnProperty.call(
            parsedProfile,
            "skills"
        );

        return {
            fullName: cleanText(parsedProfile.fullName) || defaultProfile.fullName,
            tagline: hasSavedTagline
                ? cleanText(parsedProfile.tagline)
                : defaultProfile.tagline,
            course: cleanText(parsedProfile.course) || defaultProfile.course,
            yearLevel: cleanText(parsedProfile.yearLevel) || defaultProfile.yearLevel,
            about: cleanText(parsedProfile.about) || defaultProfile.about,
            skills: hasSavedSkills
                ? parseSkills(parsedProfile.skills)
                : [...defaultProfile.skills],
            photoUrl: cleanText(parsedProfile.photoUrl)
        };
    } catch (error) {
        console.warn(
            "Saved profile data could not be read. Default profile will be used.",
            error
        );

        return cloneProfile(defaultProfile);
    }
}

function saveProfile(profile) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        return true;
    } catch (error) {
        console.error("Profile data could not be saved.", error);
        return false;
    }
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function renderSkills(containerId, skills) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.replaceChildren();

    skills.forEach((skill) => {
        const item = document.createElement("li");
        item.textContent = skill;
        container.appendChild(item);
    });
}

function renderProfile(profile) {
    const profilePhoto = document.getElementById("profile-photo");

    if (profilePhoto && profile.photoUrl) {
        profilePhoto.src = profile.photoUrl;
    }

    setText("profile-name", profile.fullName);
    setText("profile-tagline", profile.tagline);
    setText("profile-course", profile.course);
    setText("profile-year-level", profile.yearLevel);
    setText("profile-about", profile.about);
    renderSkills("profile-skills", profile.skills);
    setText("about-profile-text", profile.about);
    setText("about-course", profile.course);
    setText("about-year-level", profile.yearLevel);
}

function fillInlineEditors(profile) {
    const fields = {
        "edit-full-name": profile.fullName,
        "edit-tagline": profile.tagline,
        "edit-course": profile.course,
        "edit-year-level": profile.yearLevel,
        "edit-about": profile.about,
        "edit-skills": profile.skills.join(", ")
    };

    Object.entries(fields).forEach(([id, value]) => {
        const field = document.getElementById(id);

        if (field) {
            field.value = value;
        }
    });
}

function clearValidation() {
    [
        "error-full-name",
        "error-course",
        "error-year-level",
        "error-about"
    ].forEach((id) => setText(id, ""));

    document
        .querySelectorAll(".inline-editor[aria-invalid='true']")
        .forEach((field) => field.removeAttribute("aria-invalid"));
}

function markInvalid(field, errorId, message) {
    if (!field) {
        return;
    }

    field.setAttribute("aria-invalid", "true");
    setText(errorId, message);
}

function validateInlineProfile() {
    clearValidation();

    const checks = [
        {
            field: document.getElementById("edit-full-name"),
            errorId: "error-full-name",
            message: "Please enter your full name."
        },
        {
            field: document.getElementById("edit-course"),
            errorId: "error-course",
            message: "Please enter your course or program."
        },
        {
            field: document.getElementById("edit-year-level"),
            errorId: "error-year-level",
            message: "Please enter your year level."
        },
        {
            field: document.getElementById("edit-about"),
            errorId: "error-about",
            message: "Please enter information for About Me."
        }
    ];

    let firstInvalidField = null;

    checks.forEach((check) => {
        if (check.field && cleanText(check.field.value)) {
            return;
        }

        markInvalid(check.field, check.errorId, check.message);

        if (!firstInvalidField && check.field) {
            firstInvalidField = check.field;
        }
    });

    if (firstInvalidField) {
        setText(
            "profile-status",
            "Please complete all required fields before saving."
        );

        firstInvalidField.focus();
        return false;
    }

    return true;
}

function setEditMode(enabled) {
    const form = document.getElementById("profile-edit-form");
    const editButton = document.getElementById("edit-profile-button");
    const editActions = document.getElementById("edit-profile-actions");
    const profileCard = document.querySelector(".profile-card");
    const changePhotoButton = document.getElementById("change-photo-button");

    if (!form) {
        return;
    }

    form.classList.toggle("is-editing", enabled);

    if (profileCard) {
        profileCard.classList.toggle("is-editing", enabled);
    }

    if (changePhotoButton) {
        changePhotoButton.disabled = !enabled;
        changePhotoButton.setAttribute("aria-disabled", String(!enabled));
    }

    if (editButton) {
        editButton.hidden = enabled;
    }

    if (editActions) {
        editActions.hidden = !enabled;
    }
}

function openEditor() {
    if (!currentProfile) {
        currentProfile = getStoredProfile();
    }

    fillInlineEditors(currentProfile);
    clearValidation();
    setText("profile-status", "");
    setEditMode(true);

    const fullName = document.getElementById("edit-full-name");

    if (fullName) {
        fullName.focus();
        fullName.select();
    }
}

function cancelEditor() {
    if (!currentProfile) {
        currentProfile = getStoredProfile();
    }

    fillInlineEditors(currentProfile);
    clearValidation();
    setText("profile-status", "Changes were canceled.");
    setEditMode(false);

    document.getElementById("edit-profile-button")?.focus();
}

function handleSave(event) {
    event.preventDefault();

    if (!validateInlineProfile()) {
        return;
    }

    const fullName = document.getElementById("edit-full-name");
    const tagline = document.getElementById("edit-tagline");
    const course = document.getElementById("edit-course");
    const yearLevel = document.getElementById("edit-year-level");
    const about = document.getElementById("edit-about");
    const skills = document.getElementById("edit-skills");

    if (!fullName || !tagline || !course || !yearLevel || !about || !skills) {
        setText(
            "profile-status",
            "The profile form is incomplete and could not be saved."
        );
        return;
    }

    currentProfile = cloneProfile({
        fullName: fullName.value,
        tagline: tagline.value,
        course: course.value,
        yearLevel: yearLevel.value,
        about: about.value,
        skills: skills.value,
        photoUrl: currentProfile?.photoUrl || ""
    });

    const wasSaved = saveProfile(currentProfile);

    renderProfile(currentProfile);
    fillInlineEditors(currentProfile);
    clearValidation();
    setEditMode(false);

    setText(
        "profile-status",
        wasSaved
            ? "Profile updated and saved successfully."
            : "Profile updated, but it could not be saved on this device."
    );

    document.getElementById("edit-profile-button")?.focus();
}

function cameraPluginAvailable() {
    return (
        cordovaReady &&
        navigator.camera &&
        typeof navigator.camera.getPicture === "function" &&
        typeof window.Camera !== "undefined"
    );
}

function openCamera() {
    const form = document.getElementById("profile-edit-form");

    if (!form || !form.classList.contains("is-editing")) {
        return;
    }

    if (!cordovaReady) {
        setText(
            "profile-status",
            "Camera is not ready yet. Please try again."
        );
        return;
    }

    if (!cameraPluginAvailable()) {
        setText(
            "profile-status",
            "Unable to access the camera. Please check that the Cordova camera plugin is installed."
        );
        return;
    }

    setText("profile-status", "Opening camera...");

    const options = {
        quality: 50,
        destinationType: window.Camera.DestinationType.DATA_URL,
        sourceType: window.Camera.PictureSourceType.CAMERA,
        encodingType: window.Camera.EncodingType.JPEG,
        mediaType: window.Camera.MediaType.PICTURE,
        targetWidth: 500,
        targetHeight: 500,
        allowEdit: false,
        correctOrientation: true,
        saveToPhotoAlbum: false
    };

    navigator.camera.getPicture(
        handleCameraSuccess,
        handleCameraError,
        options
    );
}

function handleCameraSuccess(imageData) {
    if (!imageData) {
        setText(
            "profile-status",
            "No picture was received from the camera."
        );
        return;
    }

    const imageUrl = imageData.startsWith("data:image/")
        ? imageData
        : "data:image/jpeg;base64," + imageData;

    if (!currentProfile) {
        currentProfile = getStoredProfile();
    }

    currentProfile = cloneProfile({
        ...currentProfile,
        photoUrl: imageUrl
    });

    const wasSaved = saveProfile(currentProfile);

    renderProfile(currentProfile);

    setText(
        "profile-status",
        wasSaved
            ? "Profile picture updated successfully."
            : "Profile picture was updated, but it could not be saved permanently."
    );
}

function isCameraCancellation(error) {
    const message = String(error ?? "").toLowerCase();

    return (
        message.includes("cancel") ||
        message.includes("no image selected") ||
        message.includes("no image")
    );
}

function handleCameraError(error) {
    console.warn("Camera operation failed:", error);

    if (isCameraCancellation(error)) {
        setText(
            "profile-status",
            "Camera was canceled. Your existing profile picture was kept."
        );
        return;
    }

    setText(
        "profile-status",
        "Unable to access the camera. Please check your device permissions and try again."
    );
}

function setupCameraControls() {
    if (cameraControlsInitialized) {
        return;
    }

    const changePhotoButton = document.getElementById("change-photo-button");

    if (changePhotoButton) {
        changePhotoButton.addEventListener("click", openCamera);
    }

    cameraControlsInitialized = true;
}

function setupInlineEditor() {
    document
        .getElementById("edit-profile-button")
        ?.addEventListener("click", openEditor);

    document
        .getElementById("cancel-edit-button")
        ?.addEventListener("click", cancelEditor);

    document
        .getElementById("profile-edit-form")
        ?.addEventListener("submit", handleSave);
}

function initializeApp() {
    if (appInitialized) {
        return;
    }

    currentProfile = getStoredProfile();

    renderProfile(currentProfile);
    fillInlineEditors(currentProfile);
    setupInlineEditor();
    setupCameraControls();
    setEditMode(false);

    appInitialized = true;
}

document.addEventListener("DOMContentLoaded", initializeApp);

document.addEventListener(
    "deviceready",
    function () {
        cordovaReady = true;
        initializeApp();
    },
    false
);
