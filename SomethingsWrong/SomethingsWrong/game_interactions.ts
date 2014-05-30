function drawGameText( drawingContext, theText, x, y, width, height )
{
    // TODO: draw text using game font.
}

function getGameTextLength( theText : string )
{
    return 0;
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
        this.bgImage = theBackground;
        this.text = theText;
        this.pos = thePos;
        this.width = theWidth;
        this.height = theHeight;
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
        var textLength = getGameTextLength( this.text );
        var textHeight = getGameTextHeight( this.text );
        
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
            textLength, textHeight
        );
    }
};

class DoorOpenInteraction implements IInteraction
{
    private ourPlayer : Player;
    private ourLevel : Level;
    
    SetDetails( player : IPlayer, level : Level ) : void
    {
        
    }
    
    RegisterResult( callback : any ) : void
    {
        
    }
    
    Clicked( x : number, y : number ) : void 
    {
    
    }
    
    Enter() : void
    {
    
    }
    
    Leave() : void
    {
    
    }
    
    Draw( ctx : CanvasRenderingContext2D ) : void
    {
    
    }
};

class ItemPickupInteraction implements IInteraction
{
    private ourPlayer : Player;
    private ourLevel : Level;
    
    private notification : CanvasNotification;
    
    SetDetails( player : IPlayer, level : Level ) : void
    {
        this.ourPlayer = player;
        this.ourLevel = level;
    }
    
    RegisterResult( callback : any ) : void
    {
        
    }
    
    Clicked( x : number, y : number ) : void 
    {
        
    }
    
    Enter() : void
    {
        
    }
    
    Leave() : void
    {
        
    }
    
    Draw( ctx : CanvasRenderingContext2D ) : void
    {
        this.notification.Draw( ctx );
    }
};

class KonversationInteraction : implements IInteraction
{
    private ourPlayer : Player;
    private ourLevel : Level;
    
    SetDetails( player : IPlayer, level : Level ) : void
    {
        
    }
    
    RegisterResult( callback : any ) : void
    {
        
    }
    
    Clicked( x : number, y : number ) : void 
    {
    
    }
    
    Enter() : void
    {
    
    }
    
    Leave() : void
    {
    
    }
    
    Draw( ctx : CanvasRenderingContext2D ) : void
    {
    
    }
};