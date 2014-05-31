// Sample level based on our starting scenario idea.


console.log("test javascript thing");

// levelconfig PARAM REQUIREMENTS:
// - has to be a JSON
// {
// concurrentLine : [ [ x, y ], [ x, y, ], [ x, y ], ... , [ x, y ] ], // navigation information
// name : "level_name", // id of the level
// rectSize : [ width, height ],
// img : any, // background image information
// levelItems : [
//      {
//          itemID : string,
//          name : string, // in-game display friendly name of the item
//          itemWeight : number, // weight number for Inventory logic
//          x : number,
//          y : number
//      },
//      { ... },
//      ...
// ]
// };
// TODO: ANYTHING else?
//

var level_bath =
{
    name : "bath",
    rectSize : [ 320, 180 ],
    img : "./assets/scenes/bath.png",
    concurrentLine : [
        [ 0, 180 ],
        [320, 180],
        [290, 140],
        [35, 140],
    ],
    entryExits : [
        {
            entryX: 65,
            entryY: 100,
            entryRange: 25,
            exitId: "bathdoor",
            exitX: 100,
            exitY: 100
        },
  
    ],


    levelItems : [
        {
            itemID: "Sink",
            name: "Sink",
            x: 130,
            y: 80,
			radius: 25,
			//triggers dialogue ID 54
        },
   
    ] */
};


//display dialog when reaching/clicking on wash room
EntityList.RegisterEntityCallback("airport-wc", function (entity, player, level, engine) {
    console.log("airport-wc callback");
    console.log("airport-wc callback 1");
    console.log("airport-wc callback 2");
    if (player.GetInventory().Has("airport-key-1")) {
        console.log("The wash room key doesn't fit!  Oh No!");
        return;
    }

    console.log("Setting an engine interaction", this);
    engine.NextInteraction(new Chat(3));
});

//TODO remove key after testing as it isn't in the story write-up
EntityList.RegisterEntityCallback("airport-key-1", function (entity, player, level, engine) {
    console.log("airport-key-1 callback");
    console.log("airport-key-1 callback 1", this);
    console.log("airport-key-1 callback 2");
    player.Pickup(entity.id, level.GetInventory());
});


//TODO is the load count properly updated if an image fails to load?

RegisterImage("assets/testchar.png");  //TODO this needs to be done elsewhere

RegisterImage("./TODO/keyImgUrl");
RegisterImage("./assets/test1.png");
RegisterImage("./assets/test2.png");
RegisterImage(level_bath.img);
RegisterLevel(level_bath);






