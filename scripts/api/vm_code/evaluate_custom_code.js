const vm = require("vm");
const generate_name = require("../vm_code/generate_random_name");

const evaluate_code = (body, codeStr) => {
    let predefinedCodeStr = 'const crypto = require("crypto"); const generate_name = require("../vm_code/generate_random_name");';
    let context = {
        require,
        console,
        ...body
    };
    const code = predefinedCodeStr + codeStr;
    vm.runInNewContext(code, context);
    delete context.require;
    delete context.console;
    return context;
}

module.exports = evaluate_code;