function cleanAuthValue(value) {
    return String(value ?? "").trim();
}

function setAuthStatus(id, message) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = message;
    }
}

async function checkExistingSession() {
    const {
        data: { session }
    } = await window.supabaseClient.auth.getSession();

    if (session) {
        window.location.replace("index.html");
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const emailField = document.getElementById("login-email");
    const passwordField = document.getElementById("login-password");

    const email = cleanAuthValue(emailField?.value);
    const password = String(passwordField?.value ?? "");

    setAuthStatus("login-status", "");

    if (!email) {
        setAuthStatus(
            "login-status",
            "Please enter your email."
        );

        emailField?.focus();
        return;
    }

    if (!password) {
        setAuthStatus(
            "login-status",
            "Please enter your password."
        );

        passwordField?.focus();
        return;
    }

    setAuthStatus(
        "login-status",
        "Logging in..."
    );

    const { error } =
        await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        console.error("Login failed:", error);

        setAuthStatus(
            "login-status",
            "Invalid email or password."
        );

        return;
    }

    window.location.replace("index.html");
}

async function handleRegister(event) {
    event.preventDefault();

    const studentIdField =
        document.getElementById("register-student-id");

    const nameField =
        document.getElementById("register-name");

    const emailField =
        document.getElementById("register-email");

    const courseField =
        document.getElementById("register-course");

    const yearLevelField =
        document.getElementById("register-year-level");

    const passwordField =
        document.getElementById("register-password");

    const studentId =
        cleanAuthValue(studentIdField?.value);

    const name =
        cleanAuthValue(nameField?.value);

    const email =
        cleanAuthValue(emailField?.value);

    const course =
        cleanAuthValue(courseField?.value);

    const yearLevel =
        cleanAuthValue(yearLevelField?.value);

    const password =
        String(passwordField?.value ?? "");

    setAuthStatus("register-status", "");

    if (!studentId) {
        setAuthStatus(
            "register-status",
            "Please enter your student ID."
        );

        studentIdField?.focus();
        return;
    }

    if (!name) {
        setAuthStatus(
            "register-status",
            "Please enter your full name."
        );

        nameField?.focus();
        return;
    }

    if (!email) {
        setAuthStatus(
            "register-status",
            "Please enter your email."
        );

        emailField?.focus();
        return;
    }

    if (!course) {
        setAuthStatus(
            "register-status",
            "Please enter your course."
        );

        courseField?.focus();
        return;
    }

    if (!yearLevel) {
        setAuthStatus(
            "register-status",
            "Please enter your year level."
        );

        yearLevelField?.focus();
        return;
    }

    if (password.length < 6) {
        setAuthStatus(
            "register-status",
            "Password must contain at least 6 characters."
        );

        passwordField?.focus();
        return;
    }

    setAuthStatus(
        "register-status",
        "Creating account..."
    );

    const { data, error } =
        await window.supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    student_id: studentId,
                    name: name,
                    course: course,
                    year_level: yearLevel
                }
            }
        });

    if (error) {
        console.error("Registration failed:", error);

        setAuthStatus(
            "register-status",
            "Unable to create the student account."
        );

        return;
    }

    if (data.session) {
        await window.supabaseClient.auth.signOut();
    }

    document.getElementById("register-form")?.reset();

    setAuthStatus(
        "register-status",
        "Account created successfully. You may now log in."
    );
}

function setupAuthentication() {
    document
        .getElementById("login-form")
        ?.addEventListener(
            "submit",
            handleLogin
        );

    document
        .getElementById("register-form")
        ?.addEventListener(
            "submit",
            handleRegister
        );

    checkExistingSession();
}

document.addEventListener(
    "DOMContentLoaded",
    setupAuthentication
);
