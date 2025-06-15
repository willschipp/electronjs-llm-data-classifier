

window.addEventListener('DOMContentLoaded', async () => {
    const output = document.getElementById('info');
    window.electronAPI.ping('hello from renderer!')
        .then((response) => {
            output.textContent = `received from main: ${response}`;
        })
        .catch(err => {
            console.error(err);
        });
});