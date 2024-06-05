import { Network } from './Network';

const main = (filePath: string) => {
    const network = new Network();
    network.loadFromFile(filePath);
    network.run();
};

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Please provide the input file path.");
    process.exit(1);
}

main(args[0]);