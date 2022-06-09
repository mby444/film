const sendFilmRequest = async (filmId, filmTitle, filmDate) => {
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
    console.log(response);
};