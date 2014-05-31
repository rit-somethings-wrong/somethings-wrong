"use strict";
// CONSTANTS
var KEYBOARD = {
    "KEY_LEFT": 37,
    "KEY_UP": 38,
    "KEY_RIGHT": 39,
    "KEY_DOWN": 40,
    "KEY_SPACE": 32
};

var IMAGES = {
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

Modernizr.load({
    load: [
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
        'gui_interface.js',
        './levels/airport/airport.js',
        IMAGES.inventoryImg,
        IMAGES.pausedMenuImg,
        IMAGES.itemIconGenericImg,
        IMAGES.buttonImg,
        IMAGES.busStationBackImg,
        IMAGES.jennysHouseOutsideBackImg,
        IMAGES.toolshedBackImg,
        'engine.js'
    ],
    // on complete
    complete: function () {
        console.log("Loading complete with Modernizr.");

        // Fix width/height problems (hopefully)
        /*document.querySelector('canvas').getContext("2d").imageSmoothingEnabled = false;
        document.querySelector('canvas').width = document.querySelector('canvas').style.width;
        document.querySelector('canvas').height = document.querySelector('canvas').style.height;
        */
        var engine = new GameEngine();
        engine.startNewGame("You");

        // and other stuff you might need upon everything having been loaded
        window.onblur = function () {
            //game.paused = true;
            //game.keydown = []; // clear key daemon
            //game.update(); // show pause screen
        };

        window.onfocus = function () {
            //game.paused = false;
            //game.update(); // resume game play
        };

        window.onload = function () {
            //debugger;
            console.log("event fired");
        };

        //------- event listeners
        window.addEventListener("keydown", function (e) {
            //console.log("keydown=" + e.keyCode);
            //game.keydown[e.keyCode] = true;
        });

        window.addEventListener("keyup", function (e) {
            //console.log("keyup=" + e.keyCode);
            //game.keydown[e.keyCode] = false;
        });
        // init game
        //game.keydown = []; // clear key demon
        //game.init(); // init game
    }
});
//# sourceMappingURL=Loader.js.map
