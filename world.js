class World
{
    constructor(width, height, options)
    {
        this.width = width;
        this.height = height;
        this.individuals = [];
        this.bestIndividual = { ind: null, score: 0, individual: null };
        this.followingIndividualProps = { ind: null, individual: null };
        this.collisions = [];
        this.spawnPoint = { x: this.width / 2, y: this.height / 2 };
        this.options = options;
        this.generation = 0;
        this.stepSpeed = 1;
    }
    setGANN(sensorsCoverage, hiddenLayers, hiddenLayerNeurons, hiddenLayerNeuronsShrink)
    {
        this.generation = 0;
        this.onGenerationChange();

        let sensorsCount = 
        (sensorsCoverage >= 1 ? 1 : 0) + // First forward-looking sensor, only 1
        (sensorsCoverage > 1 ? (Math.min(sensorsCoverage, 6) - 1) * 2 : 0) + // Sides looking sensors, 2 for each side
        (sensorsCoverage == 7 ? 1 : 0); // Last behind-looking sensor, only 1
        
        // One more input neuron for whether the individual has been in the current cell or not
        let inputsCount = sensorsCount + 2
        let outputsCount = 3;

        let neuralNetLayers = [];
        neuralNetLayers.push(inputsCount);
        for(let i = 0; i < hiddenLayers; i++)
        {
            if(hiddenLayerNeuronsShrink && hiddenLayerNeurons > outputsCount)
            {
                let layerIndRatio = i / hiddenLayers;
                neuralNetLayers.push(Math.round((hiddenLayerNeurons * (1 - layerIndRatio) + outputsCount * (layerIndRatio))));
            }
            else
                neuralNetLayers.push(hiddenLayerNeurons);
        }
        neuralNetLayers.push(outputsCount);

        let sensorAngleDifference = Math. PI * 2 / 12;
        let sensors = [
            // Front looking sensor for sensorsCoverage >= 1
            { x: 0.5, y: 0, angle: (sensorAngleDifference * 0) },
            
            // Side sensors for sensorsCoverage >= 2
            { x: 0.5, y: 0, angle: (sensorAngleDifference * 1) },
            { x: 0.5, y: 0, angle: (-sensorAngleDifference * 1) },

            // Side sensors for sensorsCoverage >= 3
            { x: 0.5, y: 0, angle: (sensorAngleDifference * 2) },
            { x: 0.5, y: 0, angle: (-sensorAngleDifference * 2) },

            // Side sensors for sensorsCoverage >= 4
            { x: 0.5, y: 0, angle: (sensorAngleDifference * 3) },
            { x: 0.5, y: 0, angle: (-sensorAngleDifference * 3) },

            // Side sensors for sensorsCoverage >= 5
            { x: 0.5, y: 0, angle: (sensorAngleDifference * 4) },
            { x: 0.5, y: 0, angle: (-sensorAngleDifference * 4) },

            // Side sensors for sensorsCoverage >= 5
            { x: 0.5, y: 0, angle: (sensorAngleDifference * 5) },
            { x: 0.5, y: 0, angle: (-sensorAngleDifference * 5) },

            // Behind looking sensor for sensorsCoverage == 7
            { x: 0.5, y: 0, angle: (sensorAngleDifference * 6) },
        ];

        sensors = sensors.slice(0, sensorsCount);

        // GANN: Genetic Algorithm + Neural Network
        let POPULATION_SIZE = options.populationCount;
        let defaultPossibleValues = [-1, 1];
        
        // Count number of the genes needed to represent the neural network
        GENES_COUNT = neuralNetLayers.map((x, i, arr) => { return i < arr.length - 1 ? x * arr[i + 1] : 0 }).reduce((a, b) => { return a + b });
        POSSIBLE_VALUES = defaultPossibleValues;

        world.GANN = {};
        world.GANN.population = new Population(POPULATION_SIZE, GENES_COUNT, POSSIBLE_VALUES);

        world.individuals = [];
        for (let i = 0, leni = options.populationCount; i < leni; i++)
        {
            let newIndividual = new Individual(world, sensors, i, { neuralNetLayers, curiosityGridBlockSize });
            world.addNewIndividual(newIndividual);
        }

        this.neuralNetLayers = neuralNetLayers;
        this.sensors = sensors;
    }
    onGenerationChange()
    {
        this.options.onGenerationChange && this.options.onGenerationChange(world.generation + 1);
    }
    resetPopulationKnowledge()
    {
        this.GANN.population.chromosomes = this.GANN.population.chromosomes.map(()=>{return new Chromosome(GENES_COUNT, POSSIBLE_VALUES); });
        this.generation = 0;
        this.onGenerationChange();
    }
    addCollision(x1, y1, x2, y2, visible = true) // line
    {
        this.collisions.push({ x1, y1, x2, y2, visible: visible });
    }
    addNewIndividual(individual)
    {
        this.individuals.push(individual);
    }
    stepWorld()
    {
        let worldDone = true;

        this.individuals.forEach((individual, ind) =>
        {
            if (individual.dead)
                return;
            else
                worldDone = false;

            let hadCollision = individual.stepIndividual();
            if (hadCollision)
            {
                individual.dead = true;
                let individualScore = individual.calculateScore();

                if (individualScore > this.bestIndividual.score)
                {
                    this.bestIndividual.ind = ind;
                    this.bestIndividual.score = individualScore;
                    this.bestIndividual.individual = individual;
                }
            }
        });

        return worldDone;
    }
    autoSetMapCollisions()
    {
        world.collisions = [];

        // <screen boundries>
        world.addCollision(0, 0, world.width, 0, false);
        world.addCollision(0, 0, 0, world.height, false);
        world.addCollision(0, world.height, world.width, world.height, false);
        world.addCollision(world.width, 0, world.width, world.height, false);
        // </screen boundries>
        let collisions = getCollisionPoints(world);
        collisions.forEach((collision) =>
        {
            world.addCollision(collision.x1, collision.y1, collision.x2, collision.y2);
        });
    }
    resetWorld()
    {
        this.individuals.forEach((individual) =>
        {
            individual.setProperties();
        });
        this.followingIndividualProps = this.bestIndividual;
        this.bestIndividual = { ind: null, score: 0, individual: null };
        this.GANN.population.resetScores();
    }
    getBestScore()
    {
        return Math.max.apply(null, this.individuals.map((x) => { return x.score; }));
    }
    nextGeneration()
    {
        console.log("Best score this generation:", this.getBestScore());
        onBeforeNextGeneration();
        this.generation++;
        this.onGenerationChange();

        let population = this.GANN.population;

        let repopulationCount = Math.min(Math.floor(options.repopulationRate * population.size / 2) * 2, population.size - 4);
        
        population.sortPopulationByFitnessScores();

        let newChildren = [];

        let worstPerformingChromosomes = population.getWorstPerforming(repopulationCount);
        population.removeChildren(worstPerformingChromosomes);

        for (let i = 0, leni = repopulationCount / 2; i < leni; i++)
        {

            let selectedParents = population.chooseTwoSelectedParents();
            let parent1 = selectedParents[0], parent2 = selectedParents[1];

            let parentsSize = parent1.size;
            let NNChildren = getNNChildFromParents(parent1.genes, parent2.genes);

            let child1 = population.makeChromosome(NNChildren[0]);
            let child2 = population.makeChromosome(NNChildren[1]);


            child1.mutate(options.mutationRate);
            child2.mutate(options.mutationRate);

            newChildren.push.apply(newChildren, [child1, child2]);
        }
        population.addNewChildren(newChildren);

        if(options.mapPreset == 0) // mapPreset: Auto generate
            this.autoSetMapCollisions();
        
        

        this.resetWorld();
    }
}

// https://stackoverflow.com/a/37265703/4986857
var lineSegmentsIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) =>
{
    var a_dx = x2 - x1;
    var a_dy = y2 - y1;
    var b_dx = x4 - x3;
    var b_dy = y4 - y3;
    var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
    var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
    return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
}

function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
    var ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom == 0)
    {
        return null;
    }
    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
}

// x and y means position inside the cells index
// posX and posY means position inside the actual world
class CuriosityGrid
{
    constructor(gridSize, world)
    {
        this.world = world;

        this.gridSize = gridSize;

        this.gridSizeX = this.gridSize;
        this.gridSizeY = this.gridSize;

        this.sizeX = Math.ceil(world.width / this.gridSizeX);
        this.sizeY = Math.ceil(world.height / this.gridSizeY);

        this.grid = [];
        let grid = this.grid;

        for (let i = 0, leni = this.sizeX * this.sizeY; i < leni; i++)
        {
            grid.push(0);
        }

        this.foundGridInd = 0;
    }
    getCellIndex(x, y)
    {
        return y * this.sizeX + x;
    }
    getCellValue(x, y)
    {
        let ind = this.getCellIndex(x, y);
        return this.grid[ind];
    }
    setCellValue(x, y, value)
    {
        let ind = this.getCellIndex(x, y);
        this.grid[ind] = value;

        return true;
    }
    getPointBlockPos(posX, posY)
    {
        let x, y;

        x = Math.floor(posX / this.gridSizeX);

        y = Math.floor(posY / this.gridSizeY);

        return { x, y };
    }
    getPointBlockIndex(posX, posY)
    {
        var { x, y } = this.getPointBlockPos(posX, posY);
        return this.getCellIndex(x, y);
    }
    setPointBlockValue(posX, posY, value)
    {
        let { x, y } = this.getPointBlockPos(posX, posY);

        return this.setCellValue(x, y, value);
    }
    getPointBlockValue(posX, posY, value)
    {
        let { x, y } = this.getPointBlockPos(posX, posY);

        return this.getCellValue(x, y);
    }
    getGridSum()
    {
        return this.grid.reduce((x, y) => { return x + y; });
    }
    getCellNeighbours(posX, posY, spreadCells)
    {
        let valuesCount = 0
        let valuesSum = 0;
        for (let x = Math.max(0, posX - spreadCells); x < Math.min(posX + spreadCells, this.sizeX - 1); x++)
        {
            for (let y = Math.max(0, posY - spreadCells); y < Math.min(posY + spreadCells, this.sizeY - 1); y++)
            {
                let val = this.getCellValue(x, y);
                valuesCount++;
                valuesSum += val;
            }
        }
        return { sum: valuesSum, count: valuesCount };
    }
    getGridScore()
    {
        return this.getGridSum();


        let score = 0;
        for (let x = 0; x < this.sizeX; x++)
        {
            for (let y = 0; y < this.sizeY; y++)
            {
                let cellRes = this.getCellNeighbours(x, y, 1);
                let sum = cellRes.sum;
                let count = cellRes.count;
                let cellVal = this.getCellValue(x, y);

                score += cellVal //* (1 - sum / count)
            }
        }

        return score;
    }
    clearGrid()
    {
        let grid = this.grid;
        for (let i = 0, leni = this.sizeX * this.sizeY; i < leni; i++)
        {
            grid[i] = 0;
        }
        this.foundGridInd = 0;
    }
}