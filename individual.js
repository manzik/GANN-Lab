class Individual
{
    constructor(world, sensors, populationIndex, options)
    {
        this.width = 20;
        this.height = 10;

        this.sensors = sensors;

        this.world = world;

        this.populationIndex = populationIndex;

        this.neuralNetLayers = options.neuralNetLayers;

        this.cGrid = new CuriosityGrid(options.curiosityGridBlockSize, world);

        this.maxVelocity = 4;

        this.score = 0;

        this.setProperties();

        this.decisionTrackCount = 5;
        this.decisionHistory = [];
    }
    setProperties()
    {
        this.cGrid.clearGrid();

        this.passedSteps = 0;

        if(options.mapPreset == 0) // mapPreset: Auto generate
        {
            // Center
            this.x = world.width / 2;
            this.y = world.height / 2;
        }
        else if(options.mapPreset == 1) // mapPreset: User custom
        {
            this.x = world.spawnPoint.x;
            this.y = world.spawnPoint.y;
        }
        

        this.a = 0.1;
        this.angleV = 0.1;

        // <agent controlled>
        this.v = 0;
        this.angle = Math.random() * (Math.PI * 2);

        this.acceleration = 0;
        this.turn = 0;
        // </agent controlled>

        this.vx = 0;
        this.vy = 0;

        this.ax = 0;
        this.ay = 0;

        this.beenInThisBlock = false;

        this.dead = false;

        this.score = 0;
    }
    calculateScore()
    {
        //let score = getDistance(this.x, this.y, this.world.spawnPoint.x, this.world.spawnPoint.y);

        let score = this.cGrid.getGridScore();

        this.score = score;

        this.world.GANN.population.chromosomes[this.populationIndex].score = score;

        return score;
    }
    getBoundryCollisionPoint(sensorX, sensorY, angle)
    {
        let rangeNormalizedAngle = angle < 0 ? (Math.PI * 2) - Math.abs(angle) % (Math.PI * 2) : Math.abs(angle) % (Math.PI * 2);
        let lineSlope = Math.tan(angle);
        let b = sensorY - sensorX * lineSlope;

        let topBoundryPointingPoint = { x: (-b) / lineSlope, y: 0 };
        let isInTopBoundry = topBoundryPointingPoint.x >= 0 && topBoundryPointingPoint.x <= world.width;
        isInTopBoundry &= rangeNormalizedAngle > Math.PI;
        if (isInTopBoundry)
            return topBoundryPointingPoint;

        let rightBoundryPointingPoint = { x: world.width, y: lineSlope * world.width + b };
        let isInRightBoundry = rightBoundryPointingPoint.y >= 0 && rightBoundryPointingPoint.y <= world.height;
        isInRightBoundry &= rangeNormalizedAngle < Math.PI / 2 || rangeNormalizedAngle > Math.PI * 2 - Math.PI / 2;
        if (isInRightBoundry)
            return rightBoundryPointingPoint;

        let leftBoundryPointingPoint = { x: 0, y: b };
        let isInLeftBoundry = leftBoundryPointingPoint.y >= 0 && leftBoundryPointingPoint.y <= world.height;
        isInLeftBoundry &= rangeNormalizedAngle > Math.PI / 2 && rangeNormalizedAngle < Math.PI * 2 - Math.PI / 2;
        if (isInLeftBoundry)
            return leftBoundryPointingPoint;

        let bottomBoundryPointingPoint = { x: (world.height - b) / lineSlope, y: world.height };
        let isInBottomBoundry = bottomBoundryPointingPoint.y >= 0 && bottomBoundryPointingPoint.y <= world.height;
        if (isInBottomBoundry)
            return bottomBoundryPointingPoint;

        // This shouldn't happen
        console.error("No end found for sensor!!!!!!!");

        return { x: undefined, y: undefined };
    }
    calculateSensors()
    {
        let maxSensorDepth = options.maxSensorDepth;

        let world = this.world;
        let individual = this;
        let sensorDistances = [];
        let sensors = this.sensors;


        sensors.forEach(function (sensor)
        {
            if(Math.abs(individual.angle) > Math.PI * 2)
                individual.angle = individual.angle % Math.PI * 2;
            else if (Math.abs(individual.angle) < 0)
                individual.angle = Math.PI * 2 - individual.angle;

            let angle = individual.angle + sensor.angle;

            

            let sensorX = individual.x + individual.width * sensor.x * Math.cos(angle);
            let sensorY = individual.y + individual.height * sensor.y * Math.sin(angle);
            let startPoint = { x: sensorX, y: sensorY };
            let endPoint = individual.getBoundryCollisionPoint(startPoint.x, startPoint.y, angle);

            var minDistance = null, minDistanceP;

            world.collisions.forEach(function (collision, i)
            {
                let intersectPoint = line_intersect(collision.x1, collision.y1, collision.x2, collision.y2, startPoint.x, startPoint.y, endPoint.x, endPoint.y);

                if(!intersectPoint)
                    return;

                var hasCollision = intersectPoint.seg1 && intersectPoint.seg2;
                if (hasCollision)
                {


                    let distance = getDistance(intersectPoint.x, intersectPoint.y, sensorX, sensorY);

                    if (distance < minDistance || minDistance === null)
                    {
                        minDistance = distance;
                        minDistanceP = { x: intersectPoint.x, y: intersectPoint.y };
                    }
                }
            });

            let formattedDist = minDistance;

            formattedDist = 1 - Math.min(formattedDist / maxSensorDepth, 1);

            if(minDistanceP === undefined)
            {
                //debugger;
                Materialize.toast('Unexpected error occurred, please report to the developer @manzik. Resetting the world.', 10000);
                world.resetWorld();
            }

            sensorDistances.push({ x: minDistanceP.x, y: minDistanceP.y, distance: formattedDist });
        });



        return sensorDistances;
    }
    makeNeuralNetworkDecisions()
    {
        let GANN = this.world.GANN;
        let population = GANN.population;
        let chromosome = population.chromosomes[this.populationIndex];

        let neuralNetLayers = this.neuralNetLayers;

        let sensorsResults = this.sensorsResults.map((sensorsResult) => { return sensorsResult.distance; });

        
        sensorsResults.push(this.v / this.maxVelocity);
        /*
        sensorsResults.push(this.y / this.world.height);

        sensorsResults.push(this.x / this.world.width);
        
        sensorsResults.push(this.angle / (Math.PI * 2));
        */

        sensorsResults.push(this.beenInThisBlock ? 0 : 1);

        this.lastInput = sensorsResults;

        let neuralNetOutput = calculateNeuralNet(sensorsResults, chromosome.genes, neuralNetLayers);

        this.acceleration = Math.max(-1, Math.min(neuralNetOutput[0], 1));

        let maxTurnSpeed = 0.1;

        let rightTurnPref = neuralNetOutput[1];
        let leftTurnPref = neuralNetOutput[2];

        let thisTurn = Math.min(maxTurnSpeed, Math.max(-maxTurnSpeed, leftTurnPref - rightTurnPref));

        this.decisionHistory.unshift(thisTurn);

        while(this.decisionHistory.length > this.decisionTrackCount)
            this.decisionHistory.pop();
        
        this.turn = thisTurn;
    }
    stepIndividual()
    {
        let world = this.world;

        this.passedSteps += world.stepSpeed;

        if (this.passedSteps >= options.worldLifeSpan)
            return 2;

        let sensorsResults = this.calculateSensors();
        this.sensorsResults = sensorsResults;

        this.makeNeuralNetworkDecisions();

        this.v += this.acceleration;
        
        this.angle += this.turn * world.stepSpeed;

        this.v = Math.min(this.maxVelocity, Math.abs(this.v)) * Math.sign(this.v) * world.stepSpeed;

        this.vx = this.v * Math.cos(this.angle);
        this.vy = this.v * Math.sin(this.angle);

        let x1 = this.x, y1 = this.y;

        let prevBlockPos = this.cGrid.getPointBlockPos(this.x, this.y);

        this.x += this.vx;
        this.y += this.vy;

        let newBlockPos = this.cGrid.getPointBlockPos(this.x, this.y);

        let x2 = this.x, y2 = this.y;

        if(prevBlockPos.x != newBlockPos.x || prevBlockPos.y != newBlockPos.y)
        {
            if(!this.beenInThisBlock)
            {
                if(this.cGrid.getPointBlockValue(this.x, this.y) > 0)
                {
                    this.beenInThisBlock = true;
                }
            }
            else if(this.beenInThisBlock)
            {
                if(this.cGrid.getPointBlockValue(this.x, this.y) == 0)
                {
                    this.beenInThisBlock = false;
                }
            }
        }
        this.cGrid.setPointBlockValue(this.x, this.y, 1);

        let hadCollision = false;

        for (let i = 0, leni = world.collisions.length; i < leni; i++)
        {
            var collision = world.collisions[i];

            let [x3, y3, x4, y4] = [collision.x1, collision.y1, collision.x2, collision.y2];

            if (lineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4))
            {
                hadCollision = true;
                break;
            }
        }

        if (hadCollision)
            return 1;

        return 0;
    }
}

function performWorldStep()
{
    let worldDone = world.stepWorld();
    return worldDone;
}

function getDistance(x1, y1, x2, y2)
{
    return Math.sqrt((y1 - y2) ** 2 + (x1 - x2) ** 2);
}

function onBeforeNextGeneration()
{
    let population = world.GANN.population;
    while(world.individuals.length < options.populationCount)
    {

        for(let i = 0; i < 2; i++)
        {
            let newIndividual = new Individual(world, world.sensors, world.individuals.length, { neuralNetLayers: world.neuralNetLayers, curiosityGridBlockSize });
            world.addNewIndividual(newIndividual);
        }

        let newChildren = [];

        population.sortPopulationByFitnessScores();
        
        let selectedParents = population.chooseTwoSelectedParents();
        let parent1 = selectedParents[0], parent2 = selectedParents[1];
        let parentsSize = parent1.size;
        let NNChildren = getNNChildFromParents(parent1.genes, parent2.genes);
        let child1 = population.makeChromosome(NNChildren[0]);
        let child2 = population.makeChromosome(NNChildren[1]);
        
        child1.mutate(options.mutationRate);
        child2.mutate(options.mutationRate);
        newChildren.push.apply(newChildren, [child1, child2]);

        population.addNewChildren(newChildren);
    }
    while(world.individuals.length > options.populationCount)
    {
        let worstPerformingChromosomes = population.getWorstPerforming(1);
        population.removeChildren(worstPerformingChromosomes);
        world.individuals.splice(world.individuals.length - 1, 1);
    }
}