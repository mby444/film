// const formReq = document.querySelector(".form-req");
const formQuest = document.querySelector(".form-quest");
const queryInput = document.querySelector("#q-input");
const suggestionContainer = document.querySelector(".live-suggestion-container");

// const sendUrl = async (url) => {
//     const payload = JSON.stringify({ url });
//     const rawResponse = await fetch("/form/sharing", {
//         method: "POST",
//         headers: {
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         },
//         body: payload
//     });
//     const response = await rawResponse.json();
//     return response;
// };

const sendQuestion = async (email, message) => {
    const payload = JSON.stringify({ email, message });
    const rawResponse = await fetch("/form/question", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: payload
    });
};

// const submitUrlEvent = async () => {
//     const urlInput = document.querySelector("#url-input");
//     await sendUrl(urlInput.value);
//     location.reload();
// };

const clearForm = () => {
    const emailInput = document.querySelector("#email-input");
    const messageInput = document.querySelector("#message-input");

    emailInput.value = "";
    messageInput.value = "";
};

const submitQuestionEvent = async () => {
    const [email, message] = [
        document.querySelector("#email-input"),
        document.querySelector("#message-input")
    ];
    await sendQuestion(email.value, message.value);
    await Swal.fire({ title: "Message sent!", text: `Thank you!\nI will reply through Email if needed`, icon: "success" });
    clearForm();
};

const getSuggestions = async (text) => {
    if (!text) return [];
    try {
        const rawResponse = await fetch(`/film/search?q=${text}`);
        const response = await rawResponse.json();
        const suggestions = response.results?.map((result) => {
            let filmId = result.id;
            let title = result.title;
            let year = result.release_date?.split("-")[0];
            return { filmId, title, year };
        });
        return suggestions;
    } catch (err) {
        console.log(err);
        return [];
    }
}

const getSuggestionElement = (suggestion) => {
    let year = suggestion.year ? `(${suggestion.year})` : "";
    let element = `
        <div class="row p-1 pt-0 pb-0">
            <a href="/info/${suggestion.filmId}" class="text-dark" style="text-decoration:none;">${suggestion.title} ${year}</a>
        </div>
    `;
    return element;
};

const displaySuggestions = (suggestions=[]) => {
    if (suggestions.length === 0) {
        suggestionContainer.innerHTML = "";
        suggestionContainer.style.display = "none";
        return;
    }
    suggestionContainer.style.display = "block";
    let elements = [];
    suggestions.forEach((suggestion) => {
        let element = getSuggestionElement(suggestion);
        elements.push(element);
    });
    elements.splice(10, elements.length - 10);
    suggestionContainer.innerHTML = elements.join("");
};

// formReq.addEventListener("submit", (event) => {
//     event.preventDefault();
//     submitUrlEvent();
// });

formQuest.addEventListener("submit", (event) => {
    event.preventDefault();
    submitQuestionEvent();
});

queryInput.addEventListener("input", async (event) => {
    const suggestions = await getSuggestions(event.target.value);
    displaySuggestions(suggestions);
});

queryInput.addEventListener("blur", () => {
    setTimeout(() => {
        displaySuggestions([]);
    }, 150);
});