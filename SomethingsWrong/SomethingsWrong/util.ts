// Functions that are shared across the project for utility purposes.

// 2D position information.
class Vector
{
    private x : number;
    private y : number;
    
    constructor( theX : number, theY : number )
    {
        this.x = theX;
        this.y = theY;
    }
    
    getX()
    {
        return this.x;
    }
    
    getY()
    {
        return this.y;
    }
    
    setX(xLoc : number)
    {
        this.x = xLoc;
    }

    setY(yLoc : number)
    {
        this.y = yLoc;
    }
    
    add(otherVec : Vector)
    {
        return new Vector(
            this.x + otherVec.getX(),
            this.y + otherVec.getY()
        );
    }
    
    subtract(otherVec : Vector)
    {
        return new Vector(
            this.x - otherVec.getX(),
            this.y - otherVec.getY()
        );
    }
    
    multiply(factor : number)
    {
        return new Vector(
            this.x * factor,
            this.y * factor
        );
    }
    
    length()
    {
        return Math.sqrt( this.x * this.x + this.y * this.y );
    }
    
    normalize()
    {
        var vecLength = this.length();
        
        this.x /= vecLength;
        this.y /= vecLength;
        
        return vecLength;
    }
    
    normal()
    {
        return new Vector(
            -this.y,
            this.x
        );
    }
    
    toString()
    {
        return "x: " + this.x + ", y: " + this.y;
    }
};

// Thanks to http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

function distPoints(point1, point2)
{
    return ( point1.subtract( point2 ) ).length();
}

class NavRoute
{
    private infinity : number;
    private points : any;
        
    constructor()
    {
        this.points = [];
        this.infinity = 999999;
    }
    
    addPoint(thePoint : Vector)
    {
        this.points.push( thePoint );
    }
    
    // Returns a table to the points that should NOT be modified!
    getPoints()
    {
        return this.points;
    }
    
    calculateNearestPoint(proxyPoint : Vector)
    {
        // If there are not atleast two points, this test will always return null
        if ( this.points.length < 2 )
        {
            return null;
        }
        
        // Check for every line in this navigation route and check for which this intersection test
        // returns the closest match.
        var nearestCollisionPoint = null;
        var proxyDistance = null;
        
        for ( var index = 0; index < this.points.length - 1; index++ )
        {
            // Construct a line between beginPoint and endPoint.
            // This one is the navigation line.
            var beginPoint = this.points[ index ];
            var endPoint = this.points[ index + 1 ];
            
            // Get the directional vector of the line and construct a vector normal.
            var navLineDir = beginPoint.subtract( endPoint );
            navLineDir.normalize();
            
            var vectorNormalNav = navLineDir.normal();
            
            // Construct the collision line for the nearest match.
            var collBeginPoint = proxyPoint.add(
                vectorNormalNav.multiply( -Infinity )
            );
            var collEndPoint = proxyPoint.add(
                vectorNormalNav.multiply( Infinity )
            );
            
            // Get a collision result.
            var collResult = checkLineIntersection(
                // line nav
                beginPoint.getX(), beginPoint.getY(),
                endPoint.getX(), endPoint.getY(),
                // line test
                collBeginPoint.getX(), collBeginPoint.getY(),
                collEndPoint.getX(), collEndPoint.getY()
            );
            
            if ( collResult != null && collResult.x != null && collResult.y != null )
            {
                var resultPoint = new Vector(
                    collResult.x,
                    collResult.y
                );
                
                var distResult = distPoints( resultPoint, proxyPoint );
                
                if ( nearestCollisionPoint == null || distResult < proxyDistance )
                {
                    nearestCollisionPoint = resultPoint;
                    proxyDistance = distResult;
                }
            }
        }
        
        return nearestCollisionPoint;
    }
};

class BoundingSphere
{
    private position : Vector;
    private radius : number;
    
    constructor( position : Vector, radius : number )
    {
        this.position = position;
        this.radius = radius;
    }
    
    getPosition() : Vector
    {
        return this.position;
    }
    
    getRadius() : number
    {
        return this.radius;
    }
    
    intersectWithPoint( thePoint : Vector ) : boolean
    {
        return ( thePoint.subtract( this.position ).length() < this.radius );
    }
};

class BoundingRectangle
{
    private position : Vector;
    private width : number;
    private height : number;
    
    constructor( position : Vector, width : number, height : number )
    {
        this.position = position;
        this.width = width;
        this.height = height;
    }
    
    getPosition() : Vector
    {
        return this.position;
    }
    
    getWidth() : number
    {
        return this.width;
    }
    
    getHeight() : number
    {
        return this.height;
    }
    
    intersectWithPoint( thePoint : Vector ) : boolean
    {
        return
            (
                this.position.getX() <= thePoint.getX() && this.position.getX() + this.width > thePoint.getX() &&
                this.position.getY() <= thePoint.getY() && this.position.getY() + this.height > thePoint.getY()
            );
    }
    
    getLocalCoordinates( thePoint : Vector ) : Vector
    {
        // If the point is not inside our bounding rectangle.
        if ( this.intersectWithPoint( thePoint ) == false )
        {
            return null;
        }
        
        return thePoint.subtract( this.position );
    }
};

// Removes any instances of a value from an array.
function ArrayDeleteValue(theArray, theValue)
{
    var index;
    var actualArraySize = theArray.length;
    
    for ( index = 0; index < actualArraySize; index++ )
    {
        var curValue = theArray[ index ];
        
        if ( curValue == theValue )
        {
            theArray.splice( index, 1 );
            
            // Make sure we account for the shrunken array.
            index--;
            actualArraySize--;
        }
    }
    
    return theArray;
}

// Random integrity tests start here.
// Can be transformed into unit tests.
function intersectionTest()
{
    var route = new NavRoute();

    route.addPoint( new Vector( 0, 0 ) );
    route.addPoint( new Vector( 999, 999 ) );

    var targetPos = route.calculateNearestPoint( new Vector( 0, 400 ) );

    var outputText = "nothing";

    if ( targetPos != null )
    {
        outputText = targetPos.toString();
    }
    
    document.write( "<div>" + outputText + "</div>" );
}