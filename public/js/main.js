// const formReq = document.querySelector(".form-req");
const formQuest = document.querySelector(".form-quest");

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

// formReq.addEventListener("submit", (event) => {
//     event.preventDefault();
//     submitUrlEvent();
// });

formQuest.addEventListener("submit", (event) => {
    event.preventDefault();
    submitQuestionEvent();
});