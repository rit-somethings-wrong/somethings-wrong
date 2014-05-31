// Sample level based on our starting scenario idea.


console.log("test javascript thing");


var level_bedroom =
{
    name : "bedroom",
    rectSize : [ 320, 180 ],
    img : "./assets/scenes/bedroom.png",
    concurrentLine : [
        [ 0, 180 ],
        [150, 320],
        [50, 135],
        [120, 180],
    ],

    levelItems : [
        {
            itemID: "Laptop",
            name: "Laptop",
			radius: 15,
            x: 235,
            y: 110,
			// dialogue ID 61 initially.  when searching for possible destination: ID 67
        }
    ] 
	
};


/*display dialog when reaching/clicking on wash room
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
});*/


//TODO is the load count properly updated if an image fails to load?

RegisterImage("assets/chars/main.png");  //TODO this needs to be done elsewhere

RegisterImage("./TODO/keyImgUrl");
RegisterImage("./assets/scenes/bedroom.png");
RegisterImage("./assets/Quest/PC.png");
RegisterImage(level_bedroom.img);
RegisterLevel(level_bedroom);






