/// <reference path="entity_tasks.ts" />
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

    SetPosition(thePosition: Vector): void {
        this.position = thePosition;
    }
    
    GetPosition() : Vector
    {
        return this.position;
    }

    // Calculates a clamped rectangle in another rectangle.
    // It must be guarranteed that the client rectangle is smaller than the background/host rectangle.
    GetViewportRectangle( clientRectPos : Vector, clientRectDimm : Vector, backgroundDimensions : Vector ): BoundingRectangle {
        if (backgroundDimensions != null) {
            var referencePos = clientRectPos;

            if (referencePos != null) {
                var camPos = referencePos;

                var left = camPos.getX();
                var top = camPos.getY();
                var right = left + clientRectDimm.getX();
                var bottom = top + clientRectDimm.getY();

                if (left < 0) {
                    left = 0;
                    right = clientRectDimm.getX();
                }
                else if (right >= backgroundDimensions.getX()) {
                    left = backgroundDimensions.getX() - clientRectDimm.getX();
                    right = backgroundDimensions.getX()
                }

                if (top < 0) {
                    top = 0;
                    bottom = clientRectDimm.getY();
                }
                else if (bottom >= backgroundDimensions.getY()) {
                    top = backgroundDimensions.getY() - clientRectDimm.getY();
                    bottom = backgroundDimensions.getY();
                }

                return new BoundingRectangle(new Vector(left, top), right - left, bottom - top);
            }
        }

        return null;
    }

    GetViewportClipping(): BoundingRectangle {
        return this.GetViewportRectangle(
            this.GetPosition(), new Vector(this.GetWidth(), this.GetHeight()), this.linkedLevel.GetBackgroundDimensions()
        );
    }

    GetImageClipping( image : HTMLImageElement ): BoundingRectangle {
        return this.GetViewportRectangle(
            this.GetPosition(), new Vector(this.GetWidth(), this.GetHeight()), new Vector(image.width, image.height)
        );
    }

    GetLevelClipping(): BoundingRectangle {
        return this.GetViewportRectangle(
            this.GetPosition(), new Vector(this.GetWidth(), this.GetHeight()), this.linkedLevel.GetSize()
        );
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
    
    SetHeight( height : number )
    {
        this.height = height;
    }
    
    TransformPos( vecPos : Vector ) : Vector
    {
        var clipPos = this.GetLevelClipping().getPosition();

        if (!vecPos) {
            return clipPos;
        }
        return vecPos.add(clipPos);
    }
    
    InverseTransformPos( vecPos : Vector ) : Vector
    {
        var clipPos = this.GetLevelClipping().getPosition();

        if (!vecPos) {
            return clipPos;
        }
        return vecPos.subtract(clipPos);
    }

    // Draws an image that scrolls using viewport properties.
    DrawImageUsingViewport(
        context: CanvasRenderingContext2D, img: HTMLImageElement,
        offsetWorld: Vector,
        contextDrawX: number, contextDrawY: number,
        contextDrawWidth: number, contextDrawHeight: number
    ) : void
    {
        // Clip the viewport view in the level space.
        var viewportRectangle = this.GetLevelClipping();

        if (viewportRectangle) {
            // Scale up the selection rectangle.
            viewportRectangle.convertToSpace(this.linkedLevel.GetSize(), this.linkedLevel.GetBackgroundDimensions());

            context.drawImage(
                img,
            // drawing settings about the clipped part of the image.
                viewportRectangle.left, viewportRectangle.top, //backgroundDrawPos.getX(), backgroundDrawPos.getY(),
                viewportRectangle.getWidth(), viewportRectangle.getHeight(), //this.GetWidth(), this.GetHeight(),
            // drawing settings on the canvas.
                contextDrawX, contextDrawY,
                this.GetWidth(), this.GetHeight()
                );

            //console.log("contextDrawX: " + contextDrawX + ", contextDrawY: " + contextDrawY +
            //    ", this.width: " + this.GetWidth() + ", this.height: " + this.GetHeight() +
            //    ", img.width: " + img.width + ", img.height: " + img.height);
         //   console.log("rectLeft: " + viewportRectangle.left + ", rectTop: " + viewportRectangle.top + ", rectRight: " + viewportRectangle.right +
         //       ", rectBottom: " + viewportRectangle.bottom);
        }
    }

    // Viewport vector -> world vector
    GetWorldVectorFromScreenVector(viewportVec: Vector): Vector {
        var backgroundDimensions = this.linkedLevel.GetSize();

        if (backgroundDimensions != null) {
            var clonedVec = viewportVec.clone();

            clonedVec.convertToSpace(new Vector(this.width, this.height), backgroundDimensions);

            return this.TransformPos( clonedVec );
        }

        // background has not loaded yet.
        return null;
    }

    // World vector -> viewport vector
    GetScreenVectorFromWorldVector(worldVector: Vector): Vector {
        var backgroundDimensions = this.linkedLevel.GetSize();

        if (backgroundDimensions != null) {
            var clonedVector = this.InverseTransformPos( worldVector );

            clonedVector.convertToSpace(backgroundDimensions, new Vector(this.width, this.height));

            return clonedVector;
        }

        // background has not loaded yet.
        return null;
    }
};

// Level class.
class Level implements ILevel
{
    private isInitialized : boolean;

    public ourPlayer: IPlayer = null;
    private ourEngine: GameEngine = null;
    private id : string; 
    private backgroundImageName: string; // JS image file (background)
    private exits : any;  // list of EntryExit class objects
    private locationPlayer : Vector;
    private navLineInfo : NavRoute;
    private levelSize : Vector;
    private viewport: ViewportTransform;
    private inventory: IInventory = new Inventory();
    private cameraPosition: Vector;
    private lastLevelFrameDuration: number;
    private lastLevelFrameTime: number;
    private playerTaskManager: EntityTaskManager;
    private scalingReferenceHeight: number;
    
    // Constructor.
    constructor( levelConfig: ILevelConfig )
    {
        this.isInitialized = false;

        ////this.ourEngine = theEngine
        this.id = levelConfig.name;
        this.backgroundImageName = levelConfig.img;
        this.exits = null;
        this.locationPlayer = null;
        this.navLineInfo = null;
        this.levelSize = null;
        this.lastLevelFrameDuration = 0;
        this.lastLevelFrameTime = GetCurrentTimeSeconds();
        this.playerTaskManager = new EntityTaskManager();
        this.scalingReferenceHeight = 150;  // scale entities on the basis of 150px height

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

    GetWorldDimensions(): Vector {
        return this.GetSize();
    }
    
    // Called by the engine when the viewport changes.
    // The scrollable viewport has to be readjusted.
    OnViewportChange( newWidth : number, newHeight : number ) : void
    {
        this.viewport.SetWidth( newWidth );
        this.viewport.SetHeight( newHeight );
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
        var entityLocation = theEntity.location;

        if (entityLocation != null) {
            var drawingPosition =
                this.viewport.GetScreenVectorFromWorldVector(entityLocation);

            if (drawingPosition != null) {
                theEntity.Draw(drawingContext, drawingPosition);
            }
        }
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

        // Update frame duration logic.
        var currentSecondsRefValue = GetCurrentTimeSeconds();

        this.lastLevelFrameDuration = currentSecondsRefValue - this.lastLevelFrameTime;
        this.lastLevelFrameTime = currentSecondsRefValue;

        // Process the player tasks.
        this.playerTaskManager.Process(this.ourPlayer, this.lastLevelFrameDuration);

        // Update the camera position, so it is directly pointing at the player.
        if (this.locationPlayer != null) {
            this.cameraPosition = this.locationPlayer.clone();
        }

        if (this.locationPlayer != null) {
            // Set the viewport, so it is centered on the camera position.
            var viewportDimm = new Vector(this.viewport.GetWidth(), this.viewport.GetHeight());
            var viewportCenterOffset = viewportDimm.multiply(-0.5);

            this.viewport.SetPosition(viewportCenterOffset.add(this.cameraPosition));
                

            // Check whether the player is in reaching distance to any entryExit
            var anyEntryExit = null;

            for (var n = 0; n < this.exits.length; n++) {
                var theExit = this.exits[n];

                if (theExit.isPointInRange(this.locationPlayer)) {
                    anyEntryExit = theExit;
                    break;
                }
            }

            // If we have a triggering entryExit, notify the engine that we want to switch levels.
            if (anyEntryExit != null) {
                var switchLevelID = anyEntryExit.getExitID();
                var switchLevelTargetLoc = anyEntryExit.getExitPosition();

                // Call into the engine so it can perform the unloading and reloading.
                // The engine should keep in mind to switch the level (a boolean?)
                this.ourEngine.NextLevel(
                    switchLevelID
                //, switchLevelTargetLoc.getX(), switchLevelTargetLoc.getY()
                    );

                // Pre-change the location of the player for the next level.
                this.ourPlayer.location = switchLevelTargetLoc;
            }
        }
    }

    Typed(chars: string): boolean {
        // Open up a GUI inventory panel if pressing "i".
        if (chars === "I") {
            console.log("opening inventory");

            this.ourEngine.NextInteraction(new GUIInventoryScreen(this.ourEngine, this.ourPlayer));
        }

        console.log("testinput: " + chars);
        return true; // We don't do anything with keyboard input yet
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
        var worldMouseClickAt = this.viewport.GetWorldVectorFromScreenVector( mouseClickAt );

        if (worldMouseClickAt != null) {
            // To properly process a click, we must transform the mouse-click to viewport space.
            var transformedMouseClick = worldMouseClickAt;

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
                var pointToMoveTo = transformedMouseClick;

                console.log("mouseX: " + pointToMoveTo.getX() + ", mouseY: " + pointToMoveTo.getY());

                var closestPointToClick = this.navLineInfo.calculateNearestPoint(pointToMoveTo);

                if (closestPointToClick != null) {
                    console.log("moving player to " + closestPointToClick.getX() + "," + closestPointToClick.getY());

                    // If the player has not been placed before, place him now.
                    if (this.ourPlayer.location == null)
                    {
                        this.ourPlayer.Place(closestPointToClick);
                    }
                    else
                    {
                        // We want to move to the closest point we clicked to that corresponds to the navigation line.
                        this.playerTaskManager.QueueTask(new MoveToTask(closestPointToClick));
                    }
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



