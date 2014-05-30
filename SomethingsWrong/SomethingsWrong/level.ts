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
    private height : number;
    
    constructor( width : number, height : number )
    {
        this.position = new Vector( 0, 0 );
        this.width = width;
        this.height = height;
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
        return vecPos.add( this.position );
    }
    
    InverseTransformPos( vecPos : Vector ) : Vector
    {
        return vecPos.subtract( this.position );
    }
    
    // Draws an image that scrolls using viewport properties.
    DrawImageUsingViewport(
        context : any, img : any,
        offsetWorld : Vector,
        contextDrawX : number, contextDrawY : number,
        contextDrawWidth : number, contextDrawHeight : number
    )
    {
        if (img != null) {
            var backgroundDrawPos =
                this.InverseTransformPos(
                    offsetWorld
                    );

            context.drawImage(
                img,
                // drawing settings about the clipped part of the image.
                backgroundDrawPos.getX(), backgroundDrawPos.getY(),
                this.GetWidth(), this.GetHeight(),
            // drawing settings on the canvas.
                contextDrawX, contextDrawY,
                contextDrawWidth, contextDrawHeight
                );
        }
    }
};

// Level class.
class Level implements ILevel
{
    private isInitialized : boolean;

    private ourPlayer: IPlayer = null;
    private ourEngine: GameEngine = null;
    private id : string; 
    private backgroundImage: any;  // JS image file (background)
    private exits : any;  // list of EntryExit class objects
    private locationPlayer : Vector;
    private navLineInfo : NavRoute;
    private levelSize : Vector;
    private viewport : ViewportTransform;
    private levelItems : any;
    
    // Constructor.
    constructor( levelConfig: ILevelConfig )
    {
        this.isInitialized = false;
        
        ////this.ourEngine = theEngine
        this.id = levelConfig.name;
        this.backgroundImage = levelConfig.img;
        this.exits = null;
        this.levelItems = null;
        this.locationPlayer = new Vector( 50, 100 ); // DEBUG: use generic position to see the player sprite
        this.navLineInfo = null;
        this.levelSize = null;

        // Set up the scrollable viewport.
        // This is done by triggering a viewport change.
        this.viewport = new ViewportTransform(5, 5);
        this.OnViewportChange(5, 5);


        if (this.isInitialized == true) {
            throw "illegal level state: tried to initialize already initialized level";
        }

        // Create general level information.
        this.navLineInfo = new NavRoute();
        this.locationPlayer = new Vector(0, 0);
        this.exits = [];
        this.levelItems = [];

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
                    var pointClass = new Vector(
                        pointToAdd[0],
                        pointToAdd[1]
                        );

                    this.navLineInfo.addPoint(pointToAdd);
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
                // Loop through all placed level items and make them active.
                for (var n = 0; n < levelItems.length; n++) {
                    var itemData = levelItems[n];

                    var itemNative =
                        new Item(
                            itemData.itemID,
                            itemData.name,
                            itemData.itemWeight
                            );

                    // Position the item in the level.
                    itemNative.location =
                    new Vector(
                        itemData.x,
                        itemData.y
                        );

                    // Push it into the active native item entities list.
                    this.levelItems.push(itemNative);
                }
            }
        }

        // Make sure we can use methods that require a loaded level.
        this.isInitialized = true;
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
        context, image,
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
            this.viewport.InverseTransformPos( theEntity.location );
        
        theEntity.Draw( drawingContext, drawingPosition );
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

        // Only render if we have a background image.
        if (this.backgroundImage != null) {
            // Render the background image.
            // The viewport wraps around the image clipping functionality.
            this.DrawImageOnViewport(
                context, this.backgroundImage,
                new Vector(0, 0),
                renderX, renderY,
                renderWidth, renderHeight
                );
        }
        
        // todo: draw player.
        this.DrawEntity( context, this.ourPlayer );
        
        // probably draw items too?
        var levelItemsList = this.levelItems;
        
        if ( levelItemsList != null )
        {
            for ( var n = 0; n < levelItemsList.length; n++ )
            {
                var anItem = levelItemsList[ n ];
                
                // Transform the item into viewport space.
                this.DrawEntity( context, anItem );
            }
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
        var mouseClickAt = new Vector( mx, my );
        
        if ( hasClickBeenProcessed == false )
        {
            // Check whether our click lands on any item in the level.
            var levelItemsList = this.levelItems;
            
            var defaultItemRadius = 5.0;
            
            var itemClickedAt = null;
            var itemComesFromLevelList = false;
            
            // To properly process a click, we must transform the mouse-click to viewport space.
            var transformedMouseClick =
                this.viewport.TransformPos(
                    mouseClickAt
                );
            
            if ( levelItemsList != null )
            {
                for ( var n = 0; n < levelItemsList.length; n++ )
                {
                    var theItem = levelItemsList[ n ];
                    
                    var itemBounds =
                        new BoundingSphere(
                            theItem.location,
                            defaultItemRadius
                        );
                    
                    if ( itemBounds.intersectWithPoint( transformedMouseClick ) )
                    {
                        itemClickedAt = theItem;
                        itemComesFromLevelList = true;
                        break;
                    }
                }
            }
            
            // If we clicked at any item, we execute an action.
            if ( itemClickedAt != null )
            {
                // TODO: perform the action.
                itemClickedAt.Pickup();
                
                // If we clicked on an item that comes from the level items list.
                if ( levelItemsList != null && itemComesFromLevelList )
                {
                    // Remove the item from our list of active item entities.
                    ArrayDeleteValue( levelItemsList, itemClickedAt );
                }
                
                // we have processed the click, so turn the flag to true.
                hasClickBeenProcessed = true;
            }
        }
        
        // If there has been no click processing, we execute a default move-to action.
        if ( hasClickBeenProcessed == false )
        {
            var pointToMoveTo = mouseClickAt;
            
            var closestPointToClick = this.navLineInfo.calculateNearestPoint( pointToMoveTo );
            
            // We want to move to the closest point we clicked to that corresponds to the navigation line.
            this.ourPlayer.Place(closestPointToClick);
        }

        return true;
    }
};



