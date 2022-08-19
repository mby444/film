const clearBtn = document.querySelector(".clear-btn");
const deleteBtns = document.querySelectorAll(".delete-btn");
let collection = ""

const clearData = async () => {
    if (prompt("Type 'CONFIRM' to delete") !== "CONFIRM") return;
    try {
        const rawResponse = await fetch(`/admin/collection?name=${collection}&all=1`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        const response = await rawResponse.json();
        console.log(response);
        location.reload();
    } catch (err) {
        console.log(err);
    }
};

clearBtn?.addEventListener("click", () => {
    clearData();
});

const deleteData = async (_id) => {
    if (!confirm("Delete?")) return;
    try {
        const rawResponse = await fetch(`/admin/collection?name=${collection}&id=${_id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        const response = await rawResponse.json();
        console.log(response);
        location.reload();
    } catch (err) {
        console.log(err);
    }
}

const approveData = async (filmId, filmTitle, date) => {
    const filmUrl = prompt("G-Drive URL");
    if (!filmUrl) return;
    try {
        const payload = JSON.stringify({ filmId, filmTitle, date, url: filmUrl });
        const rawResponse = await fetch(`/admin/film`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: payload
        });
        const response = await rawResponse.json();
        console.log(response);
        location.reload();
    } catch (err) {
        console.log(err);
    }
};

const loadPage = (collName) => {
    collection = collName;
};