import * as monaco from 'monaco-editor';

(function IIFE() {
    const userHash = location.hash.replace("#", "");
    let url = "/load/" + userHash;

    let editor;
    let runButton = document.getElementById("run");

    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        let assignment = document.getElementById("assignment-description");
        assignment.textContent = result.assignment;

        editor = monaco.editor.create(document.getElementById('editor'), {
            value: "",
            language: "python",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            theme: "vs-dark",
        });

        runButton.addEventListener("click", function(event) {
            executeCode(event, editor.getModel().getValue(), userHash);
        });
    });
})();

function executeCode(event, editorValue, hash) {
    let encoded = btoa(editorValue);

    let data = {
        hash: hash,
        code: encoded,
    };

    fetch("/save", {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            renderOutput(data.result);
        });
}

function renderOutput(output) {
    let outputElement = document.getElementById("output");

    outputElement.textContent = atob(output);
}
