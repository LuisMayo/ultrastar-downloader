const fs = require('fs');
const input = JSON.parse(fs.readFileSync(process.argv[2]));
const ultrastar = require('./ultrastar');
ultrastar.main(input).then(() => {});
