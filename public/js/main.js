const formReq = document.querySelector(".form-req");

const sendUrl = async (url) => {
    const payload = JSON.stringify({ url });
    const rawResponse = await fetch("/form/sharing", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: payload
    });
    const response = await rawResponse.json();
    return response;
};

const submitUrlEvent = async () => {
    const urlInput = document.querySelector("#url-input");
    await sendUrl(urlInput.value);
    location.reload();
};

formReq.addEventListener("submit", (event) => {
    event.preventDefault();
    submitUrlEvent();
});