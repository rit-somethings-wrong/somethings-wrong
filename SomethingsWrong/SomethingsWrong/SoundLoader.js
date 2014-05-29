// Note - file paths are relative to index.html when they are fired from here
"use strict";


createjs.Sound.alternateExtensions = ["mp3"];

createjs.Sound.registerSound( { id: "bgm1", src:"assets/music/VintageFrames.ogg" } );
createjs.Sound.addEventListener("fileload", handleFileLoad);

//console.log("Sound loader accessed.");

// fires on load
function handleFileLoad(e)
{
	//console.log("Preloaded Sound: ", e.id, e.src);
	if(e.src == "assets/music/VintageFrames.ogg")
	{
		console.log("LOADED SHIT");
		// start the soundtrack
		createjs.Sound.play("bgm1", {loop:-1, volume:0.3});	
	}
}

