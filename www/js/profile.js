const PROFILE_BUCKET = "profile-pictures";

let currentUser = null;
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

    return [...new Set(skills.map((skill) => cleanText(skill)).filter(Boolean))];
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

    parseSkills(skills).forEach((skill) => {
        const item = document.createElement("li");
        item.textContent = skill;
        container.appendChild(item);
    });
}

function getProfilePictureUrl(profile) {
    if (!profile?.profile_picture) {
        return "";
    }

    const { data } = window.supabaseClient.storage
        .from(PROFILE_BUCKET)
        .getPublicUrl(profile.profile_picture);

    if (!data?.publicUrl) {
        return "";
    }

    const version = encodeURIComponent(profile.updated_at ?? Date.now());
    return `${data.publicUrl}?v=${version}`;
}

function renderProfile(profile) {
    if (!profile) {
        return;
    }

    const profilePhoto = document.getElementById("profile-photo");
    const profilePictureUrl = getProfilePictureUrl(profile);

    if (profilePhoto && profilePictureUrl) {
        profilePhoto.src = profilePictureUrl;
    }

    if (profilePhoto && profile.name) {
        profilePhoto.alt = `Profile photo of ${profile.name}`;
    }

    setText("profile-student-id", profile.student_id);
    setText("profile-name", profile.name);
    setText("profile-tagline", profile.tagline);
    setText("profile-course", profile.course);
    setText("profile-year-level", profile.year_level);
    setText("profile-about", profile.about);

    renderSkills("profile-skills", profile.skills);

    setText("about-profile-text", profile.about);
    setText("about-course", profile.course);
    setText("about-year-level", profile.year_level);
}

function fillInlineEditors(profile) {
    if (!profile) {
        return;
    }

    const fields = {
        "edit-full-name": profile.name,
        "edit-tagline": profile.tagline,
        "edit-course": profile.course,
        "edit-year-level": profile.year_level,
        "edit-about": profile.about,
        "edit-skills": parseSkills(profile.skills).join(", ")
    };

    Object.entries(fields).forEach(([id, value]) => {
        const field = document.getElementById(id);

        if (field) {
            field.value = value ?? "";
        }
    });
}

function clearValidation() {
    [
        "error-full-name",
        "error-course",
        "error-year-level",
        "error-about",
        "error-skills"
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
        },
        {
            field: document.getElementById("edit-skills"),
            errorId: "error-skills",
            message: "Please enter at least one skill."
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
            "Please complete all required profile information before saving."
        );

        firstInvalidField.focus();
        return false;
    }

    return true;
}

async function getCurrentUser() {
    const {
        data: { user },
        error
    } = await window.supabaseClient.auth.getUser();

    if (error || !user) {
        window.location.replace("login.html");
        return null;
    }

    currentUser = user;
    return user;
}

async function loadProfile() {
    const user = currentUser ?? await getCurrentUser();

    if (!user) {
        return null;
    }

    const { data, error } = await window.supabaseClient
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error || !data) {
        console.error("Unable to retrieve profile:", error);

        setText(
            "profile-status",
            "Unable to retrieve your profile. Please try again."
        );

        return null;
    }

    currentProfile = data;

    renderProfile(currentProfile);
    fillInlineEditors(currentProfile);

    return currentProfile;
}

function setEditMode(enabled) {
    const form = document.getElementById("profile-edit-form");
    const editButton = document.getElementById("edit-profile-button");
    const editActions = document.getElementById("edit-profile-actions");
    const logoutButton = document.getElementById("logout-button");
    const profileCard = document.querySelector(".profile-card");
    const changePhotoButton = document.getElementById("change-photo-button");
    const pageLinks = document.querySelector(".page-links");
    const bottomNav = document.querySelector(".bottom-nav");
    const deleteSection = document.getElementById("profile-delete-section");

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

    if (logoutButton) {
        logoutButton.hidden = enabled;
    }

    if (pageLinks) {
        pageLinks.hidden = enabled;
    }

    if (bottomNav) {
        bottomNav.hidden = enabled;
    }

    if (deleteSection) {
        deleteSection.hidden = !enabled;
    }
}

function openEditor() {
    if (!currentProfile) {
        return;
    }

    fillInlineEditors(currentProfile);
    clearValidation();
    setText("profile-status", "");
    setText("camera-status", "");

    setEditMode(true);

    const fullName = document.getElementById("edit-full-name");

    if (fullName) {
        fullName.focus();
        fullName.select();
    }
}

function cancelEditor() {
    if (currentProfile) {
        fillInlineEditors(currentProfile);
        renderProfile(currentProfile);
    }

    clearValidation();

    setText("profile-status", "Changes were canceled.");
    setText("camera-status", "");

    setEditMode(false);

    document.getElementById("edit-profile-button")?.focus();
}

async function handleSave(event) {
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
        setText("profile-status", "Unable to update your profile.");
        return;
    }

    if (!currentUser) {
        await getCurrentUser();
    }

    if (!currentUser) {
        return;
    }

    setText("profile-status", "Saving profile...");

    const updates = {
        name: cleanText(fullName.value),
        tagline: cleanText(tagline.value),
        course: cleanText(course.value),
        year_level: cleanText(yearLevel.value),
        about: cleanText(about.value),
        skills: parseSkills(skills.value),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await window.supabaseClient
        .from("profiles")
        .update(updates)
        .eq("user_id", currentUser.id)
        .select("*")
        .single();

    if (error || !data) {
        console.error("Profile update failed:", error);
        setText("profile-status", "Unable to update your profile.");
        return;
    }

    currentProfile = data;

    renderProfile(currentProfile);
    fillInlineEditors(currentProfile);
    clearValidation();
    setEditMode(false);

    setText("profile-status", "Profile updated successfully.");

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
            "camera-status",
            "Camera is not ready yet. Please try again."
        );

        return;
    }

    if (!cameraPluginAvailable()) {
        setText(
            "camera-status",
            "Unable to access the camera. Please check that the Cordova camera plugin is installed."
        );

        return;
    }

    setText("camera-status", "Opening camera...");

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

function base64ToArrayBuffer(imageData) {
    const base64 = imageData.includes(",")
        ? imageData.split(",").pop()
        : imageData;

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes.buffer;
}

async function uploadProfilePicture(imageData) {
    if (!imageData) {
        setText(
            "camera-status",
            "No picture was received from the camera."
        );

        return;
    }

    if (!currentUser) {
        await getCurrentUser();
    }

    if (!currentUser) {
        return;
    }

    setText("camera-status", "Uploading profile picture...");

    const filePath = `${currentUser.id}/profile.jpg`;
    const imageBuffer = base64ToArrayBuffer(imageData);

    const { error: uploadError } = await window.supabaseClient.storage
        .from(PROFILE_BUCKET)
        .upload(filePath, imageBuffer, {
            contentType: "image/jpeg",
            upsert: true
        });

    if (uploadError) {
        console.error("Profile picture upload failed:", uploadError);

        setText(
            "camera-status",
            "Unable to update your profile picture."
        );

        return;
    }

    const { data, error } = await window.supabaseClient
        .from("profiles")
        .update({
            profile_picture: filePath,
            updated_at: new Date().toISOString()
        })
        .eq("user_id", currentUser.id)
        .select("*")
        .single();

    if (error || !data) {
        console.error(
            "Profile picture database update failed:",
            error
        );

        setText(
            "camera-status",
            "Unable to update your profile picture."
        );

        return;
    }

    currentProfile = data;

    renderProfile(currentProfile);

    setText(
        "camera-status",
        "Profile picture updated successfully."
    );
}

function handleCameraSuccess(imageData) {
    uploadProfilePicture(imageData);
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
            "camera-status",
            "Camera was canceled. Your existing profile picture was kept."
        );

        return;
    }

    setText(
        "camera-status",
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

async function handleLogout() {
    const { error } = await window.supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout failed:", error);

        setText(
            "profile-status",
            "Unable to log out. Please try again."
        );

        return;
    }

    window.location.replace("login.html");
}

async function handleDeleteProfile() {
    const confirmed = window.confirm(
        "Delete this profile record? Use this only with a test account."
    );

    if (!confirmed) {
        return;
    }

    if (!currentUser) {
        await getCurrentUser();
    }

    if (!currentUser) {
        return;
    }

    if (currentProfile?.profile_picture) {
        const { error: storageError } = await window.supabaseClient.storage
            .from(PROFILE_BUCKET)
            .remove([currentProfile.profile_picture]);

        if (storageError) {
            console.warn(
                "Profile picture could not be deleted:",
                storageError
            );
        }
    }

    const { error } = await window.supabaseClient
        .from("profiles")
        .delete()
        .eq("user_id", currentUser.id);

    if (error) {
        console.error("Delete operation failed:", error);

        setText(
            "profile-status",
            "Unable to delete the profile record."
        );

        return;
    }

    await window.supabaseClient.auth.signOut();

    window.location.replace("login.html");
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

    document
        .getElementById("logout-button")
        ?.addEventListener("click", handleLogout);

    document
        .getElementById("delete-profile-button")
        ?.addEventListener("click", handleDeleteProfile);
}

async function initializeApp() {
    if (appInitialized) {
        return;
    }

    appInitialized = true;

    setupInlineEditor();
    setupCameraControls();
    setEditMode(false);

    await getCurrentUser();
    await loadProfile();
}

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

document.addEventListener(
    "deviceready",
    function () {
        cordovaReady = true;
    },
    false
);
