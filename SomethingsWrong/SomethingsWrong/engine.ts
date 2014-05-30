"use strict";

/// <reference path="player.ts" />
/// <reference path="utilities.ts" />




//TODO the HUD can be implemented as an Interaction?  Or does the HUD button trigger the Inventory Interaction?


class GameEngine {
    private static StartingLevel = "airport";
    private static CanvasId: string = "gameCanvas";
    private static DefaultPlayerImgUrl: string = "./TODO/playerImgUrl";
    private static MaxGameSteps = 5;  //TODO remove this as the game should continue until forever until the user closes the browser tab.  Beating the game should return you to the main screen.

    private ctx: CanvasRenderingContext2D;


    private player: IPlayer;   //represents the human user's avatar

    private _curLevelId: string;  //where we are
    private _nextLevelId: string; //where we're going to go on the next update

    private _curInteraction: IInteraction;  //the interaction state to use
    private _nextInteraction: IInteraction; //the interaction state to transition to on the next update

    private _animationFn: () => boolean;  //function that returns false when the animation should stop, else true

    private _click: { x: number; y: number } = null;
    private _chars: string = null;

    private _gameLoopId: number;
    private _gameSteps = 0;

    //-----  -----//

    constructor() {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(GameEngine.CanvasId);

        //listen for ui events
        canvas.onclick = (ev: MouseEvent): void => {
            this._click = {
                x: ev.clientX,
                y: ev.clientY
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

        var ctx = canvas.getContext('2d');

        // Set the fill style for the drawing context.
        ctx.fillStyle = '#210201';

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

    startNewGame(playerName: string = "Player 1"): void {
        this._curInteraction = null;
        this._nextInteraction = null;
        this._curLevelId = null;
        this._nextLevelId = GameEngine.StartingLevel;
        this.player = new Player(NextId(), playerName, IMAGES.playerImg);

        this._gameLoopId = setInterval(this.genGameLoop(), 1000 / 1);  //TODO make the game loop better
    }

    genGameLoop(): any {
        return () => {
            return this.gameStep();
        }
    }

    gameStep(): void {
        if (this._gameSteps > GameEngine.MaxGameSteps) {
            clearInterval(this._gameLoopId);
            return;
        }
        this._gameSteps++;
        console.log("Starting game step: ", this._gameSteps);

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
                uiHandlers.push(level);
                uiHandlers.push(this._curInteraction);
            } else {
                uiHandlers.push(level);
                //TODO uiHandlers.push(inventoryBagButton);
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
            gHandlers.push(this._curInteraction);
            gHandlers.push(level);
        } else {
            //TODO gHandlers.push(inventoryBagButton);
            gHandlers.push(level);
        }

        //draw all the layers
        for (var i = 0; i < gHandlers.length; ++i) {
            if (gHandlers[i] === null) {
                continue;
            }

            gHandlers[i].Draw(this.ctx);
        }

        //display any dynamic animations //TODO support multiple animations in the future
        if (this._animationFn != null) {
            requestAnimationFrame(this.buildAnimations(this._animationFn));
        }
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


/*


document.querySelector('canvas').onclick = doCLick; canvas; ctx; ctx = canvas.getContext('2d');

function doClick() {

    //getMousePos().x =

}

function getMousePos(canvas, evt) {

    var rect = canvas.getBoundingClientRect(); return {

        x: evt.clientX - rect.left, y: evt.clientY - rect.top

    };

}

var img = new Image(); img.src = "myimg.png"; canvas.drawImage(img, x, y);

function gameloop() {

    kldjaldkadlfsfl)_' requestAnimationFrame(gameLoop);

}

*/

var engine = new GameEngine();
engine.startNewGame("You");