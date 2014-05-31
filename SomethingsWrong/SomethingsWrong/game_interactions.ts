function drawGameText( drawingContext, theText, x, y, textAlignment : string )
{
    drawingContext.font = "30px Arial";
    drawingContext.textAlign = textAlignment;
    drawingContext.fillText(theText, x, y);
}

function getGameTextHeight( theText : string )
{
    return 12;
}

class CanvasNotification
{
    private bgImage : any;
    private text : string;
    private pos : Vector;
    private width : number;
    private height : number;
    
    constructor( bgImage, theText, thePos, theWidth, theHeight )
    {
        this.bgImage = bgImage;
        this.text = theText;
        this.pos = thePos;
        this.width = theWidth;
        this.height = theHeight;
    }

    SetPosition(thePos: Vector): void
    {
        this.pos = thePos;
    }
    
    Draw( drawingContext : any )
    {
        // Draw the notification background.
        drawingContext.drawImage(
            this.bgImage,
            this.pos.getX(), this.pos.getY(),
            this.width, this.height
        );

        // Get text metrics.
        var textLength = 0;//GetGameTextLength( this.text ); TODO
        var textHeight = 0;//GetGameTextHeight( this.text ); TODO
        
        // Draw the notification text.
        // It should be centered on the notification item.
        var posCenterX = this.pos.getX() + this.width / 2;
        var posCenterY = this.pos.getY() + this.height / 2;
        
        // Make sure we allocate space for the text.
        posCenterX -= textLength / 2;
        posCenterY -= textHeight / 2;
        
        // Draw the final product.
        drawGameText(
            drawingContext,
            this.text,
            posCenterX, posCenterY,
            "center"
        );
    }
};

class DoorOpenInteraction implements IInteraction
{
    private ourEngine: GameEngine;
    private ourPlayer : IPlayer;
    private ourLevel: ILevel;
    private notification: CanvasNotification;
    private callbackProto: any;
    
    RegisterResult( callback : any ) : void
    {
        this.callbackProto = callback;
    }

    Typed(chars: string): boolean {
        return false;
    }

    Clicked( x : number, y : number ) : boolean
    {
        this.ourEngine.ClearInteraction();
        return true;    // the click has been processed.
    }
    
    Enter(player: IPlayer, engine: GameEngine, level: ILevel) : void
    {
        this.ourEngine = engine;
        this.ourPlayer = player;
        this.ourLevel = level;
    }

    Update(): void {

    }

    Leave() : void
    {
        // nothing to clean up.
    }
    
    Draw( ctx : CanvasRenderingContext2D, location?: Vector ) : void
    {
        // draw the notification canvas.
        this.notification.SetPosition(location);
        this.notification.Draw(ctx);
    }
};

class ItemPickupInteraction implements IInteraction
{
    private ourEngine: GameEngine;
    private ourPlayer: IPlayer;
    private ourLevel: ILevel;
    
    private notification : CanvasNotification;
    
    RegisterResult( callback : any ) : void
    {
        
    }

    Typed(chars: string): boolean {
        return false;
    }

    Clicked(x: number, y: number): boolean {
        return false;
    }

    Enter(player: IPlayer, engine: GameEngine, level: ILevel): void {
        this.ourEngine = engine;
        this.ourPlayer = player;
        this.ourLevel = level;
    }
    
    Update(): void {

    }

    Leave() : void
    {
        
    }
    
    Draw(ctx: CanvasRenderingContext2D, location?: Vector): void
    {
        this.notification.SetPosition(location);
        this.notification.Draw( ctx );
    }
};

class KonversationInteraction implements IInteraction
{
    private ourEngine: GameEngine;
    private ourPlayer: IPlayer;
    private ourLevel: ILevel;

    RegisterResult(callback: any): void {

    }

    Typed(chars: string): boolean {
        return false;
    }

    Clicked(x: number, y: number): boolean {
        return false;
    }

    Enter(player: IPlayer, engine: GameEngine, level: ILevel): void {
        this.ourEngine = engine;
        this.ourPlayer = player;
        this.ourLevel = level;
    }

    Update(): void {

    }

    Leave(): void {

    }

    Draw(ctx: CanvasRenderingContext2D, location?: Vector): void {

    }
};