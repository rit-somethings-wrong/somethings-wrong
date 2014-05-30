// gui_interface.ts - classes for drawing and managing the GUI layer of our game.

function loadImage( imageIdentifier : string )
{
    var loadedImage = new Image();
    
    loadedImage.src = imageIdentifier;
    
    return loadedImage;
}

class GUIPanel
{
    private ourEngine : GameEngine;
    private bgImage : any;
    private children : any;
    private position : Vector;
    private width : number;
    private height : number;
    
    constructor( theEngine : GameEngine )
    {
        this.ourEngine = theEngine;
        this.children = [];
    }
    
    // Set the background image to draw for this panel.
    SetBackgroundImage( backgroundImage : any ) : void
    {
        this.bgImage = backgroundImage;
    }
    
    Draw( context : any ) : void
    {
        // If we have a background image, draw it.
        if ( this.bgImage != null ) 
        {
            context.drawImage(
                this.bgImage,
                this.position.getX(), this.position.getY(),
                this.width, this.height
            );
        }
    }
    
    // GUIPanel can receive clicking events.
    Clicked(mx : number, my : number)
    {
        // this method is meant to be overridden.
    }
};

class GUIInventoryScreen extends GUIPanel
{
    constructor()
    {
        SetBackgroundImage(
            loadImage( IMAGES.inventoryImg )
        );
    }
    
    Clicked(mx : number, my : number)
    {
        super.Clicked( mx, my );
    }
};