let worldPaused = false;

let c, ctx;
let neuralNetCanvas, NeuralNetCtx;

let world;

let neuronsCanvasHeight, neuronsCanvasWidth;

let options = {
    stepPerFrame: 1, 
    populationCount: 100,
    repopulationRate: 0.85,
    mutationRate: 0.1,
    renderSensors: true, 
    renderBestNet: true,
    renderBestNetGrid: false,
    activationFunction: 1,
    worldLifeSpan: 3200,
    mapPreset: 0,
    maxSensorDepth: 800,
    sensorsCoverage: 3,
    hiddenLayerNeurons: 8, 
    hiddenLayers: 3,
    hiddenLayerNeuronsShrink: true,
    resetKnowledge: () =>
    {
        world.resetPopulationKnowledge();
    },
    calculateUntilNextGen: () =>
    {
        let worldDone;
        do
        {
            worldDone = performWorldStep();
        }
        while(!worldDone);
        
        world.nextGeneration();
    },
    pauseResumeWorld: () =>
    {
        worldPaused = !worldPaused;
    },
};

let worldOptions = {
    targetPoint: { x: -10 , y: -10 },
    onGenerationChange: (generation) =>
    {
        $("#generation-number").html(generation);
    }
};

let curiosityGridBlockSize = 100;

let lastRender = Date.now();
let targetFps = 60;
let targetInterval = 1000 / targetFps;
function calculateAndRender()
{
    let stepPerFrame = options.stepPerFrame;
    let now = Date.now();
    let delta = now - lastRender;

    requestAnimationFrame(calculateAndRender);

    if(delta >= targetInterval && !worldPaused)
    {
        lastRender = Date.now() - (delta % targetInterval);
        

        for (let i = 0; i < stepPerFrame; i++)
        {
            let worldDone = performWorldStep() || performWorldStep();

            if (worldDone)
                world.nextGeneration();
        }

        drawPopulation(ctx, world);

        if(options.renderBestNet)
            drawTargetNeuralNet(NeuralNetCtx, world);
        else
            NeuralNetCtx.clearRect(0, 0, neuronsCanvasWidth, neuronsCanvasHeight);

        ctx.drawImage(neuralNetCanvas, 0, world.height - neuronsCanvasHeight);
    }
    
}

function updateNeuralNetArchitecture()
{
    world.setGANN(options.sensorsCoverage, options.hiddenLayers, options.hiddenLayerNeurons, options.hiddenLayerNeuronsShrink);
}


function drawTargetNeuralNet(ctx, world)
{
    let neuralNetLayers = world.neuralNetLayers;

    if (!(world.followingIndividualProps && world.followingIndividualProps.individual))
        return;

    let alives = world.individuals.map((x)=>{return x.dead ? 0 : 1}).reduce((a, b)=>{return a + b});

    if(world.followingIndividualProps.individual.dead && alives > 0)
    {
        // Change following individual to the one that is performing the best
        // So far
        let bestScore = -Infinity, bestInd = null;
        let individuals = world.individuals;
        for(let i = 0, leni = individuals.length; i < leni; i++)
        {
            let individual = individuals[i];
            if(!individual.dead && individual.score > bestScore)
            {
                bestScore = individual.score;
                bestInd = i;
            }
        }
        world.followingIndividualProps.ind = bestInd;
        world.followingIndividualProps.individual = world.individuals[bestInd];
    }

    let individual = world.followingIndividualProps.individual;

    let weights = world.GANN.population.chromosomes[world.followingIndividualProps.ind].genes;

    let neuronXSpace = 60;
    
    let neuronRadius = 10;
    let neuronYSpace = (neuronsCanvasHeight - neuronRadius * Math.max.apply(null, neuralNetLayers)) / (Math.max.apply(null, neuralNetLayers) + 1);

    ctx.clearRect(0, 0, neuronsCanvasWidth, neuronsCanvasHeight);

    let currentLayer;

    let lastWeightInd = 0;

    let maxLayerNeuronCount = Math.max.apply(this, neuralNetLayers);

    for (let i = 0, leni = neuralNetLayers.length; i < leni; i++)
    {
        let layerCount = neuralNetLayers[i];
        let layerNeuronMarginCount = (maxLayerNeuronCount - layerCount) / 2;
        if (i == 0)
        {
            currentLayer = individual.lastInput;

            //console.log(currentLayer)

            for (let j = 0, lenj = neuralNetLayers[i]; j < lenj; j++)
            {
                let neuron1X = (i + 1) * (neuronXSpace + neuronRadius);
                let neuron1Y = (j + 1 + layerNeuronMarginCount) * (neuronYSpace + neuronRadius);

                let neuronVal = currentLayer[j];

                let r = neuronVal > 0 ? 0 : 255;
                let g = neuronVal > 0 ? 255 : 0;
                let b = neuronVal > 0 ? 0 : 0;

                ctx.beginPath();
                ctx.arc(neuron1X, neuron1Y, neuronRadius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + Math.abs(neuronVal) + ")";
                ctx.fill();
                ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
                ctx.stroke();
            }
        }
        else
        {
            let weightEndInd = lastWeightInd + neuralNetLayers[i] * neuralNetLayers[i - 1];

            let targetWeights = weights.slice(lastWeightInd, weightEndInd);

            let newLayer = [];
            for (let j = 0, lenj = neuralNetLayers[i]; j < lenj; j++)
            {
                let neuron1X = (i + 1) * (neuronXSpace + neuronRadius);
                let neuron1Y = (j + 1 + layerNeuronMarginCount) * (neuronYSpace + neuronRadius);

                let prevLayerNeuronMarginCount = (maxLayerNeuronCount - neuralNetLayers[i - 1]) / 2;

                let neuronVal = 0;
                for (let k = 0, lenk = neuralNetLayers[i - 1]; k < lenk; k++)
                {
                    let neuron2X = (i) * (neuronXSpace + neuronRadius);
                    let neuron2Y = (k + 1 + prevLayerNeuronMarginCount) * (neuronYSpace + neuronRadius);

                    let weightVal = targetWeights[neuralNetLayers[i - 1] * j + k] * currentLayer[k];
                    neuronVal += weightVal;

                    let weight = targetWeights[neuralNetLayers[i - 1] * j + k];

                    let r = weight > 0 ? 0 : 255;
                    let g = weight < 0 ? 0 : 255;
                    let b = 0;

                    ctx.beginPath();
                    ctx.moveTo(neuron1X, neuron1Y);
                    ctx.lineTo(neuron2X, neuron2Y);
                    ctx.closePath();

                    let minWeightTransparency = 0.3;

                    ctx.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + Math.abs(parseFloat(weight * Math.min(1, Math.abs(weightVal) * (1 - minWeightTransparency) + minWeightTransparency))) + ")";
                    ctx.stroke();
                }

                if (i < neuralNetLayers.length - 1) // not last layer
                    neuronVal = NNActivation(neuronVal);

                newLayer.push(neuronVal);

                ctx.beginPath();
                ctx.arc(neuron1X, neuron1Y, neuronRadius, 0, Math.PI * 2);
                ctx.closePath();

                let r = neuronVal > 0 ? 0 : 255;
                let g = neuronVal > 0 ? 255 : 0;
                let b = neuronVal > 0 ? 0 : 0;

                ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + Math.abs(neuronVal) + ")";
                ctx.fill();
                ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
                ctx.stroke();
            }

            lastWeightInd = weightEndInd;

            currentLayer = newLayer;
        }
    }

    let acceleration = currentLayer[0];
    
    acceleration = Math.max(-1, Math.min(acceleration, 1));

    let maxTurnSpeed = 0.1;

    let rightTurnPref = currentLayer[1];
    let leftTurnPref = currentLayer[2];

    this.turn = world.followingIndividualProps.individual.decisionHistory.reduce((a, b)=>{return a + b; }) / world.followingIndividualProps.individual.decisionHistory.length;

    let pointCenterX = (neuralNetLayers.length + 1) * (neuronXSpace + neuronRadius);
    let dirCenterY = neuronsCanvasHeight / 2;

    ctx.strokeStyle = "black";

    let dirX = Math.cos(turn * (Math.PI * 2)) * acceleration / 10;
    let dirY = Math.sin(turn * (Math.PI * 2)) * acceleration / 10;

    ctx.beginPath();
    ctx.arc(pointCenterX, dirCenterY, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.moveTo(pointCenterX, dirCenterY);
    ctx.lineTo(pointCenterX + 500 * dirX, dirCenterY + 500 * dirY);
    ctx.closePath();
    ctx.stroke();
}

function drawPopulation(ctx, world)
{
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.clearRect(0, 0, world.width, world.height);


    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";

    let bestIndividual = world.followingIndividualProps.individual;

    if(options.renderBestNetGrid)
    {
        let gridSize = bestIndividual.cGrid.gridSize;
        for(let x = 0; x < bestIndividual.cGrid.sizeX; x++)
            for(let y = 0; y < bestIndividual.cGrid.sizeY; y++)
                if(bestIndividual.cGrid.getCellValue(x, y) > 0)
                {
                    let cellPosX = x * gridSize;
                    let cellPosY = y * gridSize;
                    ctx.fillRect(cellPosX, cellPosY, gridSize, gridSize);
                }
    }

    ctx.fillStyle = "black";
    world.collisions.forEach(function (collision)
    {
        if (collision.visible)
        {
            let { x1, y1, x2, y2 } = collision;

            ctx.beginPath();
            ctx.moveTo(x1 + 0.5, y1 - 0.5);
            ctx.lineTo(x2 + 0.5, y2 - 0.5);
            ctx.stroke();
            ctx.closePath();
        }
    });

    world.individuals.forEach((individual, ind) =>
    {

        ctx.save();
        ctx.beginPath();
        if (options.renderBestNet && individual === bestIndividual)
            ctx.fillStyle = "red";
        else
            ctx.fillStyle = "rgba(0, 0, 0, " + (individual.dead ? 0.3 : 1) + ")";

        ctx.translate(individual.x, individual.y);
        ctx.rotate(individual.angle);
        ctx.rect(-individual.width / 2, -individual.height / 2, individual.width, individual.height);

        ctx.closePath();
        
        ctx.fill();
        ctx.restore();

        if(options.renderSensors && !individual.dead)
            individual.sensorsResults.forEach(function (sensorRes)
            {
                ctx.beginPath();
                let sensorColor = "rgba(0, 0, 255, " + (Math.pow(sensorRes.distance, 3) / 2) + ")";
                ctx.strokeStyle = sensorColor;
                ctx.fillStyle = sensorColor;
                ctx.moveTo(individual.x, individual.y);
                ctx.lineTo(sensorRes.x, sensorRes.y);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.arc(sensorRes.x, sensorRes.y, 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "black";
            });
    });

    ctx.strokeStyle = "black";

    let [targetX, targetY] = [world.options.targetPoint.x, world.options.targetPoint.y];

    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(targetX, targetY, 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "black";
}

function getCollisionPoints(world)
{
    let res = [];

    let lineW = 100;

    function shouldShow(x, y)
    {
        return Math.sqrt(Math.pow(x - world.spawnPoint.x, 2) + Math.pow(y - world.spawnPoint.y, 2)) > lineW * 1;
    }


    for (let y = lineW; y < world.height - lineW; y += lineW)
    {

        for (let x = 150; x < world.width - lineW; x += lineW * 2)
        {
            if (Math.random() > 0.8 && shouldShow(x, y))
                res.push({ x1: x, y1: y, x2: x + lineW, y2: y + lineW });
        }
    }

    for (let y = lineW; y < world.height - lineW; y += lineW)
    {

        for (let x = 150; x < world.width - lineW; x += lineW * 2)
        {
            if (Math.random() > 0.8 && shouldShow(x, y))
                res.push({ x1: x, y1: y, x2: x - lineW, y2: y + lineW });
        }
    }


    for (let y = lineW; y < world.height - lineW; y += lineW)
    {

        for (let x = 50; x < world.width - lineW; x += lineW * 2)
        {
            if (Math.random() > 0.8 && shouldShow(x, y))
                res.push({ x1: x, y1: y, x2: x, y2: y + lineW });
        }
    }

    for (let y = lineW; y < world.height - lineW; y += lineW)
    {

        for (let x = 150; x < world.width - lineW; x += lineW * 2)
        {
            if (Math.random() > 0.8 && shouldShow(x, y))
                res.push({ x1: x, y1: y, x2: x + lineW, y2: y });
        }
    }

    return res;
}

window.requestAnimationFrame = function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(f) {
			window.setTimeout(f,1e3/60);
		}
}();

let GENES_COUNT, POSSIBLE_VALUES;

function initializeDatGui()
{
    let gui = new dat.GUI();

    let GAFolder = gui.addFolder('Genetic Algorithm');
    let ANNFolder = gui.addFolder('Artifial Neural Network');
    let renderingFolder = gui.addFolder('World & Rendering');

    
    GAFolder.add(options, "populationCount").min(10).step(10).name("Next generation population size");
    GAFolder.add(options, "repopulationRate").min(0).max(0.9).name("Repopulation rate");
    GAFolder.add(options, "resetKnowledge").name("Reset population's knowledge");
    
    ANNFolder.add(options, "mutationRate").min(0).max(1.0).name("Synaptic weights mutation rate");
    ANNFolder.add(options, "activationFunction", {"ReLU": 0, "Tanh": 1, "Sigmoid": 2}).name("Activation function").onChange(function(value) {
        options.activationFunction = parseInt(value);
    });
    ANNFolder.add(options, "sensorsCoverage").name("Sensors coverage").min(0).step(1).max(7).onChange(updateNeuralNetArchitecture);
    ANNFolder.add(options, "maxSensorDepth").name("Max sensors' depth").min(10);
    ANNFolder.add(options, "hiddenLayers").name("Hidden layers").min(0).step(1).max(10).onChange(updateNeuralNetArchitecture);
    ANNFolder.add(options, "hiddenLayerNeurons").name("Hidden layer neurons").min(1).step(1).max(20).onChange(updateNeuralNetArchitecture);
    ANNFolder.add(options, "hiddenLayerNeuronsShrink").name("Shrink hidden layers").onChange(updateNeuralNetArchitecture);

    renderingFolder.add(options, "stepPerFrame").min(1).step(1).name("World steps per frame");
    renderingFolder.add(options, "worldLifeSpan").name("World max lifespan").min(100).step(50);
    renderingFolder.add(options, "renderSensors").name("Render sensors");
    renderingFolder.add(options, "renderBestNet").name("Render best neural net");
    renderingFolder.add(options, "renderBestNetGrid").name("Render grids");
    renderingFolder.add(options, "mapPreset", {
        "Auto Generate": 0, 
        "User Custom": 1
    }).name("Map preset").listen().onChange((function(value)
    {
        if(value == 0)
        {
            world.autoSetMapCollisions();
            world.resetWorld();
        }
        else if(value == 1)
            setWorldMap(designerWorld);
    }));
    renderingFolder.add(options, "pauseResumeWorld").name("Pause/Resume world");
    renderingFolder.add(options, "calculateUntilNextGen").name("Calculate world until next generation");
    
    GAFolder.open();
    ANNFolder.open();
    renderingFolder.open();
}

window.addEventListener("load", function ()
{
    initializeDatGui();

    c = document.getElementById("c");
    c.width = innerWidth;
    c.height = innerHeight;
    ctx = c.getContext("2d");

    neuralNetCanvas = document.createElement("canvas");
    neuralNetCanvas.width = innerWidth;
    neuralNetCanvas.height = 300;
    NeuralNetCtx = neuralNetCanvas.getContext("2d");

    world = new World(c.width, c.height, worldOptions);

    world.setGANN(options.sensorsCoverage, options.hiddenLayers, options.hiddenLayerNeurons, options.hiddenLayerNeuronsShrink);

    neuronsCanvasWidth = neuralNetCanvas.width;
    neuronsCanvasHeight = neuralNetCanvas.height;

    world.GANN.population.chromosomes = JSON.parse(JSON.stringify(savedWorld.chromosomes));
    Materialize.toast('Loaded the pretrained neural network weights (genes)', 10000);
    world.generation = 64; // We loaded pretrained networks, generation # was 65 when I was done
    world.onGenerationChange();

    let followingIndividualInd = Math.floor(Math.random() * options.populationCount);
    world.followingIndividualProps = {ind: followingIndividualInd, individual: world.individuals[followingIndividualInd]};

    world.autoSetMapCollisions();

    calculateAndRender();

    //importMap();


    /*
    $(function ()
    {
        $(document).keyup(function (evt)
        {
            switch (evt.keyCode)
            {
                case 32:
                    space = false;
                    world.individuals[0].accelerating = space;
                    break;
                case 37:
                    left = false;
                    world.individuals[0].leftTurn = left;
                    break;
                case 39:
                    right = false;
                    world.individuals[0].rightTurn = right;
                    break;
            }
        }).keydown(function (evt)
        {
            switch (evt.keyCode)
            {
                case 32:
                    space = true;
                    world.individuals[0].accelerating = space;
                    break;
                case 37:
                    left = true;
                    world.individuals[0].leftTurn = left;
                    break;
                case 39:
                    right = true;
                    world.individuals[0].rightTurn = right;
                    break;
            }
        });
    });
    */
});

function setWorldMap(inputWorld)
{
    world.width = inputWorld.width;
    world.height = inputWorld.height;

    world.collisions = [];

    // Screen boundries
    world.addCollision(0, 0, inputWorld.width, 0, false);
    world.addCollision(0, 0, 0, inputWorld.height, false);
    world.addCollision(0, inputWorld.height, inputWorld.width, inputWorld.height, false);
    world.addCollision(inputWorld.width, 0, inputWorld.width, inputWorld.height, false);

    let collisions = inputWorld.lines;
    collisions.forEach((collision) =>
    {
        world.addCollision(collision.from.x, collision.from.y, collision.to.x, collision.to.y);
    });

    world.spawnPoint = inputWorld.spawnPoint;

    world.resetWorld();
}

function importMap()
{
    var fileInput = document.getElementById("world-input");

    fileInput.addEventListener('change', function ()
    {
        var file = fileInput.files[0];

        var reader = new FileReader();

        reader.onload = function ()
        {
            let jsonData = JSON.parse(reader.result);
            setWorldMap(jsonData);
        };

        reader.readAsText(file);
    });
}