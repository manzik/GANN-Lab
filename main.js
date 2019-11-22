let viewMode = "process";

function trySwitchProcessMode()
{
    if(viewMode == "design")
    {
        $("#process-mode-button").addClass("enabled");
        $("#design-mode-button").removeClass("enabled");
        viewMode = "process";
        openProcessMode();
    }
}

function trySwitchDesignMode()
{
    if(viewMode == "process")
    {
        $("#design-mode-button").addClass("enabled");
        $("#process-mode-button").removeClass("enabled");
        viewMode = "design";
        openDesignMode();
    }
}

function openDesignMode()
{
    worldPaused = true;
    $("div.dg.ac").css("display", "none");
    $("canvas#c").css("display", "none");
    $("canvas#map").css("display", "block");
    $("div#tools").css("display", "block");
}

function openProcessMode()
{
    worldPaused = false;
    $("div.dg.ac").css("display", "initial");
    $("canvas#c").css("display", "initial");
    $("canvas#map").css("display", "none");
    $("div#tools").css("display", "none");

    if(options.mapPreset == 1)
    {
        setWorldMap(designerWorld);
        world.resetWorld();
    }
}