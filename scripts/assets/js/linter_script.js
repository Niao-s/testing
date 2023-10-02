let codeEditor = {};
let errorElement = document.getElementById("error");

document.getElementById("clearButton").addEventListener("click", clearTextarea);
document.getElementById("validateButton").addEventListener("click", validateJson);

document.addEventListener("DOMContentLoaded", function() {
    console.log('dom contetn loaded');
    let codemirror = document.getElementsByClassName("codemirror-textarea")[0];
    // eslint-disable-next-line no-undef
    codeEditor = CodeMirror.fromTextArea(codemirror,{
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        styleActiveSelected: true,
        mode: 'application/json',
        gutters: ["CodeMirror-lint-markers"],
        lint:true

    });
});

function validateJson () {
    try{
        let json = codeEditor.getValue();
        let jsonStr = json.toString();
        jsonlint.parse(jsonStr);
        showErrorElementSuccess();
    }
    catch (err) {
        let lineNumber = err;
        console.log(err);
        let regex = /[+-]?\d+(?:\.\d+)?/g;
        let str = lineNumber.toString();
        let lin;
        let match;
        while (match = regex.exec(str)) {
            lin=match[0];
            break;
        }
        let errorElem = document.querySelectorAll(".CodeMirror-line")[lin-1];
        errorElem.style["background-color"] = "#f8d7da";
        showErrorElementError(err);
    }
}

function clearTextarea () {
    codeEditor.setValue('');
    hideErrorElement();
}

function hideErrorElement () {
    errorElement.style.display = "none";
}

function showErrorElement () {
    errorElement.style.display = "block";
}

function showErrorElementSuccess () {
    showErrorElement();
    errorElement.classList.remove("alert-danger");
    errorElement.classList.add("alert-success");
    errorElement.innerText = "Valid Json";
}

function showErrorElementError (text) {
    showErrorElement();
    errorElement.classList.remove("alert-success");
    errorElement.classList.add("alert-danger");
    errorElement.innerText = text;
}