


//Displays sequences of dialog messages
class Chat implements IInteraction {

    private engine: GameEngine;
    private msg: IDialogMsg;

    //-----  -----//

    //Switches to the next message.  If no next message, then tells the engine to stop displaying this interaction
    nextMsg(): void {
        if (this.msg === null || this.msg.connection === null) {
            this.engine.ClearInteraction();
            return;
        }

        this.msg = GetMessage(this.msg.connection);
    }

    //----- IInteraction methods -----//

    constructor(msgId: number) {
        this.msg = GetMessage(msgId);
    }

    Enter(player: IPlayer, engine: GameEngine, level: ILevel): void {
        this.engine = engine;
    }

    Update(): void {

    }

    Leave(): void {
        this.engine = null;
    }

    //----- IUIHandler methods -----//

    Clicked(x: number, y: number): boolean {
        this.nextMsg();
        return true;
    }

    Typed(char: string): boolean {
        this.nextMsg();
        return true;
    }

    //----- IDrawable methods -----//

    Draw(ctx: CanvasRenderingContext2D, location?: Vector) {
        if (!location) {
            location = new Vector(0, 0);
        }

        //TODO draw partially transparent background to enhance text contrast?
        //TODO adjust location and display based on type of message (thinking, other person, yelling, etc...)?

        //draw main message text
        ctx.fillStyle = '#005259'
        ctx.fillRect(0, 0, 10, 10);
        ctx.font = "20pt Arial";
        ctx.fillStyle = '#990000'
        //ctx.fillText(this.msg.dialog, location.getX(), location.getY());
        ctx.fillText("Yay, some stubbed chat text!", location.getX() + 10, location.getY() + 10);
    }

}