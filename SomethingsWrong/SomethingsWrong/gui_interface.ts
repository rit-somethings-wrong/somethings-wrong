/// <reference path="collision.ts" />
/// <reference path="utilities.ts" />
/// <reference path="collision.ts" />
/// <reference path="engine.ts" />
// gui_interface.ts - classes for drawing and managing the GUI layer of our game.

// Register dependent images.
RegisterImage(IMAGES.inventoryImg);

class GUIPanel implements IInteraction
{
    public ourEngine : GameEngine;  // engine pointer
    private bgImageName : any;      // name of the background image of this panel
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

    SetPosition(thePos: Vector): void {
        this.position = thePos;
    }

    GetPosition(): Vector {
        return this.position;
    }

    GetWidth(): number {
        return this.width;
    }

    GetHeight(): number {
        return this.height;
    }

    SetBackgroundImageName(imgName: string) {
        this.bgImageName = imgName;
    }

    GetBackgroundImage(): HTMLImageElement {
        return GetImage( this.bgImageName );
    }

    GetBackgroundDimensions(): Vector {
        var bgImg = this.GetBackgroundImage();

        if (bgImg != null) {
            return new Vector(bgImg.width, bgImg.height);
        }

        return null;
    }

    TransformMouseToImageCoordinates(mx: number, my: number): Vector {
        // Get 0..1 scalars based on GUI panel plane.
        mx /= this.GetWidth();
        my /= this.GetHeight();

        var backgroundDimm = this.GetBackgroundDimensions();

        if (backgroundDimm != null) {
            // Return a vector that is in the image space.
            return new Vector(mx * backgroundDimm.getX(), my * backgroundDimm.getY());
        }

        return new Vector(mx, my);
    }

    Enter() {

    }

    Draw( context : any ) : void
    {
        // If we have a background image, draw it.
        var backgroundImage = this.GetBackgroundImage();

        if ( backgroundImage != null ) 
        {
            context.drawImage(
                backgroundImage,
                this.GetPosition().getX(), this.GetPosition().getY(),
                this.GetWidth(), this.GetHeight()
            );
        }
    }

    Leave() {

    }

    Update() {
        
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
    private closeButtonArea: BoundingRectangle;  // mouse intersection area in image space (pixels)
    private guiScale: number;

    constructor( theEngine : GameEngine )
    {
        super( theEngine );

        this.SetBackgroundImageName(IMAGES.inventoryImg);

        this.closeButtonArea = new BoundingRectangle(new Vector(50, 50), 100, 60);

        this.guiScale = 1;
    }

    GetPosition(): Vector {
        var viewportSize = this.ourEngine.size;

        var width = this.GetWidth();
        var height = this.GetHeight();

        return new Vector(viewportSize.width / 2 - width / 2, viewportSize.height / 2 - height / 2);
    }

    GetWidth(): number {
        var bgImg = this.GetBackgroundImage();

        if (bgImg != null) {
            return bgImg.width * this.guiScale;
        }

        return 160;
    }

    GetHeight(): number {
        var bgImg = this.GetBackgroundImage();

        if (bgImg != null) {
            return bgImg.height * this.guiScale;
        }
        return 130;
    }

    Clicked(mx: number, my: number) : boolean
    {
        console.log("clicked on inventory");

        // Test: try to click on the given area. if done, output some debug to console.
        var mouseCoordVector = this.TransformMouseToImageCoordinates(mx, my);

        if (this.closeButtonArea.intersectWithPoint(mouseCoordVector)) {
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
        var backgroundClickAt = this.TransformMouseToImageCoordinates(mx, my);

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
