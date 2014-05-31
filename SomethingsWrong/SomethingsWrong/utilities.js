/// <reference path="level.ts" />
/// <reference path="interfaces.ts" />
//Generates all IDs used in the game?
var _nextId = 0;
function NextId() {
    return String(_nextId++);
}

var LevelMap = {};

function RegisterLevel(levelConfig) {
    var level = new Level(levelConfig);
    LevelMap[level.GetName()] = level;

    console.log("Finished loading level:", level.GetName(), level);
}

//Returns true if the given list contains the given object, else false
function contains(list, obj) {
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

var loadingCount = 0;

var ImageMap = {};
function RegisterImage(imageFile, onloadFn) {
    loadingCount++;

    console.log("starting loading image " + imageFile);
    var image = new Image();
    image.onload = function () {
        ImageMap[imageFile] = image;

        loadingCount--;

        console.log("finished loading image " + imageFile);
        if (onloadFn) {
            onloadFn(image);
        }
    };

    //image.onabort = () => {
    //    loadingCount--;
    //    console.log("failed loading image (1) " + imageFile);
    //};
    image.onerror = function () {
        loadingCount--;
        console.log("failed loading image (2) " + imageFile);
    };

    //image.onended = () => {
    //    loadingCount--;
    //    console.log("failed loading image (3) " + imageFile);
    //};
    image.src = imageFile;
}

//Gets the given image
function GetImage(name) {
    return ImageMap[name] || null;
}

// Returns a continuos time reference value in seconds.
function GetCurrentTimeSeconds() {
    return new Date().getTime() / 1000;
}

//Gets a dialog message.  May return null if there is no message with the given id.
var Dialog = [];
function GetMessage(id) {
    return Dialog[id] || null;
}

var EntityList = new ItemList();
//# sourceMappingURL=utilities.js.map
