const sendFilmRequest = async (filmId, filmTitle, filmDate) => {
    try {
        const payload = JSON.stringify({ filmId, filmTitle, filmDate });
        const rawResponse = await fetch("/film/req", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: payload
        });
        const response = await rawResponse.json();
        return response;
    } catch (err) {
        return err;
    }
};

const changeClassName = (element, oldname, newname) => {
    if (!element.className) return element;
    let className = element.className.split(" ").map((c) => {
        return c === oldname ? newname : c;
    }).join(" ");
    element.className = className;
};

const displaySpinner = (btn) => {
    const spinner = `
    <span class="spinner-border text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
    </span>`;
    btn.innerHTML = spinner;
};

const disableBtn = (btn, text) => {
    btn.setAttribute("disabled", "true");
    btn.innerHTML = text;
};

const displayReqError = async ({ title="", text="", icon="" }) => {
    await Swal.fire(title, text, icon);
};

const reqBtnEvent = async (filmId, filmTitle, filmDate) => {
    const reqBtn = document.querySelector(".req-btn");
    displaySpinner(reqBtn);
    const response = await sendFilmRequest(filmId, filmTitle, filmDate);
    if (response.message !== "ok") {
        (async () => {
            await displayReqError({ 
                title: "Error", 
                text: "Check your internet connection!", 
                icon: "error",
            });
        })();
        console.error(response.message);
    }
    localStorage.setItem("requested", "1");
    disableBtn(reqBtn, "Requested");
    changeClassName(reqBtn, "btn-warning", "btn-secondary");
};

const checkReqBtn = () => {
    const reqBtn = document.querySelector(".req-btn");
    const requested = localStorage.getItem("requested");
    if (!(reqBtn && requested)) return;
    disableBtn(reqBtn, "Requested");
    changeClassName(reqBtn, "btn-warning", "btn-secondary");
};

window.addEventListener("load", () => {
    checkReqBtn();
});