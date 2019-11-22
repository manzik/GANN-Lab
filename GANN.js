class Population {
    constructor(size, genesCount, possibleValues) {
        this.possibleValues = possibleValues;
        this.size = size;
        this.chromosomes = [];
        for (var i = 0; i < size; i++) {
            this.chromosomes.push(new Chromosome(genesCount, possibleValues));
        }
    }
    reverseFitnessScores() {
        let chromosomes = this.chromosomes;
        let maxScore = undefined;
        for (let i = 0, leni = chromosomes.length; i < leni; i++) {
            var score = chromosomes[i].score;
            if (score > maxScore || maxScore === undefined)
                maxScore = score;
        }
        for (let i = 0, leni = chromosomes.length; i < leni; i++) {
            chromosomes[i].score = maxScore - chromosomes[i].score;
        }
    }
    sortPopulationByFitnessScores() {
        let population = this;
        population.chromosomes.sort((chromosome1, chromosome2) => (chromosome1.score > chromosome2.score ? -1 : 1));
    }
    getNormalizedScores() {
        let population = this;
        let normalizedScores = [];

        let sumScore = 0;

        for (var i = 0, leni = population.size; i < leni; i++) {
            sumScore += population.chromosomes[i].score;
        }
        for (var i = 0, leni = population.size; i < leni; i++) {
            normalizedScores.push(population.chromosomes[i].score / sumScore);
        }
        return normalizedScores;
    }
    resetScores() {
        let population = this;

        for (var i = 0, leni = population.size; i < leni; i++) {
            population.chromosomes[i].score = 0;
        }
    }
    getChromosomeUsingRouletteWheel() {
        let normalizedScores = this.getNormalizedScores();

        let cursor = 0;
        let randomValue = Math.random();
        let selectedIndex = undefined;
        for (var i = 0, leni = this.size; i < leni; i++) {
            cursor += normalizedScores[i];
            if (cursor >= randomValue) {
                selectedIndex = i;
                break;
            }

        }
        return selectedIndex;
    }
    chooseTwoSelectedParents() {
        let population = this;
        let parentsIndexes = [];
        let newParentIndex = this.getChromosomeUsingRouletteWheel();
        while (parentsIndexes.indexOf(newParentIndex) > -1 || parentsIndexes.length < 2) {
            if (parentsIndexes.indexOf(newParentIndex) == -1) {
                parentsIndexes.push(newParentIndex);
            }
            newParentIndex = this.getChromosomeUsingRouletteWheel();
        }
        let parents = [];
        for (var i = 0, leni = parentsIndexes.length; i < leni; i++) {
            parents.push(population.chromosomes[parentsIndexes[i]]);
        }
        return [parents[0], parents[1]]
    }
    makeChromosome(genes) {
        return new Chromosome(genes.length, this.possibleValues, genes)
    }
    addNewChildren(children) {
        for (var i = 0, leni = children.length; i < leni; i++) {
            let child = children[i];
            this.chromosomes.push(child);
        }
        this.updateSize();
    }
    removeChildren(children) /////////// GET BACK TO THIS
    {
        let population = this;
        for (var i = 0, leni = children.length; i < leni; i++) {
            population.chromosomes.splice(population.chromosomes.indexOf(children[i]), 1);
        }
        this.updateSize();
    }
    getBestPerforming(count) {
        let population = this;
        return population.chromosomes.slice(0).sort((chromosome1, chromosome2) => (chromosome1.score > chromosome2.score ? -1 : 1)).slice(0, count);
    }
    getWorstPerforming(count) {
        let population = this;
        return population.chromosomes.slice(0).sort((chromosome1, chromosome2) => (chromosome1.score < chromosome2.score ? -1 : 1)).slice(0, count);
    }
    updateSize() {
        let population = this;
        this.size = population.chromosomes.length;
    }
}

// Random value from normal distribution
// https://stackoverflow.com/a/49434653/4986857
function randn_bm() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

class Chromosome {
    constructor(genesCount, possibleValues, genes) {
        this.size = genesCount;
        this.possibleValues = possibleValues;
        if (genes == undefined) {
            this.genes = [];
            for (var i = 0; i < genesCount; i++)
                this.genes.push(Math.random() * (possibleValues[1] - possibleValues[0]) + possibleValues[0]);
        }
        else {
            this.genes = genes;

        }
        this.score = 0;
    }
    calculateFitness() {
        let chromosome = this;
        chromosome.score = calculateChromosomeFitness(chromosome);
    }
    mutate(rate) {
        let genes = this.genes
        for (var i = 0, leni = genes.length; i < leni; i++) {
            if (Math.random() < rate) {
                let initialGeneValue = genes[i];
                let newGeneVal;
                do {
                    newGeneVal = initialGeneValue + (randn_bm() * 2 - 1);
                }
                while (Math.abs(newGeneVal) > 1);
                //while (newGeneVal == initialGeneValue) {
                //    newGeneVal = this.possibleValues[Math.floor(Math.random() * this.possibleValues.length)];
                //}
                genes[i] = newGeneVal;
            }
        }
    }
}

function getNNChildFromParents(parent1, parent2) {
    let child1 = parent1.slice(0);
    let child2 = parent2.slice(0);

    return [child1, child2];
}

/////////////////////////////////////////////////////

function normalize(arr) {
    let epsilon = 0.000000000001;
    let mean = arr.reduce((a, b) => { return a + b; }) / arr.length;
    let std = Math.sqrt(arr.map((x) => { return Math.pow(x - mean, 2) }).reduce((a, b) => { return a + b; }) / (arr.length - 1));
    return arr.map((x) => { return (x - mean) / (std + epsilon); });
}

function NNActivation(x) {
    switch (options.activationFunction) {
        case 0:
            return x > 0 ? x : 0; // RELU
        case 1:
            return Math.tanh(x); // Tanh
        case 2:
            return (function (x) { return 1 / (1 + Math.exp(-x)) })(x); // Sigmoid
    }
}

function calculateNeuralNet(inputs, weights, layers) {
    let currentLayer = inputs.slice(0);
    let currentLayerIndex = 0;

    let weightsIndex = 0;

    let nrs = [inputs.slice(0)];

    for (let i = 0, leni = layers.length - 1; i < leni; i++) {
        let weightsEndIndex = weightsIndex + layers[i] * layers[i + 1];
        let layerWeights = weights.slice(weightsIndex, weightsEndIndex);

        let currentLayerNeuronsCount = layers[i];
        let nextLayerNeuronsCount = layers[i + 1];

        let newLayer = [];

        for (let j = 0; j < nextLayerNeuronsCount; j++) {
            var neuronValue = 0;

            for (let k = 0; k < currentLayerNeuronsCount; k++) {
                neuronValue += layerWeights[j * currentLayerNeuronsCount + k] * currentLayer[k];
            }


            if (i != layers.length - 2) // not last layer
                neuronValue = NNActivation(neuronValue);

            newLayer.push(neuronValue);
        }

        weightsIndex = weightsEndIndex;

        nrs.push(newLayer.slice(0));

        currentLayer = newLayer.slice(0);
    }

    return currentLayer;
}
