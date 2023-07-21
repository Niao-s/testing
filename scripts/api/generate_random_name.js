const crypto = require("crypto");

const generate_random_name = (...args) => {
    let generatedGuid = crypto.randomUUID();
    console.log(args);
    console.log(generatedGuid);
    let oppName = "Opportunity: ";
    args.forEach(elem => {
        oppName += ' ' + elem;
    })
    return oppName;
}

module.exports = generate_random_name;