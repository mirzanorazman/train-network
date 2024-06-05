import { Network } from './Network';

const main = (filePath: string) => {
    const network = new Network();
    network.loadFromFile(filePath);
    const result = network.run();

    if (result.errors.length > 0) {
        console.error("Errors encountered:");
        result.errors.forEach(error => console.error(error));
    } else {
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