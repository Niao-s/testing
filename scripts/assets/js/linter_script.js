let codeeditor = {};
let errorElement = document.getElementById("error");

document.getElementById("clearButton").addEventListener("click", clearTextarea);
document.addEventListener("DOMContentLoaded", function() {
    console.log('dom contetn loaded');
    let codemirror = document.getElementsByClassName("codemirror-textarea")[0];
    // eslint-disable-next-line no-undef
    codeeditor = CodeMirror.fromTextArea(codemirror,{
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        styleActiveSelected: true,
        mode: 'application/json',
        gutters: ["CodeMirror-lint-markers"],
        lint:true

    });
    console.log(codeeditor);
});

function clearTextarea () {
    console.log("clear");
    codeeditor.setValue('');
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