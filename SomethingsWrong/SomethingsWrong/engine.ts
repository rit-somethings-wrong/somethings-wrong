/// <reference path="Loader.ts" />
/// <reference path="interfaces.ts" />
/// <reference path="player.ts" />
/// <reference path="utilities.ts" />
"use strict";




//TODO the HUD can be implemented as an Interaction?  Or does the HUD button trigger the Inventory Interaction?


class GameEngine {
    private static engine: GameEngine;  //TODO fix this static hack

    private static StartingLevel = "airport";
    private static CanvasId: string = "gameCanvas";
    private static DefaultPlayerImgUrl: string = "./TODO/playerImgUrl";
    private static MaxGameSteps = 20;  //TODO remove this as the game should continue until forever until the user closes the browser tab.  Beating the game should return you to the main screen.

    private ctx: CanvasRenderingContext2D;


    private player: IPlayer;   //represents the human user's avatar

    private _curLevelId: string;  //where we are
    private _nextLevelId: string; //where we're going to go on the next update

    private _curInteraction: IInteraction;  //the interaction state to use
    private _nextInteraction: IInteraction; //the interaction state to transition to on the next update

    private _animationFn: () => boolean;  //function that returns false when the animation should stop, else true

    private _click: { x: number; y: number } = null;
    private _chars: string = null;

    private _loadCountId: number;
    //private _gameLoopId: number; // you shouldn't need to use this :)
    // private _gameSteps = 0; // or this

    private _canW = 0;
    private _canH = 0;

    //-----  -----//

    constructor() {
        GameEngine.engine = this;

        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(GameEngine.CanvasId);
		
		this.ctx = canvas.getContext('2d');
        var ctx = this.ctx;
		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false; // for firefox
		
        //listen for ui events
        canvas.onclick = (ev: MouseEvent): void => {
            // Readjust mouse coordinates to canvas space.
            var canvasBounds = canvas.getBoundingClientRect();

            this._click = {
                x: ( ev.clientX - canvasBounds.left ) / canvas.clientWidth * canvas.width,
                y: ( ev.clientY - canvasBounds.top ) / canvas.clientHeight * canvas.height
            };
            console.log("click input: ", this._click.x, this._click.y);
        }
        window.addEventListener("keyup", (ev: KeyboardEvent) => {
            if (this._chars === null) {
                this._chars = String.fromCharCode(ev.keyCode);
            } else {
                this._chars = this._chars.concat(String.fromCharCode(ev.keyCode));
            }
            console.log("keyboard input: ", this._chars);
        });



        // Set the fill style for the drawing context.
        ctx.fillStyle = '#210201';

        console.log("client-w: " + canvas.clientWidth + ", h: " + canvas.clientHeight);

        document.querySelector('canvas').addEventListener("resize", function () {
            GameEngine.engine._canW = GameEngine.engine.size.width;
            GameEngine.engine._canH = GameEngine.engine.size.height;
            console.log("resize");

        });

        // A variable to store the requestID.
        var requestID;

        // Variables to for the drawing position and object.
        var posX = 0;
        var boxWidth = 50;
        var pixelsPerFrame = 5; // How many pixels the box should move per frame.

        // Draw the initial box on the canvas.
        ctx.fillRect(posX, 0, boxWidth, canvas.height);


        // Animate.
        function animate() {
            requestID = requestAnimationFrame(animate);

            // If the box has not reached the end draw on the canvas.
            // Otherwise stop the animation.
            if (posX <= (canvas.width - boxWidth)) {
                ctx.clearRect((posX - pixelsPerFrame), 0, boxWidth, canvas.height);
                ctx.fillRect(posX, 0, boxWidth, canvas.height);
                posX += pixelsPerFrame;
            } else {
                cancelAnimationFrame(requestID);
            }
        }

        requestID = requestAnimationFrame(animate);
    }

    //Doesn't start the game loop until everything that's pending loading has been loaded
    private actuallyStartNewGame(): void {
        if (loadingCount > 0) {
            console.log("Waiting on loading count: ", loadingCount);
            return;
        }

        clearInterval(GameEngine.engine._loadCountId);
        //GameEngine.engine._gameLoopId = setInterval(GameEngine.engine.genGameLoop(), 1000 / 1);  //TODO make the game loop better
		this.gameStep(); // will keep running once called ONCE
	}

    startNewGame(playerName: string = "Player 1"): void {
        this._curInteraction = null;
        this._nextInteraction = null;
        this._curLevelId = null;
        this._nextLevelId = GameEngine.StartingLevel;
        this.player = new Player("player-"+NextId(), playerName, IMAGES.playerImg);


        //pause until everything has been loaded
        this._loadCountId = setInterval(this.actuallyStartNewGame, 1000 / 5);
    }

    genGameLoop(): any {
        return () => {
            return this.gameStep();
        }
    }

	// The "update" function AKA the game loop
    gameStep(): void {

        //switch levels if needed
        var level: ILevel = this.GetLevel(this._curLevelId);
        if (this._curLevelId != this._nextLevelId) {
            if (level !== null) {
                level.Leave();
            }
            level = this.GetLevel(this._nextLevelId);
            if (level !== null) {
                level.Enter(this.player, this);
            }
            this._curLevelId = this._nextLevelId;
            console.log("Switched to level: ", this._curLevelId);
        } else {
            if (level !== null) {
                level.Update();
            }
        }

        //switch interactions if needed
        if (this._curInteraction != this._nextInteraction) {
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
            if (this._curInteraction !== null) {
                uiHandlers.push(this._curInteraction);
                uiHandlers.push(level);
            } else {
                //TODO uiHandlers.push(inventoryBagButton);
                uiHandlers.push(level);
            }

            //send input to all the ui handlers until one of them does something with it
            var handled: boolean = false;
            for (var i = 0; i < uiHandlers.length; ++i) {
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

        //display any dynamic animations //TODO support multiple animations in the future
        /*if (this._animationFn != null) {
            requestAnimationFrame(this.buildAnimations(this._animationFn));
        }*/
		
		requestAnimationFrame(gameStep);
    }

    //Creates a function which runs an animation specified by the given animation function
    private buildAnimations(animationFn: any) {
        var fn = function () {
            var requestId = requestAnimationFrame(fn);

            var done: boolean = animationFn();
            if (done) {
                cancelAnimationFrame(requestId);
            }
        }

        return fn
    }

    //----- Engine helper functions -----//

    private GetLevel(id: string): ILevel {
        return LevelMap[id] || null;
    }

    get size(): { height: number; width: number } {
        var canvas = <HTMLCanvasElement>document.getElementById(GameEngine.CanvasId);
        return {
            width: canvas.width,
            height: canvas.height
        };
    }

    //----- Called by a level or interaction to send info to the game engine -----//

    //Indicates the animation to play
    AddAnimation(id: string, fn: any): void {
        //TODO support multiple animations
        this._animationFn = fn;
    }

    //Cancels an animation
    RemoveAnimation(id: string): void {
        this._animationFn = null;
    }

    //Specifies the level to switch to on the next update
    NextLevel(id: string): void {
        this._nextLevelId = id;
    }

    //Specifies the interaction to switch to on the next update
    NextInteraction(interaction: IInteraction): void {
        this._nextInteraction = interaction;
    }

    //Leaves the current interaction on the next update
    ClearInteraction(): void {
        this._nextInteraction = null;
    }
}

