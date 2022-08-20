class LoginError {
    constructor(name="", message="") {
        this.name = name;
        this.message = message;
    }
}

const getLoginErrorMessage = (name="") => {
    const errorList = [
        new LoginError("session_expired", "Your session has been expired, please login again"),
        new LoginError("invalid", "Invalid email or password"),
        new LoginError("empty", "Email and password are required")
    ];
    const loginError = errorList.find((error, i) => {
        return error.name === name.toLowerCase();
    });
    const errorMessage = loginError?.message || "";
    return errorMessage;
};

export { getLoginErrorMessage };