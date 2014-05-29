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
    private locationPlayer : any;
    private navLineInfo : any;
    private levelSize : any;
    
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
        return id;
    }

    // places player can go

    // Using the camera info, draws the background at a certain place
    
    Render( context, renderX, renderY, renderWidth, renderHeight )
    {
        // Render the background image.
        context.drawImage(
            backgroundImage,
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
        this.navLineInfo = createNavigationRoute();
        this.locationPlayer = createVector( 0, 0 );
        
        this.backgroundImage = levelConfig.img;
        
        if ( false )
        {
            // Example level details.
            this.id = "test_level";
            this.levelSize = createVector(600, 350);
            
            // Set up a basic navmesh.
            this.navLineInfo.addPoint( createVector( 0, 50 ) );
            this.navLineInfo.addPoint( createVector( levelSize.getX(), 50 ) );
        }
        else
        {
            // Load level meta data.
            this.id = levelConfig.name;
            this.levelSize = createVector(
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
                    var pointClass = createVector(
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
    Clicked(mx, my)
    {
        var pointToMoveTo = createVector( mx, my );
        
        var closestPointToClick = navLineInfo.calculateNearestPoint( pointToMoveTo );
        
        // We want to move to the closest point we clicked to that corresponds to the navigation line.
        ourPlayer.moveTo( closestPointToClick );
    }
};



