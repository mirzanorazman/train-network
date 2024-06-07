import { Network } from './Network';

const main = (filePath: string) => {
    const network = new Network();
    network.loadFromFile(filePath);

    try {
        const result = network.run();
        result.trainOperations.forEach(operation => console.log(operation));
        console.log(`Total time taken: ${result.totalTime} minutes.`);

    } catch (error) {
        console.error("An error occurred:", error);
    }

   
    
};

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Please provide the input file path.");
    process.exit(1);
}

main(args[0]);