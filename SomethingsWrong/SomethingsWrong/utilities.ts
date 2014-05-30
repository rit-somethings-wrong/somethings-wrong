


//Generates all IDs used in the game?
var _nextId = 0;
function NextId(): number {
    return _nextId++;
}

//Returns true if the given list contains the given object, else false
function contains(list, obj): boolean {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] == obj) {
            return true;
        }
    }
    return false;
}

// Removes any instances of a value from an array.
function ArrayDeleteValue(theArray, theValue) {
    var index;
    var actualArraySize = theArray.length;

    for (index = 0; index < actualArraySize; index++) {
        var curValue = theArray[index];

        if (curValue == theValue) {
            theArray.splice(index, 1);

            // Make sure we account for the shrunken array.
            index--;
            actualArraySize--;
        }
    }

    return theArray;
}

// Random integrity tests start here.
// Can be transformed into unit tests.
function intersectionTest() {
    var route = new NavRoute();

    route.addPoint(new Vector(0, 0));
    route.addPoint(new Vector(999, 999));

    var targetPos = route.calculateNearestPoint(new Vector(0, 400));

    var outputText = "nothing";

    if (targetPos != null) {
        outputText = targetPos.toString();
    }

    document.write("<div>" + outputText + "</div>");
}




