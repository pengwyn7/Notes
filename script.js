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
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const notesDiv = document.getElementById("notes");
    notesDiv.innerHTML = "";

    data.forEach(note => {

        notesDiv.innerHTML += `
            <div class="note">

                <h3>${note.title}</h3>

                <p>${note.content || ""}</p>

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

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title) {
        alert("Please enter a title.");
        return;
    }

    if (editingId !== null) {

        const { error } = await supabaseClient
            .from("notes")
            .update({
                title: title,
                content: content
            })
            .eq("id", editingId);

        if (error) {
            console.error(error);
            alert("Failed to update note.");
            return;
        }

        editingId = null;

        document.getElementById("saveBtn").textContent =
            "Save Note";

    } else {

        const { error } = await supabaseClient
            .from("notes")
            .insert([
                {
                    title: title,
                    content: content
                }
            ]);

        if (error) {
            console.error(error);
            alert("Failed to save note.");
            return;
        }
    }

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

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
        data.content || "";

    editingId = id;

    document.getElementById("saveBtn").textContent =
        "Update Note";
}

async function deleteNote(id) {

    const confirmDelete =
        confirm("Delete this note?");

    if (!confirmDelete) return;

    const { error } = await supabaseClient
        .from("notes")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        return;
    }

    if (editingId === id) {
        editingId = null;

        document.getElementById("title").value = "";
        document.getElementById("content").value = "";

        document.getElementById("saveBtn").textContent =
            "Save Note";
    }

    loadNotes();
}

loadNotes();