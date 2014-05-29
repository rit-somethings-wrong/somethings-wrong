// Functions that are shared across the project for utility purposes.

// 2D position information.
function createVector(x, y)
{
    var vector = {};
    
    vector.getX = function()
    {
        return x;
    }
    
    vector.getY = function()
    {
        return y;
    }
    
    vector.setX = function(xLoc)
    {
        x = xLoc;
    }

    vector.setY = function(yLoc)
    {
        y = yLoc;
    }
    
    vector.add = function(otherVec)
    {
        return createVector(
            x + otherVec.getX(),
            y + otherVec.getY()
        );
    }
    
    vector.subtract = function(otherVec)
    {
        return createVector(
            x - otherVec.getX(),
            y - otherVec.getY()
        );
    }
    
    vector.multiply = function(factor)
    {
        return createVector(
            x * factor,
            y * factor
        );
    }
    
    vector.length = function()
    {
        return Math.sqrt( x * x + y * y );
    }
    
    vector.normalize = function()
    {
        var vecLength = vector.length();
        
        x /= vecLength;
        y /= vecLength;
        
        return vecLength;
    }
    
    vector.normal = function()
    {
        return createVector(
            -y,
            x
        );
    }
    
    vector.toString = function()
    {
        return "x: " + x + ", y: " + y;
    }

    return vector;
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

function createNavigationRoute()
{
    var points = [];
    
    var navRoute = {};
    
    navRoute.addPoint = function(thePoint)
    {
        points.push( thePoint );
    }
    
    // Returns a table to the points that should NOT be modified!
    navRoute.getPoints = function()
    {
        return points;
    }
    
    var infinity = 9999999;
    
    navRoute.calculateNearestPoint = function(proxyPoint)
    {
        // If there are not atleast two points, this test will always return null
        if ( points.length < 2 )
        {
            return null;
        }
        
        // Check for every line in this navigation route and check for which this intersection test
        // returns the closest match.
        var index;
        
        var nearestCollisionPoint = null;
        var proxyDistance = null;
        
        for ( index = 0; index < points.length - 1; index++ )
        {
            // Construct a line between beginPoint and endPoint.
            // This one is the navigation line.
            var beginPoint = points[ index ];
            var endPoint = points[ index + 1 ];
            
            // Get the directional vector of the line and construct a vector normal.
            var navLineDir = beginPoint.subtract( endPoint );
            navLineDir.normalize();
            
            var vectorNormalNav = navLineDir.normal();
            
            // Construct the collision line for the nearest match.
            var collBeginPoint = proxyPoint.add(
                vectorNormalNav.multiply( -infinity )
            );
            var collEndPoint = proxyPoint.add(
                vectorNormalNav.multiply( infinity )
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
                var resultPoint = createVector(
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
    
    return navRoute;
}