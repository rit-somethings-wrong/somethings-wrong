/// <reference path="player.ts" />
/// <reference path="utilities.ts" />



//TODO the HUD can be implemented as an Interaction?  Or does the HUD button trigger the Inventory Interaction?


class GameEngine {
    private static StartingLevel = 0;

    private ctx: CanvasRenderingContext2D;


    private player: IPlayer;   //represents the human user's avatar

    private _curLevelId: number;  //where we are
    private _nextLevelId: number; //where we're going to go on the next update

    private _curInteraction: IInteraction;  //the interaction state to use
    private _nextInteraction: IInteraction; //the interaction state to transition to on the next update

    private _animationFn: () => boolean;  //function that returns false when the animation should stop, else true

    private levelMap: { [id: number]: ILevel } = {};  // levelId -> levelObj

    private _click: { x: number; y: number } = null;
    private _chars: string = null;

    constructor() {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('gameCanvas');

        //listen for ui events
        canvas.onclick = (ev: MouseEvent): void => {
            this._click = {
                x: ev.x,
                y: ev.y
            };
        }
        canvas.onkeypress = (ev: KeyboardEvent): void => {
            if (this._chars === null) {
                this._chars = ev.char;
                return;
            }

            this._chars = this._chars.concat(ev.char);
        }
        


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
        this.player = new Player(NextId(), playerName);

        this.gameStep();
    }

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
            //configure input layers
            var uiHandlers: IUIHandler[];
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
                    handled = handled || uiHandlers[i].typed(this._chars);
                }
                if (this._click !== null) {
                    handled = uiHandlers[i].clicked(this._click.x, this._click.y);
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
        var gHandlers: IDrawable[];
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

    //----- Engine helper functions -----//

    private GetLevel(id: number): ILevel {
        return this.levelMap[id]; //TODO should return null if the id doesn't exist in the map
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
    NextLevel(id: number): void {
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

/*
// Game engine
// 0 Manages moving from level to level
// Loop that checks where the player is/ if an event triggers

// current level var

function Switch()
{}

// Called upon mouseclick event on the canvas
function Clicked()
{
}

function DrawGUI()
{
    // tells the level to draw
    // draw HUD if enabled
}

function CreateObject()
{
    // create object (type and location)
}

function toggleHUD()
{
    
}
*/

var engine = new GameEngine();
engine.startNewGame("You");