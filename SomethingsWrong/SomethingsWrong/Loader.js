"use strict";

// CONSTANTS
var KEYBOARD = {
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32
};

var IMAGES = 
{
	playerImg: "assets/testchar.png"
};


// load everything
Modernizr.load(
	{
		load: 
		[
			'http://code.createjs.com/soundjs-0.5.2.min.js',
			'SoundLoader.js',
			'utilities.js',
			'entity.js',
			'item.js',
			'inventory.js',
			'player.js',
			'interaction.js',
			'level.js',
			'levelscene.js',
			'engine.js',
			
			IMAGES.playerImg
			// also load other class files here
		],
			
			// on complete
		complete: function()
		{
			
			console.log("Loading complete with Modernizr.");
			// and other stuff you might need upon everything having been loaded
			window.onblur = function()
			{
				//game.paused = true;
				//game.keydown = []; // clear key daemon
				//game.update(); // show pause screen
			};
			
			window.onfocus = function()
			{
				//game.paused = false;
				//game.update(); // resume game play
			};
			
			//------- event listeners
			
			window.addEventListener("keydown",function(e){
				console.log("keydown=" + e.keyCode);
				//game.keydown[e.keyCode] = true;
			});
				
			window.addEventListener("keyup",function(e){
				console.log("keyup=" + e.keyCode);
				//game.keydown[e.keyCode] = false;
			});
			
			
			// init game
			//game.keydown = []; // clear key demon
			//game.init(); // init game
			
		},
		
		
	
	}
);