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
    ]
};

let currentProfile = null;

function cleanText(value) {
    return String(value ?? "").trim();
}

function parseSkills(value) {
    const skills = Array.isArray(value)
        ? value
        : String(value ?? "").split(/[,\n]/);

    return [...new Set(
        skills
            .map(skill => cleanText(skill))
            .filter(Boolean)
    )];
}

function cloneProfile(profile) {
    return {
        fullName: profile.fullName,
        tagline: profile.tagline,
        course: profile.course,
        yearLevel: profile.yearLevel,
        about: profile.about,
        skills: [...profile.skills]
    };
}

function getStoredProfile() {
    const savedProfile = localStorage.getItem(STORAGE_KEY);

    if (!savedProfile) {
        return cloneProfile(defaultProfile);
    }

    try {
        const parsedProfile = JSON.parse(savedProfile);
        const hasSavedTagline = Object.prototype.hasOwnProperty.call(parsedProfile, "tagline");
        const hasSavedSkills = Object.prototype.hasOwnProperty.call(parsedProfile, "skills");
        const parsedSkills = hasSavedSkills
            ? parseSkills(parsedProfile.skills)
            : [...defaultProfile.skills];

        return {
            fullName: cleanText(parsedProfile.fullName) || defaultProfile.fullName,
            tagline: hasSavedTagline ? cleanText(parsedProfile.tagline) : defaultProfile.tagline,
            course: cleanText(parsedProfile.course) || defaultProfile.course,
            yearLevel: cleanText(parsedProfile.yearLevel) || defaultProfile.yearLevel,
            about: cleanText(parsedProfile.about) || defaultProfile.about,
            skills: parsedSkills
        };
    } catch (error) {
        console.warn("Saved profile data could not be read. Default profile will be used.", error);
        return cloneProfile(defaultProfile);
    }
}

function saveProfile(profile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
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

    skills.forEach(skill => {
        const item = document.createElement("li");
        item.textContent = skill;
        container.appendChild(item);
    });
}

function renderProfile(profile) {
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
    const fullName = document.getElementById("edit-full-name");
    const tagline = document.getElementById("edit-tagline");
    const course = document.getElementById("edit-course");
    const yearLevel = document.getElementById("edit-year-level");
    const about = document.getElementById("edit-about");
    const skills = document.getElementById("edit-skills");

    if (fullName) {
        fullName.value = profile.fullName;
    }

    if (tagline) {
        tagline.value = profile.tagline;
    }

    if (course) {
        course.value = profile.course;
    }

    if (yearLevel) {
        yearLevel.value = profile.yearLevel;
    }

    if (about) {
        about.value = profile.about;
    }

    if (skills) {
        skills.value = profile.skills.join(", ");
    }
}

function clearValidation() {
    [
        "error-full-name",
        "error-course",
        "error-year-level",
        "error-about"
    ].forEach(id => setText(id, ""));

    document.querySelectorAll(".inline-editor[aria-invalid='true']")
        .forEach(field => field.removeAttribute("aria-invalid"));
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

    const fullName = document.getElementById("edit-full-name");
    const course = document.getElementById("edit-course");
    const yearLevel = document.getElementById("edit-year-level");
    const about = document.getElementById("edit-about");

    const checks = [
        {
            field: fullName,
            errorId: "error-full-name",
            message: "Please enter your full name."
        },
        {
            field: course,
            errorId: "error-course",
            message: "Please enter your course or program."
        },
        {
            field: yearLevel,
            errorId: "error-year-level",
            message: "Please enter your year level."
        },
        {
            field: about,
            errorId: "error-about",
            message: "Please enter information for About Me."
        }
    ];

    let firstInvalidField = null;

    checks.forEach(check => {
        if (!check.field || cleanText(check.field.value)) {
            return;
        }

        markInvalid(check.field, check.errorId, check.message);

        if (!firstInvalidField) {
            firstInvalidField = check.field;
        }
    });

    if (firstInvalidField) {
        setText("profile-status", "Please complete all required fields before saving.");
        firstInvalidField.focus();
        return false;
    }

    return true;
}

function setEditMode(enabled) {
    const form = document.getElementById("profile-edit-form");
    const editButton = document.getElementById("edit-profile-button");
    const editActions = document.getElementById("edit-profile-actions");

    if (!form) {
        return;
    }

    form.classList.toggle("is-editing", enabled);

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

    const editButton = document.getElementById("edit-profile-button");

    if (editButton) {
        editButton.focus();
    }
}

function handleSave(event) {
    event.preventDefault();

    if (!validateInlineProfile()) {
        return;
    }

    const updatedProfile = {
        fullName: cleanText(document.getElementById("edit-full-name").value),
        tagline: cleanText(document.getElementById("edit-tagline").value),
        course: cleanText(document.getElementById("edit-course").value),
        yearLevel: cleanText(document.getElementById("edit-year-level").value),
        about: cleanText(document.getElementById("edit-about").value),
        skills: parseSkills(document.getElementById("edit-skills").value)
    };

    /* Skills are stored even if the user chooses to leave the list empty. */
    currentProfile = cloneProfile(updatedProfile);
    saveProfile(currentProfile);
    renderProfile(currentProfile);
    fillInlineEditors(currentProfile);
    clearValidation();
    setEditMode(false);
    setText("profile-status", "Profile updated and saved successfully.");

    const editButton = document.getElementById("edit-profile-button");

    if (editButton) {
        editButton.focus();
    }
}

function setupInlineEditor() {
    const editButton = document.getElementById("edit-profile-button");
    const cancelButton = document.getElementById("cancel-edit-button");
    const form = document.getElementById("profile-edit-form");

    if (editButton) {
        editButton.addEventListener("click", openEditor);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", cancelEditor);
    }

    if (form) {
        form.addEventListener("submit", handleSave);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    currentProfile = getStoredProfile();
    renderProfile(currentProfile);
    fillInlineEditors(currentProfile);
    setupInlineEditor();
});
