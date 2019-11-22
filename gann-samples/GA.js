function getChromosomeScore(chromsome) {
    return chromsome.score;
}

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
                this.genes.push(possibleValues[Math.floor(Math.random() * possibleValues.length)]);
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
                let newGeneVal = initialGeneValue;
                while (newGeneVal == initialGeneValue) {
                    newGeneVal = this.possibleValues[Math.floor(Math.random() * this.possibleValues.length)];
                }
                genes[i] = newGeneVal;
            }
        }
    }
}

function getCrossoverChildFromParents(parent1, parent2, crossoverPointIndexes) {
    if (parent1.length != parent2.length)
        throw new Error("Not same lengths!");
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

function processGeneration(population) {

    population.calculateFitnessScores();

    population.sortPopulationByFitnessScores();

    let repopulationCount = Math.floor(Math.floor(population.size * population.repopulationRate) / 2) * 2;

    let newChildren = [];
    for(let i = 0; i < repopulationCount / 2; i++)
    {
        let selectedParents = population.chooseTwoSelectedParents();
        let parent1 = selectedParents[0], parent2 = selectedParents[1];
        let parentsSize = parent1.size;
        let crossoverChildren = getCrossoverChildFromParents(parent1.genes, parent2.genes, [Math.ceil(parentsSize / 2)]);

        let child1 = population.makeChromosome(crossoverChildren[0]);
        let child2 = population.makeChromosome(crossoverChildren[1]);
        child1.mutate(population.mutationRate);
        child2.mutate(population.mutationRate);

        let children = [child1, child2];
        newChildren = newChildren.concat(children);
    }
    population.addNewChildren(newChildren);

    population.calculateFitnessScores();
    population.sortPopulationByFitnessScores();

    worstPerformingChromosomes = population.getWorstPerforming(repopulationCount);

    population.removeChildren(worstPerformingChromosomes);
}


function stopCondition(generationNumber) {
    return generationNumber >= maxCalculateGeneration
}
/////////////////////////////////////////////////////
function calculateChromosomeFitness(chromosome) {
    let genes = chromosome.genes;
    let score = genes.length;

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
}

function showProperMessageForGeneration(generationNumber, bestChromosome, lastBestChromosome) {

    let bestChromosomeScore = bestChromosome.score;
    let bestChromosomeGenes = bestChromosome.genes;

    if (lastBestChromosome == undefined) {
        console.log("First generation best chromosome score: " + String(bestChromosomeScore));
        console.log("First generation best chromosome genes: " + String(bestChromosomeGenes));
        return;
    }

    let lastBestChromosomeScore = lastBestChromosome.score;
    let lastBestChromosomeGenes = lastBestChromosome.genes;

    if (bestChromosomeScore > lastBestChromosomeScore) {
        console.log("Improvement in generation #" + String(generationNumber) + " best chromosome score: " + String(bestChromosomeScore));
        console.log("New generation best chromosome genes: " + String(bestChromosomeGenes));
    }

}

let maxCalculateGeneration = 100;

let defaultPossibleValues = [0, 1];

let MUTATION_RATE = 0.01;
let POPULATION_SIZE = 100;
let GENES_COUNT = 50;
let REPOPULATION_RATE = 0.85;
let POSSIBLE_VALUES = defaultPossibleValues;

let population = new Population(POPULATION_SIZE, GENES_COUNT, POSSIBLE_VALUES, MUTATION_RATE, REPOPULATION_RATE);

let lastBestChromosome = undefined;

let generationNumber = 0;

while (!stopCondition(generationNumber)) {

    processGeneration(population);

    bestChromosome = population.getBestPerforming(1)[0];

    showProperMessageForGeneration(generationNumber, bestChromosome, lastBestChromosome);

    lastBestChromosome = bestChromosome;

    generationNumber += 1;
}