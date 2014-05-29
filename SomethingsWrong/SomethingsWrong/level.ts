// Level - just data

// Constructor


var id; 
var img;  // JS image file (background)
var exits[] // list of ids to levels
var readyToLeave = false;
var locationPlayer = createVector( 0, 0 );
var navLineInfo = null;
var levelSize = null;

// places player can go

// Using the camera info, draws the background at a certain place


function Enter(player, engine)
{
}

// Call to game engine

// What ID are we leaving to?

function Load()
{
    navLineInfo = createNavigationRoute();
    locationPlayer = createVector( 0, 0 );
    levelSize = createVector( 100, 100 );
    
    // Set up a basic navmesh.
    navLineInfo.addPoint( createVector( 0, 50 ) );
    navLineInfo.addPoint( createVector( leveSize.getX(), 50 ) );
}

// Clean up stuff 
function Done()
{
	// Clean up and then tell engine that we are ready to leave to which other level
	// It knows where we are and where the exits are / we're going to
    navLineInfo = null;
    locationPlayer = null;
    levelSize = null;
}

// Clicked somewhere in the level - check to see if something is there?
function Clicked(mx, my)
{
    var pointToMoveTo = createVector( mx, my );
    
    var closestPointToClick = navLineInfo.calculateNearestPoint( pointToMoveTo );
    
    // We want to move to the closest point we clicked to that corresponds to the navigation line.
    
}





