async function requireAuthentication() {
    const {
        data: { session },
        error
    } = await window.supabaseClient.auth.getSession();

    if (error || !session) {
        window.location.replace("login.html");
    }
}

window.supabaseClient.auth.onAuthStateChange(
    function (event, session) {
        if (event === "SIGNED_OUT" || !session) {
            window.location.replace("login.html");
        }
    }
);

requireAuthentication();
