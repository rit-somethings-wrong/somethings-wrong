/// <reference path="utilities.ts" />

// Level - just data

// Class that specifies a teleport spot on a map.
// It makes the player switch maps.
// EntryExit stays immutable across the runtime.
class EntryExit
{
    private entrySphere : BoundingSphere;
    private exitId : string;
    private exitPos : Vector;
    
    constructor(
        entryX : number, entryY : number, entryRange : number,
        exitId : string,
        exitX : number, exitY : number )
    {
        this.entrySphere =
            new BoundingSphere(
                new Vector( entryX, entryY ),
                entryRange
            );
        this.exitId = exitId;
        this.exitPos = new Vector( exitX, exitY );
    }
    
    isPointInRange( thePoint : Vector ) : boolean
    {
        return this.entrySphere.intersectWithPoint( thePoint );
    }
    
    getEntryPosition() : Vector
    {
        return this.entrySphere.getPosition();
    }
    
    getExitPosition() : Vector
    {
        return this.exitPos;
    }
    
    getExitID() : string
    {
        return this.exitId;
    }
};

class ViewportTransform
{
    private position : Vector;
    private width : number;
    private height: number;
    private linkedLevel: Level;
    
    constructor( width : number, height : number, theLevel : Level )
    {
        this.position = new Vector( 0, 0 );
        this.width = width;
        this.height = height;
        this.linkedLevel = theLevel;
    }
    
    GetPosition() : Vector
    {
        return this.position;
    }
    
    GetWidth() : number
    {
        return this.width;
    }
    
    GetHeight() : number
    {
        return this.height;
    }
    
    SetWidth( width : number )
    {
        this.width = width;
    }
    
    SetHeigth( height : number )
    {
        this.height = height;
    }
    
    TransformPos( vecPos : Vector ) : Vector
    {
        if (!vecPos) {
            return this.position;
        }
        return vecPos.add(this.position);
    }
    
    InverseTransformPos( vecPos : Vector ) : Vector
    {
        if (!vecPos) {
            return this.position;
        }
        return vecPos.subtract( this.position );
    }
    
    // Draws an image that scrolls using viewport properties.
    DrawImageUsingViewport(
        context : CanvasRenderingContext2D, img : HTMLImageElement,
        offsetWorld : Vector,
        contextDrawX : number, contextDrawY : number,
        contextDrawWidth : number, contextDrawHeight : number
    )
    {
        var backgroundDrawPos =
            this.InverseTransformPos(
                offsetWorld
                );

        context.drawImage(
            img,
            // drawing settings about the clipped part of the image.
            backgroundDrawPos.getX(), backgroundDrawPos.getY(),
            this.GetWidth(), this.GetHeight()
            /*,
            // drawing settings on the canvas.
            contextDrawX, contextDrawY,
            2560, 1000
            */
            );
    }

    // Viewport vector -> world vector
    GetWorldVectorFromScreenVector( viewportVec : Vector ): Vector {
        var backgroundDimensions = this.linkedLevel.GetBackgroundDimensions();

        if (backgroundDimensions != null) {
            var screenScalarX = viewportVec.getX() / this.width;
            var screenScalarY = viewportVec.getY() / this.height;

            // Return the new vector in world space.
            return new Vector(backgroundDimensions.getX() * screenScalarX, backgroundDimensions.getY() * screenScalarY);
        }

        // background has not loaded yet.
        return null;
    }

    // World vector -> viewport vector
    GetScreenVectorFromWorldVector(worldVector: Vector): Vector {
        var backgroundDimensions = this.linkedLevel.GetBackgroundDimensions();

        if (backgroundDimensions != null) {
            var worldScalarX = worldVector.getX() / backgroundDimensions.getX();
            var worldScalarY = worldVector.getY() / backgroundDimensions.getY();

            return new Vector(this.width * worldScalarX, this.height * worldScalarY);
        }

        // background has not loaded yet.
        return null;
    }
};

// Level class.
class Level implements ILevel
{
    private isInitialized : boolean;

    private ourPlayer: IPlayer = null;
    private ourEngine: GameEngine = null;
    private id : string; 
    private backgroundImageName: string; // JS image file (background)
    private exits : any;  // list of EntryExit class objects
    private locationPlayer : Vector;
    private navLineInfo : NavRoute;
    private levelSize : Vector;
    private viewport: ViewportTransform;

    private inventory: IInventory = new Inventory();
    
    // Constructor.
    constructor( levelConfig: ILevelConfig )
    {
        this.isInitialized = false;
        
        ////this.ourEngine = theEngine
        this.id = levelConfig.name;
        this.backgroundImageName = levelConfig.img;
        this.exits = null;
        this.locationPlayer = new Vector( 50, 100 ); // DEBUG: use generic position to see the player sprite
        this.navLineInfo = null;
        this.levelSize = null;

        // Set up the scrollable viewport.
        // This is done by triggering a viewport change.
        this.viewport = new ViewportTransform(5, 5, this);
        this.OnViewportChange(5, 5);

        // LEVEL LOGIC LOADER.

        // Create general level information.
        this.navLineInfo = new NavRoute();
        this.locationPlayer = new Vector(0, 0);
        this.exits = [];

        if (false) {
            // Example level details.
            this.id = "test_level";
            this.levelSize = new Vector(600, 350);

            // Set up a basic navmesh.
            this.navLineInfo.addPoint(new Vector(0, 50));
            this.navLineInfo.addPoint(new Vector(this.levelSize.getX(), 50));
        }
        else {
            // Load level meta data.
            this.id = levelConfig.name;
            this.levelSize = new Vector(
                levelConfig.rectSize[0],
                levelConfig.rectSize[1]
                );

            // Load navigation information.
            var concurrentLine = levelConfig.concurrentLine;

            if (concurrentLine != null) {
                // Loop through all points and add them.
                for (var n = 0; n < concurrentLine.length; n++) {
                    var pointToAdd = concurrentLine[n];
                    var pointClassNative = new Vector(
                        pointToAdd[0],
                        pointToAdd[1]
                        );

                    // Add the vector point class to the navigation line info.
                    this.navLineInfo.addPoint(pointClassNative);
                }
            }

            // Load entry/exit points.
            var entryExits = levelConfig.entryExits;

            if (entryExits != null) {
                // Loop through all entryExit structures and create their native representation.
                for (var n = 0; n < entryExits.length; n++) {
                    var entryExitData = entryExits[n];

                    var entryExitNative = new EntryExit(
                        entryExitData.entryX, entryExitData.entryY,
                        entryExitData.entryRange,
                        entryExitData.exitId,
                        entryExitData.exitX, entryExitData.exitY
                        );

                    // Add the entryExit into our native list.
                    this.exits.push(entryExitNative);
                }
            }

            // Load level items (actual item entities).
            var levelItems = levelConfig.levelItems;
            if (levelItems != null) {
                // Loop through all level items and store them
                for (var n = 0; n < levelItems.length; n++) {
                    var itemData = levelItems[n];

                    var location: Vector = null;
                    if (itemData.x !== null && itemData.y !== null) {
                        location = new Vector(itemData.x, itemData.y);
                    }

                    var weight: number = null;
                    if (itemData.itemWeight !== null) {
                        weight = itemData.itemWeight;
                    }

                    this.inventory.AddItem(new Entity(
                        itemData.itemID,
                        itemData.name,
                        itemData.imgName,
                        location,
                        itemData.itemWeight));
                }
            }
        }

        // Make sure we can use methods that require a loaded level.
        this.isInitialized = true;
    }

    GetBackgroundImage(): HTMLImageElement {
        return GetImage(this.backgroundImageName);
    }

    // Get background width and height.
    GetBackgroundDimensions(): Vector {
        var bgImg = this.GetBackgroundImage();

        if (bgImg != null) {
            return new Vector(bgImg.width, bgImg.height);
        }

        return null;
    }
    
    // Called by the engine when the viewport changes.
    // The scrollable viewport has to be readjusted.
    OnViewportChange( newWidth : number, newHeight : number ) : void
    {
        this.viewport.SetWidth( newWidth );
        this.viewport.SetHeigth( newHeight );
    }
    
    // Common methods, makes sense.
    GetName() : string
    {
        return this.id;
    }
    
    GetSize() : Vector
    {
        return this.levelSize;
    }

    // places player can go
    // Using the camera info, draws the background at a certain place
    
    private checkInitialized() : void
    {
        if ( this.isInitialized == false )
            throw "illegal level state: not initialized";
    }
    
    // Experimental function.
    DrawImageOnViewport(
        context: CanvasRenderingContext2D, image : HTMLImageElement,
        drawPos : Vector,
        renderX : number, renderY : number,
        renderWidth : number, renderHeight : number
    )
    {
        this.viewport.DrawImageUsingViewport(
            context, image,
            drawPos,
            renderX, renderY,
            renderWidth, renderHeight
            );
    }
    
    private DrawEntity( drawingContext : CanvasRenderingContext2D, theEntity : IEntity )
    {
        var drawingPosition =
            //this.viewport.InverseTransformPos( theEntity.location );
            theEntity.location;
        
        theEntity.Draw(drawingContext, drawingPosition);
    }

    Draw(context: CanvasRenderingContext2D, location?: Vector): void {
        //TODO
        if (location == null) {
            location = new Vector(0, 0);
        }

        this.DrawWithSize(context, location.getX(), location.getY(), this.viewport.GetWidth(), this.viewport.GetHeight());
    }

    DrawWithSize(
        context : CanvasRenderingContext2D,
        renderX : number, renderY : number,
        renderWidth : number, renderHeight : number
    ) : void
    {
        this.checkInitialized();

        if (context == null) {
            throw "no context exception";
        }

        console.log("image elem: " + this.backgroundImageName);

        var backgroundImage = GetImage(this.backgroundImageName);

        if (backgroundImage != null) {
            // Render the background image.
            // The viewport wraps around the image clipping functionality.
            this.DrawImageOnViewport(
                context, backgroundImage,
                new Vector(0, 0),
                renderX, renderY,
                renderWidth, renderHeight
            );
        }

        // todo: draw player.
        this.DrawEntity(context, this.ourPlayer);

        // Set some player size that fits the level.
        // TODO: maybe change the player skin scale depending on level.
        this.ourPlayer.imageWidth = 25;
        this.ourPlayer.imageHeight = 40;
        
        // probably draw items too?
        var levelItemsList = this.inventory.GetAllItems();
        for ( var n = 0; n < levelItemsList.length; n++ )
        {
            var anItem = levelItemsList[ n ];
            
            // Transform the item into viewport space.
            this.DrawEntity( context, anItem );
        }
    }


    // Called from the game engine when we move to this screen
    Enter(player: IPlayer, engine: GameEngine) : void
    {
        this.ourPlayer = player;
        this.ourEngine = engine;

        var size = engine.size;
        this.OnViewportChange(size.width, size.height);
    }

    

    // What ID are we leaving to?
    //// Clean up stuff 
    Leave() : void
    {
        //if ( this.isInitialized == false )
        //{
        //    throw "illegal level state: tried to clean up already cleaned up level";
        //}
        
        //Note: we're keeping the level in memory.  If we do dynamic loading later we should use weak references and manage things by id
        //// Clean up and then tell engine that we are ready to leave to which other level
        // It knows where we are and where the exits are / we're going to
        //this.navLineInfo = null;
        //this.locationPlayer = null;
        //this.exits = null;
        //this.levelItems = null;
        //this.levelSize = null;
        //this.backgroundImage = null;
        
        // We are not loaded anymore, make sure calling methods that require us fails.
        //this.isInitialized = false;
    }
    
    // Pulse function - used to update level activity (events, entryExits, interactions, etc)
    Update() : void
    {
        this.checkInitialized();

        // Update the player location.
        if (this.ourPlayer !== null) {
            this.locationPlayer = this.ourPlayer.location;
        } else {
            this.locationPlayer = null;
        }
        
        // todo: add more sofisticated effects?
        
        // Check whether the player is in reaching distance to any entryExit
        var anyEntryExit = null;
        
        for ( var n = 0; n < this.exits.length; n++ )
        {
            var theExit = this.exits[ n ];
            
            if ( theExit.isPointInRange( this.locationPlayer ) )
            {
                anyEntryExit = theExit;
                break;
            }
        }
        
        // If we have a triggering entryExit, notify the engine that we want to switch levels.
        if ( anyEntryExit != null )
        {
            var switchLevelID = anyEntryExit.getExitID();
            //var switchLevelTargetLoc = anyEntryExit.getExitPosition();
            
            // Call into the engine so it can perform the unloading and reloading.
            // The engine should keep in mind to switch the level (a boolean?)
            this.ourEngine.NextLevel(
                switchLevelID
                //, switchLevelTargetLoc.getX(), switchLevelTargetLoc.getY()
            );
        }
    }

    Typed(chars: string): boolean {
        return false; // We don't do anything with keyboard input yet
    }

    // Clicked somewhere in the level - check to see if something is there?
    Clicked(mx : number, my : number) : boolean
    {
        this.checkInitialized();
        
        // Has the click been already processed?
        var hasClickBeenProcessed = false;
        
        // The point viewn as Vector.
        var mouseClickAt = new Vector(mx, my);

        //var worldMouseClickAt = this.viewport.GetWorldVectorFromScreenVector(mouseClickAt);
        var worldMouseClickAt = mouseClickAt;

        if (worldMouseClickAt != null) {
            // To properly process a click, we must transform the mouse-click to viewport space.
            var transformedMouseClick =
                this.viewport.TransformPos(
                    worldMouseClickAt
                    );

            console.log("level received some mouse click");

            if (hasClickBeenProcessed == false) {
                // Check whether our click lands on any item in the level.
                var levelItemsList = this.inventory.GetAllItems();

                var defaultItemRadius = 5.0;

                var itemClickedAt = null;
                var itemComesFromLevelList = false;

                for (var n = 0; n < levelItemsList.length; n++) {
                    var theItem = levelItemsList[n];
                    var itemLocation = theItem.location;

                    // Is the item added to world?
                    if (itemLocation != null) {
                        var itemBounds =
                            new BoundingSphere(
                                itemLocation,
                                defaultItemRadius
                                );

                        if (itemBounds.intersectWithPoint(transformedMouseClick)) {
                            itemClickedAt = theItem;
                            itemComesFromLevelList = true;
                            break;
                        }
                    }
                }

                // If we clicked at any item, we execute an action.
                if (itemClickedAt != null) {
                    // TODO: perform the action.
                    EntityList.TriggerEntityAction(itemClickedAt.id, itemClickedAt, this.ourPlayer, this, this.ourEngine);

                    // we have processed the click, so turn the flag to true.
                    hasClickBeenProcessed = true;
                }
            }

            // If there has been no click processing, we execute a default move-to action.
            if (hasClickBeenProcessed == false) {
                var pointToMoveTo = worldMouseClickAt;

                console.log("mouseX: " + pointToMoveTo.getX() + ", mouseY: " + pointToMoveTo.getY());

                var closestPointToClick = this.navLineInfo.calculateNearestPoint(pointToMoveTo).subtract(new Vector(0, 100));

                if (closestPointToClick != null) {
                    console.log("moving player to " + closestPointToClick.getX() + "," + closestPointToClick.getY());

                    // We want to move to the closest point we clicked to that corresponds to the navigation line.
                    this.ourPlayer.Place(closestPointToClick);
                }
                else {
                    console.log("could not determine collision line");
                }
            }
        }

        return true;
    }

    GetInventory(): IInventory {
        return this.inventory;
    }
};



