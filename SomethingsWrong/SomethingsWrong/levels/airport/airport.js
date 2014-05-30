// Sample level based on our starting scenario idea.


// levelconfig PARAM REQUIREMENTS:
// - has to be a JSON
// {
// concurrentLine : [ [ x, y ], [ x, y, ], [ x, y ], ... , [ x, y ] ], // navigation information
// name : "level_name", // id of the level
// rectSize : [ width, height ],
// img : any, // background image information
// levelItems : [
//      {
//          itemID : any, // not sure which type we need
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
    rectSize : [ 640, 480 ],
    img : "./levels/airport/inside-airport_scene.png",
    concurrentLine : [
        [ 0, 200 ],
        [ 200, 200 ],
        [ 200, 400 ],
        [ 640, 400 ]
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
            itemID: 1,
            name: "The Key",
            itemWeight: 10,
            x: 20,
            y: 10
        }
    ]
};

RegisterImage( level_airport.img );

console.log("airport.js");
RegisterLevel(level_airport);






