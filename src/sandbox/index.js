window.ws = WebSocket;
window.mime = {};

window["require"] = (mod) => {
    return require('./puppeteer');
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("button").addEventListener("click", () => {
        let value = document.querySelector("textarea").value;
        eval(value);
    });
});
