// Functions and classes related to collision and points

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

    convertToSpace(clientDimensions: Vector, targetDimensions: Vector) {
        // Create the local scale coordinates.
        var clientScaleX = this.getX() / clientDimensions.getX();
        var clientScaleY = this.getY() / clientDimensions.getY();

        // Set the new coordinates to be scaled across the target dimensions.
        this.setX(clientScaleX * targetDimensions.getX());
        this.setY(clientScaleY * targetDimensions.getY());
    }
    
    toString()
    {
        return "x: " + this.x + ", y: " + this.y;
    }

    clone(): Vector {
        return new Vector(this.getX(), this.getY());
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

// Connected lines of 2D points that are used for navigation.
class NavRoute
{
    private infinity : number;
    private points : Vector[];
        
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
        // If there are not at least two points, this test will always return null
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
            var navLineDir = endPoint.subtract( beginPoint );
            //navLineDir.normalize();
            
            var vectorNormalNav = navLineDir.normal();
            vectorNormalNav.normalize();
            
            // Construct the collision line for the nearest match.
            var collBeginPoint = proxyPoint.add(
                vectorNormalNav.multiply( -this.infinity )
            );
            var collEndPoint = proxyPoint.add(
                vectorNormalNav.multiply( this.infinity )
            );
            
            // Get a collision result.
            var collResult = checkLineIntersection(
                // line nav (line 1)
                beginPoint.getX(), beginPoint.getY(),
                endPoint.getX(), endPoint.getY(),
                // line test (line 2)
                collBeginPoint.getX(), collBeginPoint.getY(),
                collEndPoint.getX(), collEndPoint.getY()
            );
            
            if (collResult != null && collResult.x != null && collResult.y != null &&
                !isNaN(collResult.x) && !isNaN(collResult.y) && collResult.onLine1 == true)
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
        if (!thePoint) {
            return false;
        }
        return ( thePoint.subtract( this.position ).length() < this.radius );
    }
};

class BoundingRectangle
{
    private position : Vector;
    private size: Vector;
    
    constructor( position : Vector, width : number, height : number )
    {
        this.position = position;
        this.size = new Vector(width, height);
    }

    get left(): number {
        return this.getPosition().getX();
    }

    get top(): number {
        return this.getPosition().getY();
    }

    get right(): number {
        return this.left + this.getWidth();
    }

    get bottom(): number {
        return this.top + this.getHeight();
    }
    
    getPosition() : Vector
    {
        return this.position;
    }
    
    getWidth() : number
    {
        return this.size.getX();
    }
    
    getHeight() : number
    {
        return this.size.getY();
    }
    
    intersectWithPoint( thePoint : Vector ) : boolean
    {
        if (thePoint == null) {
            return false;
        }
        if (
            this.left <= thePoint.getX() && this.right > thePoint.getX() &&
            this.top <= thePoint.getY() && this.bottom > thePoint.getY()
            ) {
            return true;
        }

        return false;
    }
    
    getLocalCoordinates( thePoint : Vector ) : Vector
    {
        // If the point is not inside our bounding rectangle.
        if ( this.intersectWithPoint( thePoint ) == false )
        {
            return null;
        }
        
        return thePoint.subtract( this.getPosition() );
    }

    convertToSpace(clientDimensions: Vector, targetDimensions: Vector): void {
        // Transform to different spaces.
        this.position.convertToSpace(clientDimensions, targetDimensions);
        this.size.convertToSpace(clientDimensions, targetDimensions);
    }
};
