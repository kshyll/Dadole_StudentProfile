function setSkillsStatus(message) {
    const status = document.getElementById("skills-status");

    if (status) {
        status.textContent = message;
    }
}

function cleanSkills(skills) {
    if (Array.isArray(skills)) {
        return skills
            .map(skill => String(skill).trim())
            .filter(skill => skill);
    }

    if (typeof skills === "string") {
        return skills
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill);
    }

    return [];
}

function renderSkills(skills) {
    const grid = document.getElementById("skills-grid");

    if (!grid) {
        return;
    }

    grid.replaceChildren();

    if (skills.length === 0) {
        setSkillsStatus("No skills have been added yet.");
        return;
    }

    skills.forEach((skill, index) => {
        const card = document.createElement("article");
        card.className = "skill-card";

        const number = document.createElement("span");
        number.className = "skill-number";
        number.setAttribute("aria-hidden", "true");
        number.textContent = String(index + 1).padStart(2, "0");

        const title = document.createElement("h2");
        title.textContent = skill;

        const description = document.createElement("p");
        description.textContent = "(To be edited)";

        card.appendChild(number);
        card.appendChild(title);
        card.appendChild(description);

        grid.appendChild(card);
    });

    setSkillsStatus("");
}

async function loadSkills() {
    if (!window.supabaseClient) {
        setSkillsStatus("Unable to retrieve your skills. Please try again.");
        return;
    }

    try {
        const {
            data: { session },
            error: sessionError
        } = await window.supabaseClient.auth.getSession();

        if (sessionError || !session) {
            window.location.replace("login.html");
            return;
        }

        const { data, error } = await window.supabaseClient
            .from("profiles")
            .select("skills")
            .eq("user_id", session.user.id)
            .single();

        if (error) {
            console.error(error);
            setSkillsStatus("Unable to retrieve your skills. Please try again.");
            return;
        }

        const skills = cleanSkills(data.skills);

        renderSkills(skills);
    } catch (error) {
        console.error(error);
        setSkillsStatus("Unable to retrieve your skills. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", loadSkills);
