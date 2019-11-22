let mousePos = { x: 0, y: 0 };

let designerWorld = { width: innerWidth, height: innerHeight, scale: 1, viewLeft: 0, viewTop: 0, lines: [], spawnPoint: {}};

let lineRemovalDistance = 20; // Pixels

let selectedTool = "add-line";

let mapCanvas, mapCtx;
window.addEventListener("load", function ()
{
    mapCanvas = document.getElementById("map");
    mapCtx = mapCanvas.getContext("2d");
    setCanvasSize();

    designerWorld.spawnPoint = {x: designerWorld.width / 2, y: designerWorld.height / 2};

    let selectableTools = $("#remove-line, #add-line, #change-spawn");
    selectableTools.click(function ()
    {
        selectedTool = $(this).attr("id");
        selectableTools.removeClass("selected");
        $(this).addClass("selected");
    });

    $("#change-world-size").click(function ()
    {
        let worldWidth = prompt("Please enter world width");
        let worldHeight = prompt("Please enter world height");

        designerWorld.height = parseInt(worldHeight);
        designerWorld.width = parseInt(worldWidth);
    });

    $("#export-world").click(function ()
    {
        download(JSON.stringify(designerWorld), 'world.gannmap', 'text/plain');
    });

    $("#import-world").click(function ()
    {
        fileInput.click();
    });

    $("#reset-world").click(function ()
    {
        resetWorld();
    });

    $(mapCanvas).mousemove(canvasMouseMove); 

    $(mapCanvas).mousedown(canvasMouseDown);
    $(mapCanvas).mouseup(canvasMouseUp);

    $(mapCanvas).on('touchmove',canvasMouseMove);

    $(mapCanvas).on('touchstart',canvasMouseDown);
    $(mapCanvas).on('touchend',canvasMouseUp);

    var inputElement = document.createElement('div');
    inputElement.innerHTML = '<input type="file">';
    var fileInput = inputElement.firstChild;
    fileInput.addEventListener('change', function ()
    {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function ()
        {
            let jsonData = JSON.parse(reader.result);
            designerWorld = jsonData;
            updateMapStatusMode(true);
        };
        reader.readAsText(file);
    });

    render();
});

window.addEventListener("resize", setCanvasSize);

let drawingLine = null;

let mouseDown = false;

let mouseDragging = false;

let mouseDownPos = null;

let initialViewLeft = 0, initialViewTop = 0;

function canvasMouseDown(e)
{
    mouseDown = true;
    mouseDownPos = { x: e.pageX, y: e.pageY };

    initialViewLeft = designerWorld.viewLeft;
    initialViewTop = designerWorld.viewTop;
}

function canvasMouseUp(e)
{
    mouseDown = false;

    if (!mouseDragging)
    {
        canvasClick(e);
    }

    mouseDragging = false;
}

function canvasMouseMove(e)
{
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;

    if (mouseDown && Math.max(Math.abs(mouseDownPos.x - mousePos.x), Math.abs(mouseDownPos.y - mousePos.y)) > 2)
        mouseDragging = true;

    if (mouseDragging)
    {
        designerWorld.viewLeft = initialViewLeft + (mouseDownPos.x - mousePos.x);
        designerWorld.viewTop = initialViewTop + (mouseDownPos.y - mousePos.y);
    }
}

function canvasClick(e)
{
    let clickPoint = { x: e.pageX, y: e.pageY };
    
    if (selectedTool == "add-line")
    {
        if (drawingLine && drawingLine.from)
        {
            updateMapStatusMode(true);

            let lines = designerWorld.lines;

            lines.push({ from: { x: drawingLine.from.x, y: drawingLine.from.y }, to: { x: mousePos.x + designerWorld.viewLeft, y: mousePos.y + designerWorld.viewTop } })

            drawingLine = null;
        }
        else
        {
            drawingLine = { from: { x: e.pageX + designerWorld.viewLeft, y: e.pageY + designerWorld.viewTop } };
        }
    }
    else if (selectedTool == "remove-line")
    {
        let lines = designerWorld.lines;
        for (let i = 0; i < lines.length; i++)
        {
            let line = lines[i];

            let mouseToLineDist = pDistance(clickPoint.x + designerWorld.viewLeft, clickPoint.y + designerWorld.viewTop, line.from.x, line.from.y, line.to.x, line.to.y);

            if (mouseToLineDist < lineRemovalDistance)
            {
                lines.splice(i, 1);
                break;
            }
        }
    }
    else if (selectedTool == "change-spawn")
    {
        let newSpawnX = clickPoint.x + designerWorld.viewLeft, 
        newSpawnY = clickPoint.y + designerWorld.viewTop;
        if(newSpawnX <= 0 || newSpawnX >= designerWorld.width || newSpawnY <= 0 || newSpawnY >= designerWorld.height)
            alert("Spawn point should be set inside the world");
        else
        designerWorld.spawnPoint = {
            x: newSpawnX, 
            y: newSpawnY
        };
    }
}

function updateMapStatusMode(isCustom)
{
    /*
    "Auto Generate": 0, 
    "User Custom": 1
    */
    options.mapPreset = isCustom ? 1 : 0;
}

function resetWorld()
{
    updateMapStatusMode(false);
    designerWorld.lines = [];
    designerWorld.spawnPoint = {x: designerWorld.width / 2, y: designerWorld.height / 2};
}

function setCanvasSize()
{
    mapCanvas.height = innerHeight;
    mapCanvas.width = innerWidth;
}

function render()
{
    requestAnimationFrame(render);

    if(viewMode != "design")
        return;
    
    mapCtx.clearRect(0, 0, innerWidth, innerHeight);

    let lines = designerWorld.lines;

    lines.forEach(function (line)
    {
        let lineFrom = line.from;
        let lineTo = line.to;

        mapCtx.beginPath();
        mapCtx.moveTo(lineFrom.x - designerWorld.viewLeft, lineFrom.y - designerWorld.viewTop);
        mapCtx.lineTo(lineTo.x - designerWorld.viewLeft, lineTo.y - designerWorld.viewTop);
        mapCtx.closePath();
        mapCtx.stroke();
    });

    if (selectedTool == "remove-line")
    {
        lines.forEach(function (line)
        {
            let lineFrom = line.from;
            let lineTo = line.to;

            mapCtx.beginPath();
            mapCtx.moveTo(lineFrom.x - designerWorld.viewLeft, lineFrom.y - designerWorld.viewTop);
            mapCtx.lineTo(lineTo.x - designerWorld.viewLeft, lineTo.y - designerWorld.viewTop);
            mapCtx.closePath();
            mapCtx.lineWidth = lineRemovalDistance;
            mapCtx.strokeStyle = "rgba(0, 0, 50, 0.6)";
            mapCtx.stroke();
        });

        // Reset ctx props
        mapCtx.lineWidth = 1;
        mapCtx.strokeStyle = "black";
    }
    

    let spawnX = designerWorld.spawnPoint.x, spawnY = designerWorld.spawnPoint.y;

    mapCtx.beginPath();
    mapCtx.arc(spawnX - designerWorld.viewLeft, spawnY - designerWorld.viewTop, 20, 0, Math.PI * 2);
    mapCtx.closePath();
    mapCtx.fillStyle = "rgba(100, 100, 255, 0.6)";
    mapCtx.fill();

    mapCtx.beginPath();
    mapCtx.arc(spawnX - designerWorld.viewLeft, spawnY - designerWorld.viewTop, 10, 0, Math.PI * 2);
    mapCtx.closePath();
    mapCtx.fillStyle = "rgba(100, 100, 255, 1)";
    mapCtx.fill();

    if (drawingLine)
    {
        mapCtx.beginPath();
        mapCtx.moveTo(drawingLine.from.x - designerWorld.viewLeft, drawingLine.from.y - designerWorld.viewTop);
        mapCtx.lineTo(mousePos.x, mousePos.y);
        mapCtx.closePath();
        mapCtx.stroke();
    }

    // Draw world boundries

    mapCtx.beginPath();
    mapCtx.rect(-designerWorld.viewLeft, -designerWorld.viewTop, designerWorld.width, designerWorld.height);
    mapCtx.closePath();

    mapCtx.stroke();
}

// https://stackoverflow.com/a/6853926
function pDistance(x, y, x1, y1, x2, y2)
{

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;

    var xx, yy;

    if (param < 0)
    {
        xx = x1;
        yy = y1;
    }
    else if (param > 1)
    {
        xx = x2;
        yy = y2;
    }
    else
    {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

// https://stackoverflow.com/a/34156339
function download(content, fileName, contentType)
{
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}