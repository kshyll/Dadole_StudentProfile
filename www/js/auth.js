function setLoginStatus(message, type = "") {
    const status = document.getElementById("login-status");

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

async function checkExistingSession() {
    if (!window.supabaseClient) {
        return;
    }

    try {
        const {
            data: { session }
        } = await window.supabaseClient.auth.getSession();

        if (session) {
            window.location.replace("index.html");
        }
    } catch (error) {
        console.error(error);
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    setLoginStatus("");

    if (!email) {
        setLoginStatus("Please enter your email.", "error");
        document.getElementById("login-email").focus();
        return;
    }

    if (!password) {
        setLoginStatus("Please enter your password.", "error");
        document.getElementById("login-password").focus();
        return;
    }

    if (!navigator.onLine) {
        setLoginStatus("Internet connection is required.", "error");
        return;
    }

    if (!window.supabaseClient) {
        setLoginStatus("Unable to connect to Supabase.", "error");
        return;
    }

    setLoginStatus("Logging in...");

    try {
        const { error } = await window.supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setLoginStatus("Invalid email or password.", "error");
            return;
        }

        window.location.replace("index.html");
    } catch (error) {
        console.error(error);
        setLoginStatus("Unable to connect. Please try again.", "error");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-form")?.addEventListener("submit", handleLogin);
    checkExistingSession();
});
