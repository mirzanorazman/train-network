"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Network_1 = require("./Network");
const main = (filePath) => {
    const network = new Network_1.Network();
    network.loadFromFile(filePath);
    const result = network.run();
    if (result.errors.length > 0) {
        console.error("Errors encountered:");
        result.errors.forEach(error => console.error(error));
    }
    else {
        result.trainOperations.forEach(operation => console.log(operation));
        console.log(`Total time taken: ${result.totalTime} minutes.`);
    }
};
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Please provide the input file path.");
    process.exit(1);
}
main(args[0]);
