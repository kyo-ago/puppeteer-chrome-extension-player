chrome.debugger.attach(debuggee, '1.3', () => {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }
    debugger;
});