const clearBtn = document.querySelector(".clear-btn");
const deleteBtns = document.querySelectorAll(".delete-btn");
let collection = ""

const clearData = async () => {
    if (!confirm("want to delete all data?")) return;
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

const loadPage = (collName) => {
    collection = collName;
};