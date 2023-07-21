const crypto = require("crypto");

const generate_random_name = () => {
    let generatedGuid = crypto.randomUUID();
    console.log(generatedGuid);
    return "test name " + generatedGuid;
}

module.exports = generate_random_name;