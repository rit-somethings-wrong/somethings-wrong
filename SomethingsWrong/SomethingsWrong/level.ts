// Level - just data

// Class that specifies a teleport spot on a map.
// It makes the player switch maps.
class EntryExit
{
    private entryPos : Vector;
    private entryRange : number;
    private exitId : string;
    private exitPos : Vector;
    
    constructor(
        entryX : number, entryY : number, entryRange : number,
        exitId : string,
        exitX : number, exitY : number )
    {
        this.entryPos = new Vector( entryX, entryY );
        this.entryRange = entryRange;
        this.exitId = exitId;
        this.exitPos = new Vector( exitX, exitY );
    }
    
    isPointInRange( thePoint : Vector ) : boolean
    {
        return ( thePoint.subtract( this.pos ).length() < this.range );
    }
    
    getEntryPosition() : Vector
    {
        return this.entryPos;
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

// Level class.
class Level
{
    private isInitialized : boolean;
    
    private ourEngine : Engine;
    private ourPlayer : Player;
    private id : string; 
    private backgroundImage : any;  // JS image file (background)
    private exits : any;  // list of EntryExit class objects
    private locationPlayer : Vector;
    private navLineInfo : NavRoute;
    private levelSize : Vector;
    
    // Constructor.
    constructor( theEngine : Engine, thePlayer : Player )
    {
        this.isInitialized = false;
        
        this.ourEngine = theEngine
        this.ourPlayer = thePlayer;
        this.id = "";
        this.img = null;
        this.exits = null;
        this.locationPlayer = createVector( 50, 100 ); // use generic position to see the player sprite
    }
    
    // Common methods, makes sense.
    getName() : string
    {
        return this.id;
    }
    
    getSize() : Vector
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
    
    Draw( context, renderX : number, renderY : number, renderWidth : number, renderHeight : number ) : void
    {
        checkInitialized();
        
        // Render the background image.
        context.drawImage(
            this.backgroundImage,
            renderX, renderY,
            renderWidth, renderHeight
        );
        
        // todo: draw player.
        this.ourPlayer.Draw(
            this.locationPlayer
        );
        
        // probably draw items too?
        var levelItemsList = this.ourEngine.getActiveItems();
        
        for ( var n = 0; n < levelItemsList.length; n++ )
        {
            var anItem = levelItemsList[ n ];
            
            anItem.Draw( anItem.location );
        }
    }

    // levelconfig PARAM REQUIREMENTS:
    // - has to be a JSON
    // {
    // concurrentLine : [ [ x, y ], [ x, y, ], [ x, y ], ... , [ x, y ] ], // navigation information
    // name : "level_name", // id of the level
    // rectSize : [ width, height ],
    // img: any, // background image information
    // };
    // TODO: ANYTHING else?
    // 

    Enter(levelConfig : any) : void
    {
        if ( this.isInitialized == true )
        {
            throw "illegal level state: tried to initialize already initialized level";
        }
        
        // Create general level information.
        this.navLineInfo = new NavRoute();
        this.locationPlayer = new Vector( 0, 0 );
        this.exits = [];
        
        this.backgroundImage = levelConfig.img;
        
        if ( false )
        {
            // Example level details.
            this.id = "test_level";
            this.levelSize = new Vector(600, 350);
            
            // Set up a basic navmesh.
            this.navLineInfo.addPoint( new Vector( 0, 50 ) );
            this.navLineInfo.addPoint( new Vector( levelSize.getX(), 50 ) );
        }
        else
        {
            // Load level meta data.
            this.id = levelConfig.name;
            this.levelSize = new Vector(
                levelConfig.rectSize[0],
                levelConfig.rectSize[1]
            );
            
            // Load navigation information.
            var concurrentLine = levelConfig.concurrentLine;
            
            if ( concurrentLine != null )
            {
                // Loop through all points and add them.
                for ( var n = 0; n < concurrentLine.length; n++ )
                {
                    var pointToAdd = concurrentLine[ n ];
                    var pointClass = new Vector(
                        pointToAdd[0],
                        pointToAdd[1]
                    );
                    
                    this.navLineInfo.addPoint( pointToAdd );
                }
            }
            
            // Load entry/exit points.
            var entryExits = levelConfig.entryExits;
            
            if ( entryExits != null )
            {
                // Loop through all entryExit structures and create their native representation.
                for ( var n = 0; n < entryExits.length; n++ )
                {
                    var entryExitData = entryExits[ n ];
                    
                    var entryExitNative = new EntryExit(
                        entryExitData.entryX, entryExitData.entryY,
                        entryExitData.entryRange,
                        entryExitData.exitId,
                        entryExitData.exitX, entryExitData.exitY
                    );
                    
                    // Add the entryExit into our native list.
                    this.exits.push( entryExitNative );
                }
            }
        }
        
        // Make sure we can use methods that require a loaded level.
        this.isInitialized = true;
    }

    // Call to game engine
    
    

    // What ID are we leaving to?
    // Clean up stuff 
    Done() : void
    {
        if ( this.isInitialized == false )
        {
            throw "illegal level state: tried to clean up already cleaned up level";
        }
        
        // Clean up and then tell engine that we are ready to leave to which other level
        // It knows where we are and where the exits are / we're going to
        this.navLineInfo = null;
        this.locationPlayer = null;
        this.exits = null;
        this.levelSize = null;
        this.backgroundImage = null;
        
        // We are not loaded anymore, make sure calling methods that require us fails.
        this.isInitialized = false;
    }
    
    // Pulse function - used to update level activity (events, entryExits, interactions, etc)
    Update() : void
    {
        checkInitialized();
        
        // Update the player location.
        this.locationPlayer = ourPlayer.location;
        
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
            var switchLevelID = anyEntryExit.getExitId();
            var switchLevelTargetLoc = anyEntryExit.getExitPosition();
            
            // Call into the engine so it can perform the unloading and reloading.
            // The engine should keep in mind to switch the level (a boolean?)
            this.ourEngine.notifyLevelSwitch(
                switchLevelID,
                switchLevelTargetLoc.getX(), switchLevelTargetLog.getY()
            );
        }
    }

    // Clicked somewhere in the level - check to see if something is there?
    Clicked(mx : number, my : number) : void
    {
        checkInitialized();
        
        var pointToMoveTo = new Vector( mx, my );
        
        var closestPointToClick = this.navLineInfo.calculateNearestPoint( pointToMoveTo );
        
        // We want to move to the closest point we clicked to that corresponds to the navigation line.
        this.ourPlayer.moveTo( closestPointToClick );
    }
};



