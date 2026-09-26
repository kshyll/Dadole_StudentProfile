async function requireAuthentication() {
    if (!window.supabaseClient) {
        window.location.replace("login.html");
        return;
    }

    try {
        const {
            data: { session },
            error
        } = await window.supabaseClient.auth.getSession();

        if (error || !session) {
            window.location.replace("login.html");
        }
    } catch (error) {
        console.error(error);
        window.location.replace("login.html");
    }
}

document.addEventListener("DOMContentLoaded", requireAuthentication);
