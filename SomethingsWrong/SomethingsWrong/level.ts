// Level - just data

// Level class.
class Level
{
    private ourEngine : Engine;
    private ourPlayer : Player;
    private id : string; 
    private backgroundImage : any;  // JS image file (background)
    private exits : any;  // list of ids to levels
    private readyToLeave : boolean;
    private locationPlayer : Vector;
    private navLineInfo : NavRoute;
    private levelSize : Vector;
    
    // Constructor.
    constructor( theEngine : Engine, thePlayer : Player )
    {
        this.ourEngine = theEngine;
        this.id = "";
        this.img = null;
        this.exits = [];
        this.readyToLeave = false;
        this.locationPlayer = createVector( 0, 0 );
    }
    
    // Common methods, makes sense.
    getName()
    {
        return this.id;
    }

    // places player can go

    // Using the camera info, draws the background at a certain place
    
    Render( context, renderX, renderY, renderWidth, renderHeight )
    {
        // Render the background image.
        context.drawImage(
            this.backgroundImage,
            renderX, renderY,
            renderWidth, renderHeight
        );
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

    Enter(player : Player, levelConfig : any)
    {
        // Store the pointer to the active player.
        this.ourPlayer = player;
        
        // Create general level information.
        this.navLineInfo = new NavRoute();
        this.locationPlayer = new Vector( 0, 0 );
        
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
            
            
        }
    }

    // Call to game engine
    
    

    // What ID are we leaving to?
    // Clean up stuff 
    Done()
    {
        // Clean up and then tell engine that we are ready to leave to which other level
        // It knows where we are and where the exits are / we're going to
        this.navLineInfo = null;
        this.locationPlayer = null;
        this.levelSize = null;
    }

    // Clicked somewhere in the level - check to see if something is there?
    Clicked(mx : number, my : number)
    {
        var pointToMoveTo = new Vector( mx, my );
        
        var closestPointToClick = this.navLineInfo.calculateNearestPoint( pointToMoveTo );
        
        // We want to move to the closest point we clicked to that corresponds to the navigation line.
        this.ourPlayer.moveTo( closestPointToClick );
    }
};



