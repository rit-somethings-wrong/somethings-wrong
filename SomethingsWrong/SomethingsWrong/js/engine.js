"use strict";
var game = game || {};



//TODO the HUD can be implemented as an Interaction?  Or does the HUD button trigger the Inventory Interaction

game.engine = {
    //private static engine: GameEngine;  //TODO fix this static hack

    this.StartingLevel : "airport",
    this.CanvasId: string : "gameCanvas",
    this.DefaultPlayerImgUrl: "./TODO/playerImgUrl",
    
    this.ctx: 0,
	this.canvas : 0,

    //this.player: IPlayer;   //don't need this cuz MODULE FORMAT

    this._curLevelId: "",  //where we are
    this._nextLevelId: "", //where we're going to go on the next update

    this._curInteraction: 0,  //the interaction state to use
    this._nextInteraction: 0, //the interaction state to transition to on the next update

    //this._animationFn: () => boolean;  //function that returns false when the animation should stop, else true

    this._click : { x: number; y: number },
    this._chars : 0,

    this._loadCountId: 0,

    this._canW = 0,
    this._canH = 0,

    //-----  end properties -----//

    this.init = function()
	{
        //GameEngine.engine = this;

        var canvas = document.getElementById('gameCanvas');
        
        this.ctx = canvas.getContext('2d');
		
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false; // for firefox
        
        //listen for ui events
		
        canvas.onclick = function(){
            // Readjust mouse coordinates to canvas space.
            var canvasBounds = canvas.getBoundingClientRect();
			console.log("click input: ", this._click.x, this._click.y);
            this._click = {
                x: ( ev.clientX - canvasBounds.left ) / canvas.clientWidth * canvas.width,
                y: ( ev.clientY - canvasBounds.top ) / canvas.clientHeight * canvas.height
            };
        };
		
        window.addEventListener("keyup", function() {
            if (this._chars === null) {
                this._chars = String.fromCharCode(ev.keyCode);
            } else {
                this._chars = this._chars.concat(String.fromCharCode(ev.keyCode));
            }
            console.log("keyboard input: ", this._chars);
        });

        window.addEventListener("resize", function () { // I don't know what the fuck is going on here i need to fix it though
            this._canW = GameEngine.engine.size.width;
            this._canH = GameEngine.engine.size.height;
            console.log("resize");
        });
		
		this.startNewGame();
    },
		
    this.startNewGame(): void {
        this._curInteraction = null;
        this._nextInteraction = null;
        this._curLevelId = null;
        this._nextLevelId = GameEngine.StartingLevel;
        game.player.init();

        //pause until everything has been loaded
        this._loadCountId = setInterval(this.WaitToBegin(), 1000 / 5);
    },
	
	//Doesn't start the game loop until everything that's pending loading has been loaded
    this.WaitToBegin : function(){
        return () => {
            if (loadingCount > 0) {
                console.log("Waiting on loading count: ", loadingCount);
                return;
            }

            clearInterval(engine._loadCountId);
            this.update(); // will keep running once called ONCE
        }
    },

    // AKA the game loop
    this.update : function{
            //switch levels if needed
            var level: ILevel = this.GetLevel(this._curLevelId);
            if (this._curLevelId != this._nextLevelId) 
			{
                if (level !== null) {
                    level.Leave();
                }
                level = this.GetLevel(this._nextLevelId);
                if (level !== null) {
                    level.Enter(this.player, this);
                }
                this._curLevelId = this._nextLevelId;
                console.log("Switched to level: ", this._curLevelId);
            } 
			else 
			{
                if (level !== null) 
				{
                    level.Update();
                }
            }

            //switch interactions if needed
            if (this._curInteraction != this._nextInteraction) 
			{
                if (this._curInteraction !== null) {
                    this._curInteraction.Leave();
                }

                this._curInteraction = this._nextInteraction;
                if (this._nextInteraction !== null) {
                    this._curInteraction.Enter(this.player, this, level);
                }
                console.log("Switched to interaction: ", this._curInteraction);
            } else {
                if (this._curInteraction !== null) {
                    this._curInteraction.Update();
                }
            }

            //--- input ---//

            if (this._click !== null || this._chars !== null) {
                if (this._click !== null) {
                    console.log("game step: click input: ", this._click.x, this._click.y);
                }
                if (this._chars !== null) {
                    console.log("game step: keyboard input: ", this._chars);
                }

                //configure input layers
                var uiHandlers: IUIHandler[] = [];
                if (this._curInteraction !== null) 
				{
                    uiHandlers.push(this._curInteraction);
                    uiHandlers.push(level);
                } else 
				{
                    //TODO uiHandlers.push(inventoryBagButton);
                    uiHandlers.push(level);
                }

                //send input to all the ui handlers until one of them does something with it
                var handled: boolean = false;
                for (var i = 0; i < uiHandlers.length; ++i) 
				{
                    if (uiHandlers[i] === null) {
                        continue;
                    }

                    if (this._chars !== null) {
                        handled = handled || uiHandlers[i].Typed(this._chars);
                    }
                    if (this._click !== null) {
                        handled = uiHandlers[i].Clicked(this._click.x, this._click.y);
                    }

                    if (handled) {
                        this._click = null;
                        this._chars = null;
                        break;
                    }
                }
            }

            //--- drawing ---//

            //configure graphical levels
            var gHandlers: IDrawable[] = [];
            if (this._curInteraction !== null) {
                gHandlers.push(level);
                gHandlers.push(this._curInteraction);
            } else {
                gHandlers.push(level);
                //TODO gHandlers.push(inventoryBagButton);
            }

            //draw all the layers
            for (var i = 0; i < gHandlers.length; ++i) {
                if (gHandlers[i] === null) {
                    continue;
                }
                gHandlers[i].Draw(this.ctx);
            }

            requestAnimationFrame(this.gameStep()); // do it all again :3
        
    },

    //Creates a function which runs an animation specified by the given animation function
    this.buildAnimations : function(animationFn) 
	{
        var fn = function () {
            var requestId = requestAnimationFrame(fn);

            var done: boolean = animationFn();
            if (done) {
                cancelAnimationFrame(requestId);
            }
        }

        return fn;
    },

    //----- Engine helper functions -----//

    this.GetLevel :function(id /* string */){
        return LevelMap[id] || null;
    },

	// why we need this why
    this.GetSize : function() 
	{
        var canvas = <HTMLCanvasElement>document.getElementById(GameEngine.CanvasId);
        return {
            width: canvas.width,
            height: canvas.height
        };
    },

    //----- Called by a level or interaction to send info to the game engine -----//

    //Indicates the animation to play
    this.AddAnimation : function (id: string, fn: any)
	{
        //TODO support multiple animations
        this._animationFn = fn;
    },

    //Cancels an animation
    this.RemoveAnimation : function(id /* string */)
	{
        this._animationFn = null;
    },

    //Specifies the level to switch to on the next update
    this.NextLevel : function(id /* string*/)
	{
        this._nextLevelId = id;
    },

    //Specifies the interaction to switch to on the next update
    this.NextInteraction : function(interaction)
	{
        this._nextInteraction = interaction;
    },

    //Leaves the current interaction on the next update
    this.ClearInteraction:  function()
	{
        this._nextInteraction = null;
    }
};

