// ItemList.ts - container of item prototypes that are executed for items.
// Purpose is to call logic for picking an item up.
// Should be part of the Engine (or so).

class ItemList
{
    private ourEngine : GameEngine;
    private gameItemCallbacks : any;
    
    constructor( theEngine : GameEngine )
    {
        this.ourEngine = theEngine;
        this.gameItemCallbacks = [];
    }
    
    // Called by game designers to register logic to an item that is reconized by it's ID.
    // Multiple callbacks can be registered for a single item, if necessary.
    RegisterItemCallback( itemID : any, callback : any )
    {
        if ( itemID == null || callback == null )
        {
            throw "invalid arguments passed to RegisterItemCallback";
        }
        
        this.gameItemCallbacks.push(
            { itemID : itemID, callback : callback }
        );
    }
    
    // Called when an item is picked up by the player.
    // Since game designers have registered (!) their callbacks into this container,
    // the appropriate logic for an item is called through here.
    TriggerItemAction( itemID : any, theItem : Item, thePlayer : Player )
    {
        for ( var n = 0; n < gameItemCallbacks.length; n++ )
        {
            var itemRegister = gameItemCallbacks[ n ];
            
            if ( itemRegister.itemID == itemID )
            {
                // Execute the registered action.
                itemRegister.callback(
                    theItem, thePlayer
                );
            }
        }
    }
};