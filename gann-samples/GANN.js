class Population {
    constructor(size, genesCount, possibleValues, mutationRate, repopulationRate) {
        this.possibleValues = possibleValues;
        this.size = size;
        this.mutationRate = mutationRate;
        this.repopulationRate = repopulationRate;
        this.chromosomes = [];
        for (var i = 0; i < size; i++) {
            this.chromosomes.push(new Chromosome(genesCount, possibleValues));
        }
    }
    calculateFitnessScores() {
        let population = this;
        for (var i = 0; i < population.size; i++) {
            let targetChromosome = population.chromosomes[i];
            targetChromosome.calculateFitness();
        }
    }
    reverseFitnessScores()
    {
        let chromosomes = this.chromosomes;
        let maxScore = undefined;
        for(let  i =0;i<chromosomes.length; i++)
        {
            var score = chromosomes[i].score;
            if(score > maxScore || maxScore === undefined)
                maxScore = score;
        }
        for(let  i =0;i<chromosomes.length; i++)
        {
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
        for (var i = 0; i < population.size; i++) {
            sumScore += population.chromosomes[i].score;
        }
        for (var i = 0; i < population.size; i++) {
            normalizedScores.push(population.chromosomes[i].score / sumScore);
        }
        return normalizedScores;
    }
    getChromosomeUsingRouletteWheel() {
        let normalizedScores = this.getNormalizedScores();

        let cursor = 0;
        let randomValue = Math.random();
        let selectedIndex = undefined;
        for (var i = 0; i < population.size; i++) {
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
        for (var i = 0; i < parentsIndexes.length; i++) {
            parents.push(population.chromosomes[parentsIndexes[i]]);
        }
        return [parents[0], parents[1]]
    }
    makeChromosome(genes) {
        return new Chromosome(genes.length, this.possibleValues, genes)
    }
    addNewChildren(children) {
        for (var i = 0; i < children.length; i++) {
            let child = children[i];
            this.chromosomes.push(child);
        }
        this.updateSize();
    }
    removeChildren(children) /////////// GET BACK TO THIS
    {
        let population = this;
        for (var i = 0; i < children.length; i++) {
            population.chromosomes.splice(population.chromosomes.indexOf(children[i]), 1);
        }
        this.updateSize();
    }
    getBestPerforming(count) {
        let population = this;
        return population.chromosomes.slice(0).sort((chromosome1, chromosome2) => (chromosome1.score > chromosome2.score ? -1 : 1)).slice(0, count);
    }
    getWorstPerforming(count) {
        return population.chromosomes.slice(0).sort((chromosome1, chromosome2) => (chromosome1.score < chromosome2.score ? -1 : 1)).slice(0, count);
    }
    updateSize() {
        this.size = population.chromosomes.length;
    }
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
            this.score = undefined;
        }
    }
    calculateFitness() {
        let chromosome = this;
        chromosome.score = calculateChromosomeFitness(chromosome);
    }
    mutate(rate) {
        let genes = this.genes
        for (var i = 0; i < genes.length; i++) {
            if (Math.random() < rate) {
                let initialGeneValue = genes[i];
                let newGeneVal = initialGeneValue + (Math.random()*2-1) / 10;
                //while (newGeneVal == initialGeneValue) {
                //    newGeneVal = this.possibleValues[Math.floor(Math.random() * this.possibleValues.length)];
                //}
                genes[i] = newGeneVal;
            }
        }
    }
}

function getCrossoverChildFromParents(parent1, parent2, crossoverPointIndexes) {
    if (parent1.length != parent2.length) {
        console.log("Not same lengths!");
    }
    let child1 = [];
    let child2 = [];
    let genesCount = parent1.length;
    let cursorOnFirstParent = true;
    let firstChildCrossingParent = parent1;
    let secondChildCrossingParent = parent2;
    for (var i = 0; i < genesCount; i++) {
        if (crossoverPointIndexes.indexOf(i) > -1) {
            cursorOnFirstParent = !cursorOnFirstParent;
            if (cursorOnFirstParent) {
                firstChildCrossingParent = parent1;
                secondChildCrossingParent = parent2;
            }
            else {
                firstChildCrossingParent = parent2;
                secondChildCrossingParent = parent1;
            }
        }
        child1.push(firstChildCrossingParent[i])
        child2.push(secondChildCrossingParent[i])
    }
    return [child1, child2]
}

// Just return the parents
function getNNChildFromParents(parent1, parent2)
{
    let child1 = parent1.slice(0);
    let child2 = parent2.slice(0);

    return [child1, child2];
}

function processGeneration(population) {

    population.calculateFitnessScores();
    population.reverseFitnessScores();
    population.sortPopulationByFitnessScores();

    let repopulationCount = Math.floor(Math.floor(population.size * population.repopulationRate) / 2) * 2;

    let newChildren = [];
    for(let i = 0; i < repopulationCount / 2; i++)
    {
        let selectedParents = population.chooseTwoSelectedParents();
        let parent1 = selectedParents[0], parent2 = selectedParents[1];
        let NNChildren = getNNChildFromParents(parent1.genes, parent2.genes);

        let child1 = population.makeChromosome(NNChildren[0]);
        let child2 = population.makeChromosome(NNChildren[1]);

        child1.mutate(population.mutationRate);
        child2.mutate(population.mutationRate);

        newChildren = newChildren.concat([child1, child2]);
    }

    population.calculateFitnessScores();
    population.reverseFitnessScores();
    population.sortPopulationByFitnessScores();

    worstPerformingChromosomes = population.getWorstPerforming(repopulationCount);

    population.removeChildren(worstPerformingChromosomes);
    population.addNewChildren(newChildren);
}

function stopCondition(generationNumber) {
    return generationNumber >= maxCalculateGeneration;
}
/////////////////////////////////////////////////////
function calculateChromosomeFitness(chromosome) {
    let genes = chromosome.genes;
    let score = 0;

    var randNum1 = Math.random() * 2 - 1;
    var randNum2 = Math.random() * 2 - 1;

    var targetOutput = randNum1 * (-1) + randNum2 * (2);

    let neuralNetOutput = calculateNeuralNet([randNum1 + 0, randNum2 + 0], genes, neuralNetLayers);
    neuralNetOutput = neuralNetOutput[0];

    return Math.pow(neuralNetOutput - targetOutput, 2);
    /*
    for (var i = 0; i < genes.length; i++) {
        let firstHalf = i < genes.length / 2;
        let gene = genes[i];
        if (firstHalf) {
            score += gene;
        }
        else {
            score -= gene;
        }
    }
    return score
    */
}

function NNActivation(x)
{
    // RELU
    return x >= 0 ? x : 0;
    // Sigmoid
    return (function(x){return 1/(1+Math.exp(-x))})(x);
}

function calculateNeuralNet(inputs, weights, layers)
{
    let currentLayer = inputs.slice(0);

    let weightsIndex = 0;
    
    for(var i = 0; i < layers.length - 1; i++)
    {
        let weightsEndIndex = weightsIndex + layers[i] * layers[i + 1];
        let layerWeights = weights.slice(weightsIndex, weightsEndIndex);

        let currentLayerNeuronsCount = layers[i];
        let nextLayerNeuronsCount = layers[i + 1];

        let newLayer = [];

        for(var j = 0; j < nextLayerNeuronsCount; j++)
        {
            var neuronValue = 0;

            for(var k = 0; k < currentLayerNeuronsCount; k++)
            {
                neuronValue += layerWeights[j * currentLayerNeuronsCount + k] * currentLayer[k];
            }


            if(i != layers.length - 2) // not last layer
                neuronValue = NNActivation(neuronValue);

            newLayer.push(neuronValue);
        }

        weightsIndex = weightsEndIndex;

        currentLayer = newLayer.slice(0);
    }

    return currentLayer;
}

let neuralNetLayers = [2, 3, 3, 1];

let defaultPossibleValues = [-2, 2];

let maxCalculateGeneration = 1 * 1000;

let MUTATION_RATE = 0.05;
let POPULATION_SIZE = 500;
let REPOPULATION_RATE = 0.85;
let GENES_COUNT = neuralNetLayers.map((x, i, arr)=>{return i < arr.length - 1?x * arr[i+1]:0}).reduce((a,b)=>{return a+b});
let POSSIBLE_VALUES = defaultPossibleValues;
let population = new Population(POPULATION_SIZE, GENES_COUNT, POSSIBLE_VALUES, MUTATION_RATE, REPOPULATION_RATE);

let lastBestChromosome = undefined;

let generationNumber = 0;

while (!stopCondition(generationNumber)) {
    if(generationNumber % 100 == 0)
        console.log(generationNumber + "/" + maxCalculateGeneration);
    processGeneration(population);

    bestChromosome = population.getBestPerforming(1)[0];

    lastBestChromosome = bestChromosome;

    generationNumber += 1;
}

bestChromosome = population.getWorstPerforming(1)[0];

console.log("Best chromosome genes (weights):", bestChromosome.genes);

let MSE = 0;
let errorMeasurementSampleCount = 20;

for(var i = 0; i < errorMeasurementSampleCount; i++)
{
    var randNum1 = Math.random() * 2 - 1;
    var randNum2 = Math.random() * 2 - 1;

    var targetOutput = randNum1 * (-1) +  randNum2 * 2;
    var modelOutput = calculateNeuralNet([randNum1, randNum2], bestChromosome.genes, neuralNetLayers);

    console.log("inputs:", [randNum1, randNum2], "predicted:", modelOutput, "ground truth:", [targetOutput]);

    let SE = Math.pow(modelOutput - targetOutput, 2);
    console.log("Squared error:", SE);

    MSE += SE;
}

MSE /= errorMeasurementSampleCount;

console.log("Mean squared error over", errorMeasurementSampleCount, "samples:", MSE);