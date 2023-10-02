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
        console.log(json);
        let jsonStr = json.toString();
        console.log(jsonStr);
        jsonlint.parse(jsonStr);
        showErrorElementSuccess();
    }
    catch (err) {
        let lineNumber = err;
        console.log(lineNumber);
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

$(document).ready(function(){
    var code=$(".codemirror-textarea")[0];

    var editor=CodeMirror.fromTextArea(code,{
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        styleActiveSelected: true,
        mode: 'application/json',
        gutters: ["CodeMirror-lint-markers"],
        lint:true

    });

    $json="";
    $('#validate').click(function(){
        try {
        $json=editor.getValue();
        {
            $djson=$json.toString();
            $djson=jsonlint.parse($djson);
            $('#error').show();
            $('#error').removeClass("alert-danger");
            $('#error').addClass("alert-success");
            $("#error").empty().append("Valid Json"); 
        }       
        }
        catch(err) {
            var lineNumber=err;
            var regex = /[+-]?\d+(?:\.\d+)?/g;
            var str = lineNumber.toString();
            var lin;
            var match;
             while (match = regex.exec(str)) {
                 lin=match[0];
                    break;
                }
                $( ".CodeMirror-line:eq("+(lin-1)+")" ).css( "background-color", "#f8d7da");
                $('#error').show();
                $('#error').removeClass("alert-success");
                $('#error').addClass("alert-danger");
                $("#error").empty().append(err);
            }
    })
    $('#reset').click(function(){
        editor.setValue('');
        $('#error').hide();
    });
})