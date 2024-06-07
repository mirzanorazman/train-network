# Train Network Simulation

This project simulates a train network with multiple stations, connected with tracks, packages and trains. It calculates the optimal routes for train to pickup and deliver package based on the network configuration provided in a JSON file.

## Installation

1. Clone the repository

```sh
git clone https://github.com/mirzanorazman/train-network.git
cd train-network
```

2. Install dependencies

```sh
npm install
```

3. Compile TypeScript files

```sh
npx tsc
```

### Running the simulation

1. Create a network configuration file. This repo has two examples of a configuration file, `network-simple.json` and `network-complex.json`

2. Run the simulation

```sh
node dist/main.js ./src/data/network-complex.json
```

3. View the results

- At the end of the simulation, the console will display the result which consist of train movements and the total time taken for the simulation to complete (in `journeyTimeInMinutes` unit)

### Running the test

- `npm test`

## Requirements

- Network input is a JSON file.
- Console log output of the train operations.

## Discussion

Optimization:

1. The simulation uses a path finding algorithm called Dijkstra's algorithm to determine the shortest time taken for a train to travel between stations. Since the train network is a type of weighted graph, using Dijkstra's is more optimal in terms finding the shortest route (in time) than using the regular Breadth First Search algorithm.
2. For the train-package assignments, I use a greedy approach by taking the closest train to a certain package for pickup.
