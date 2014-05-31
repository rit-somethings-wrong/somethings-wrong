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
    playerImg: "assets/testchar.png",
    // general scenes.
    inventoryImg: "assets/screens/Inventory.GIF",
    pausedMenuImg: "assets/screens/Paused.GIF",
    itemIconGenericImg: "assets/screens/Item_icon.GIF",
    buttonImg: "assets/screens/Button.GIF",
    // scene backgrounds.
    busStationBackImg: "assets/scenebg/bus-station.png",
    jennysHouseOutsideBackImg: "assets/scenebg/jennys-house-outside.png",
    toolshedBackImg: "assets/scenebg/toolshed.png"
};


// load everything
declare var Modernizr: any;
Modernizr.load(
    {
        load:
        [
            // core code files
            'createjs.js',
            'SoundLoader.js',
            'interfaces.js',
            'collision.js',
            'ItemList.js',
            'utilities.js',
            'entity_tasks.js',
            'entity.js',
            'inventory.js',
            'player.js',
            'interaction.js',
            'chat.js',
            'level.js',
            'levelscene.js',

            // level definitions - must be loaded after the core code files
            './levels/airport/airport.js',

            // game start - must be loaded last
            'engine.js',
            
            IMAGES.playerImg,
            // general scenes.
            IMAGES.inventoryImg,
            IMAGES.pausedMenuImg,
            IMAGES.itemIconGenericImg,
            IMAGES.buttonImg,
            // background level scenes.
            IMAGES.busStationBackImg,
            IMAGES.jennysHouseOutsideBackImg,
            IMAGES.toolshedBackImg
            // also load other class files here
        ],
            
            // on complete
        complete: function()
        {
            console.log("Loading complete with Modernizr.");
            var engine = new GameEngine();
            engine.startNewGame("You");
            
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

            window.onload = function () {
                //debugger;
                console.log("event fired");
            }

            //------- event listeners
            
            window.addEventListener("keydown",function(e){
                //console.log("keydown=" + e.keyCode);
                //game.keydown[e.keyCode] = true;
            });
                
            window.addEventListener("keyup",function(e){
                //console.log("keyup=" + e.keyCode);
                //game.keydown[e.keyCode] = false;
            });
            
            
            // init game
            //game.keydown = []; // clear key demon
            //game.init(); // init game
            
        },
        
        
    
    }
);