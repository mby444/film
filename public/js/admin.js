const deleteLoginCookies = async () => {
    const rawRsponse = await fetch("/admin/logout", {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });
    const response = await rawRsponse.json();
    return response;
}

const logout = async () => {
    if (!confirm("Log out?")) return;
    const loggedOut = await deleteLoginCookies();
    location.reload();
};