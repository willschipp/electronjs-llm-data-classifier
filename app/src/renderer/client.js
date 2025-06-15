const inputElement = document.getElementById('text');
const outputElement = document.getElementById('output');
const extractedElement = document.getElementById('extracted');

document.getElementById('processButton').addEventListener('click',async () => {
    // let dataSource = document.getElementById('text');
    let val = inputElement.value;
    const result = await window.electronAPI.run(val);

    //write out the results
    outputElement.innerText = JSON.stringify(result, null, 2);

});

document.getElementById('extractButton').addEventListener('click',async () => {
    let fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        extractedElement.innerText = "Please select a file first";
        return;
    }

    const file = fileInput.files[0];

    try {
        const result = await window.electronAPI.extract(file); //send the PATH
        extractedElement.innerText = JSON.stringify(result, null, 2);
    }
    catch (err) {
        extractedElement.innerText = 'error: ' + err.message;
    }
});