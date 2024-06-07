"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Network_1 = require("./Network");
const main = (filePath) => {
    const network = new Network_1.Network();
    network.loadFromFile(filePath);
    try {
        const result = network.run();
        result.trainOperations.forEach(operation => console.log(operation));
        console.log(`Total time taken: ${result.totalTime} minutes.`);
    }
    catch (error) {
        console.error("An error occurred:", error);
    }
};
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Please provide the input file path.");
    process.exit(1);
}
main(args[0]);
