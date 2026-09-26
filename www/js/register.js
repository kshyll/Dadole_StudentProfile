function setRegisterStatus(message, type = "") {
    const status = document.getElementById("register-status");

    if (!status) {
        return;
    }

    status.textContent = message;
    status.classList.remove("auth-status-error", "auth-status-success");

    if (type === "error") {
        status.classList.add("auth-status-error");
    }

    if (type === "success") {
        status.classList.add("auth-status-success");
    }
}

function getPasswordRules(password) {
    return {
        length: password.length >= 8 && password.length <= 64,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password),
        characters: /^[A-Za-z0-9!@#$%^&*]*$/.test(password)
    };
}

function updatePasswordRequirement(id, valid, hasValue) {
    const item = document.getElementById(id);

    if (!item) {
        return;
    }

    item.classList.remove("requirement-valid", "requirement-invalid");

    if (!hasValue) {
        return;
    }

    item.classList.add(valid ? "requirement-valid" : "requirement-invalid");
}

function validatePasswordLive() {
    const password = document.getElementById("register-password").value;
    const rules = getPasswordRules(password);
    const hasValue = password.length > 0;

    updatePasswordRequirement("password-length", rules.length, hasValue);
    updatePasswordRequirement("password-uppercase", rules.uppercase, hasValue);
    updatePasswordRequirement("password-lowercase", rules.lowercase, hasValue);
    updatePasswordRequirement("password-number", rules.number, hasValue);
    updatePasswordRequirement("password-special", rules.special, hasValue);
    updatePasswordRequirement("password-characters", rules.characters, hasValue);

    checkPasswordMatch();

    return Object.values(rules).every(Boolean);
}

function checkPasswordMatch() {
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const status = document.getElementById("password-match-status");

    if (!status) {
        return false;
    }

    status.classList.remove("password-match-valid", "password-match-invalid");

    if (!confirmPassword) {
        status.textContent = "";
        return false;
    }

    if (password === confirmPassword) {
        status.textContent = "Passwords match.";
        status.classList.add("password-match-valid");
        return true;
    }

    status.textContent = "Passwords do not match.";
    status.classList.add("password-match-invalid");
    return false;
}

function togglePassword(fieldId, buttonId) {
    const field = document.getElementById(fieldId);
    const button = document.getElementById(buttonId);

    if (!field || !button) {
        return;
    }

    if (field.type === "password") {
        field.type = "text";
        button.textContent = "Hide";
    } else {
        field.type = "password";
        button.textContent = "Show";
    }
}

async function saveNewProfile(user, profile) {
    const { error } = await window.supabaseClient
        .from("profiles")
        .upsert(
            {
                user_id: user.id,
                student_id: profile.studentId,
                name: profile.name,
                tagline: "IT Student and Aspiring Developer",
                course: profile.course,
                year_level: profile.yearLevel,
                about: "I am an Information Technology student who enjoys learning how to build useful digital experiences through web and mobile development, design, and problem solving.",
                skills: [
                    "Programming",
                    "Web Development",
                    "Mobile Development",
                    "UI/UX Design",
                    "Database Management",
                    "Version Control"
                ],
                profile_picture: ""
            },
            {
                onConflict: "user_id"
            }
        );

    return error;
}

async function handleRegister(event) {
    event.preventDefault();

    const studentId = document.getElementById("student-id").value.trim();
    const name = document.getElementById("full-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const course = document.getElementById("course").value.trim();
    const yearLevel = document.getElementById("year-level").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    setRegisterStatus("");

    if (!studentId || !name || !email || !course || !yearLevel || !password || !confirmPassword) {
        setRegisterStatus("Please complete all required fields.", "error");
        return;
    }

    if (!validatePasswordLive()) {
        setRegisterStatus("Please complete all password requirements.", "error");
        return;
    }

    if (password !== confirmPassword) {
        setRegisterStatus("Passwords do not match.", "error");
        return;
    }

    if (!navigator.onLine) {
        setRegisterStatus("Internet connection is required.", "error");
        return;
    }

    if (!window.supabaseClient) {
        setRegisterStatus("Unable to connect to Supabase.", "error");
        return;
    }

    setRegisterStatus("Creating account...");

    try {
        const { data, error } = await window.supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    student_id: studentId,
                    name,
                    course,
                    year_level: yearLevel
                }
            }
        });

        if (error) {
            setRegisterStatus(error.message, "error");
            return;
        }

        if (!data.user) {
            setRegisterStatus("Unable to create your account.", "error");
            return;
        }

        if (data.session) {
            const profileError = await saveNewProfile(data.user, {
                studentId,
                name,
                course,
                yearLevel
            });

            if (profileError) {
                console.error(profileError);
                setRegisterStatus("Account created, but the profile could not be saved.", "error");
                return;
            }

            await window.supabaseClient.auth.signOut();
        }

        setRegisterStatus("Account created successfully. Redirecting to login...", "success");

        setTimeout(function () {
            window.location.replace("login.html");
        }, 1200);
    } catch (error) {
        console.error(error);
        setRegisterStatus("Unable to connect. Please try again.", "error");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("register-form")?.addEventListener("submit", handleRegister);
    document.getElementById("register-password")?.addEventListener("input", validatePasswordLive);
    document.getElementById("confirm-password")?.addEventListener("input", checkPasswordMatch);
    document.getElementById("show-password")?.addEventListener("click", function () {
        togglePassword("register-password", "show-password");
    });
    document.getElementById("show-confirm-password")?.addEventListener("click", function () {
        togglePassword("confirm-password", "show-confirm-password");
    });
});
