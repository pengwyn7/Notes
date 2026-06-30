const SUPABASE_URL = "https://upvpgpugcjkliofkwsij.supabase.co";
const SUPABASE_KEY = "sb_publishable_3iRRINeoTh4Qgi5KG6tGXA_VlkFutPn";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let editingId = null;

async function loadNotes() {

    const { data, error } = await supabaseClient
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    renderNotes(data);

}


function renderNotes(notes) {

    const notesDiv = document.getElementById("notes");

    notesDiv.innerHTML = "";

    if (notes.length === 0) {

        notesDiv.innerHTML = `

        <div class="empty">

            <i class="fa-solid fa-seedling"></i>

            <h2>No Notes Yet</h2>

            <p>Create your first forest note.</p>

        </div>

        `;

        return;

    }

    notes.forEach(note => {

        const date = new Date(note.created_at);

        notesDiv.innerHTML += `

        <div class="note">

            <h3>${note.title}</h3>

            <small>
                ${date.toLocaleDateString()}
            </small>

            <p>

                ${note.content || ""}

            </p>

            <div class="note-buttons">

                <button
                class="edit-btn"
                onclick="editNote(${note.id})">

                    Edit

                </button>

                <button
                class="delete-btn"
                onclick="deleteNote(${note.id})">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

async function addNote() {

    const title =
        document.getElementById("title").value.trim();

    const content =
        document.getElementById("content").value.trim();

    if (!title) {

        alert("Please enter a title.");

        return;

    }

    if (editingId == null) {

        const { error } = await supabaseClient

            .from("notes")

            .insert([
                {
                    title,
                    content
                }
            ]);

        if (error) {

            console.error(error);

            return;

        }

    } else {

        const { error } = await supabaseClient

            .from("notes")

            .update({

                title,

                content

            })

            .eq("id", editingId);

        if (error) {

            console.error(error);

            return;

        }

        editingId = null;

        document.getElementById("saveBtn").textContent =
            "Save Note";

    }

    clearInputs();

    loadNotes();

}

async function editNote(id) {

    const { data, error } = await supabaseClient

        .from("notes")

        .select("*")

        .eq("id", id)

        .single();

    if (error) {

        console.error(error);

        return;

    }

    document.getElementById("title").value =
        data.title;

    document.getElementById("content").value =
        data.content;

    editingId = id;

    document.getElementById("saveBtn").textContent =
        "Update Note";

}


async function deleteNote(id) {

    if (!confirm("Delete this note?"))
        return;

    const { error } = await supabaseClient

        .from("notes")

        .delete()

        .eq("id", id);

    if (error) {

        console.error(error);

        return;

    }

    loadNotes();

}

function clearInputs() {

    document.getElementById("title").value = "";

    document.getElementById("content").value = "";

}

loadNotes();

const searchInput = document.getElementById("search");

if (searchInput) {

    searchInput.addEventListener("keyup", async function () {

        const keyword = this.value.toLowerCase();

        const { data, error } = await supabaseClient
            .from("notes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        const filtered = data.filter(note => {

            return (
                note.title.toLowerCase().includes(keyword) ||
                (note.content || "").toLowerCase().includes(keyword)
            );

        });

        renderNotes(filtered);

    });

}

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const icon = themeBtn.querySelector("i");

        if (document.body.classList.contains("dark")) {

            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");

        } else {

            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");

        }

    });

}


document.addEventListener("DOMContentLoaded", function () {

    const calendarEl = document.getElementById("calendar");

    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: "dayGridMonth",

        height: 430,

        headerToolbar: {

            left: "prev,next",

            center: "title",

            right: "today"

        }

    });

    calendar.render();

});


function animateCards() {

    const cards = document.querySelectorAll(".note");

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(25px)";

        setTimeout(() => {

            card.style.transition = ".35s";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 80);

    });

}

const oldRenderNotes = renderNotes;

renderNotes = function(notes){

    oldRenderNotes(notes);

    animateCards();

};