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

var level_airport =
{
    name : "airport",
    rectSize : [ 400, 180 ],
    img : "./assets/scenebg/inside-airport_scenev3.png",
    concurrentLine : [
        [ 0, 200 ],
        [400, 200],
        [300, 150],
        [100, 150],
        [ 0, 200 ]
    ],
    entryExits : [
        {
            entryX: 640,
            entryY: 400,
            entryRange: 25,
            exitId: "terminal",
            exitX: 100,
            exitY: 100
        },
        {
            entryX: 250,
            entryY: 300,
            entryRange: 10,
            exitId: "secret",
            exitX: 255,
            exitY: 127
        }
    ],

    //TODO split into a separate items registration and this turns into the id of the item and it's position
    levelItems : [
        {
            itemID: "airport-key-1",
            name: "The Key",
            imgName: "./assets/test2.png",
            itemWeight: 5,
            x: 0,
            y: 0,
        },
        {
            itemID: "airport-wc",
            name: "Men's WC",
            imgName: "./assets/test1.png",
            itemWeight: 4,
            x: 20,
            y: 20,
            //TODO add in image scaling
        }
    ]
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
RegisterImage(level_airport.img);
RegisterLevel(level_airport);






