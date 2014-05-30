/// <reference path="collision.ts" />
/// <reference path="engine.ts" />
// gui_interface.ts - classes for drawing and managing the GUI layer of our game.

class GUIPanel implements IUIHandler
{
    public ourEngine : GameEngine; // engine pointer
    private bgImage : any;          // background image of this panel
    private children : any;         // idea: children GUI panel that render afterward?
    private position : Vector;      // position of the GUI panel on the canvas
    private width : number;         // drawing width
    private height : number;        // drawing height
    private imageWidth: number;     // loaded image width (null if picture not loaded)
    private imageHeight : number;   // loaded image height (null if picture not loaded)
    
    constructor( theEngine : GameEngine )
    {
        this.ourEngine = theEngine;
        this.children = [];
        this.imageWidth = null;
        this.imageHeight = null;
    }
    
    // Set the background image to draw for this panel.
    LoadBackgroundImage( filePath : string ) : any
    {
        var image = new Image();
        var thisPtr = this;

        // Reset the image dimensions.
        this.imageWidth = null;
        this.imageHeight = null;
        
        image.onload = function()
        {
            thisPtr.imageWidth = this.width;
            thisPtr.imageHeight = this.height;
            
            image.onload = null;
        }
        
        image.src = filePath;
        
        return image;
    }

    getBackgroundImageWidth(): number {
        return this.imageWidth;
    }

    getBackgroundImageHeight(): number {
        return this.imageHeight;
    }

    transformMouseToImageCoordinates(mx: number, my: number): Vector {
        // Get 0..1 scalars based on GUI panel plane.
        mx /= this.width;
        my /= this.height;

        // Return a vector that is in the image space.
        return new Vector(mx * this.imageWidth, my * this.imageHeight);
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
    Clicked(mx : number, my : number) : boolean
    {
        // this method is meant to be overridden.

        // by default, GUIPanels accepts clicks.
        return true;
    }

    Typed(charString: string) : boolean {
        return false;
    }
};

class GUIInventoryScreen extends GUIPanel
{
    private testButtonArea: BoundingRectangle;  // mouse intersection area in image space (pixels)

    constructor( theEngine : GameEngine )
    {
        super( theEngine );

        this.LoadBackgroundImage(
            IMAGES.inventoryImg
            );

        this.testButtonArea = new BoundingRectangle(new Vector(50, 50), 100, 60);
    }

    Clicked(mx: number, my: number) : boolean
    {
        // Test: try to click on the given area. if done, output some debug to console.
        var mouseCoordVector = this.transformMouseToImageCoordinates(mx, my);

        if (this.testButtonArea.intersectWithPoint(mouseCoordVector)) {
            console.log("clicked successfully!");
        }
        
        return super.Clicked(mx, my);
    }
};

class GUIPauseScreen extends GUIPanel {
    private saveQuitArea: BoundingRectangle;
    private continueArea: BoundingRectangle;

    constructor(theEngine: GameEngine) {
        super(theEngine);

        // TODO: set up the rectangles properly.
        this.saveQuitArea = new BoundingRectangle(new Vector(11, 22), 120, 20);
        this.continueArea = new BoundingRectangle(new Vector(11, 51), 120, 20);
    }

    Clicked(mx: number, my: number): boolean {
        // Get the coordinate in image space.
        var backgroundClickAt = this.transformMouseToImageCoordinates(mx, my);

        var hasClickedButton = false;

        // Either save/quit.
        if (this.saveQuitArea.intersectWithPoint(backgroundClickAt)) {
            // we clicked at save/quit button.

            hasClickedButton = true;
        }

        // Or continue.
        if (this.continueArea.intersectWithPoint(backgroundClickAt)) {
            // we clicked at continue button.

            hasClickedButton = true;
        }

        if (hasClickedButton) {
            this.ourEngine.ClearInteraction();
        }

        return true;
    }
}
