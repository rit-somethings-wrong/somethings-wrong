// ItemList.ts - container of item prototypes that are executed for items.
// Purpose is to call logic for picking an item up.
// Should be part of the Engine (or so).

class ItemList
{
    private gameItemCallbacks : any;  //TODO refactor this into a map instead of a list
    
    constructor()
    {
        this.gameItemCallbacks = [];
    }
    
    // Called by game designers to register logic to an entity that is reconized by it's ID.
    // Multiple callbacks can be registered for a single item, if necessary.
    RegisterEntityCallback( itemID : string, callback : any )
    {
        if ( itemID == null || callback == null )
        {
            throw "invalid arguments passed to RegisterItemCallback";
        }
        
        this.gameItemCallbacks.push(
            { itemID : itemID, callback : callback }
        );
    }
    
    // Called when an entity is triggered by the player.
    // Since game designers have registered (!) their callbacks into this container,
    // the appropriate logic for an entity is called through here.
    TriggerEntityAction( entityId : string, theEntity : IItem, thePlayer : IPlayer, level: ILevel, engine: GameEngine )
    {
        console.log("TriggerEntityAction", entityId, theEntity, thePlayer, level, engine);
        for ( var n = 0; n < this.gameItemCallbacks.length; n++ )
        {
            var itemRegister = this.gameItemCallbacks[ n ];
            
            if ( itemRegister.itemID == entityId )
            {
                // Execute the registered action.
                itemRegister.callback(theEntity, thePlayer, level, engine);
            }
        }
    }
};