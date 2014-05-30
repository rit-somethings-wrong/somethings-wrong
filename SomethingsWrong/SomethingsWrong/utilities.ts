﻿


//Generates all IDs used in the game?
var _nextId = 0;
function NextId(): number {
    return _nextId++;
}

var LevelMap: { [id: string]: ILevel } = { };  // levelName -> levelObj

function RegisterLevel(levelConfig: ILevelConfig) {
    var level = new Level(levelConfig);
    LevelMap[level.GetName()] = level;

    console.log("Finished loading level:", level.GetName(), level);
}


//Gets the given image and calls onload with the loaded image
function GetImage(name: string, onload: (image: HTMLImageElement) => void): void {
    var image = new Image();
    image.onload = () => {
        onload(image);
    };
    image.src = name;
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


