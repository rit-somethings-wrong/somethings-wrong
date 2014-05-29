class Player
{
	var name :String;
	var inventory : {};

	//-- movement states
	var animationType : enum
	{
		IDLE, 
		WALKLEFT, 
		WALKRIGHT,
	}
	
	var animationFrame:number = 0;
	
	// Draws player at specified screen location.
	function Draw(screenlocation)
	{
		// draw at the screen location whichever animation frame we need or whatever
		if(this.animationType == 0)
		{
			// Draw the idling animation in the appropriate direction
		}
		else if(this.animationType == 1)
		{
		}
		else if(this.animationType == 2)
		{
		}
	}
/// <reference path="inventory.ts" />

interface IPlayer {
    name: string;
    inventory: IInventory;
    Draw(x: number, y: number): void;
}

//-- movement states
enum AnimationType {
    IDLE,
    WALKLEFT,
    WALKRIGHT
};

class Player implements IPlayer {
    private _name: string;
    private _inventory: IInventory;

    private animaionFrame: number = 0;
    private animationType: AnimationType = AnimationType.IDLE;

    constructor(name: string) {
        this._name = name;
        this._inventory = new Inventory();
    }

    //Gets the name of this player
    get name(): string {
        return this._name;
    }

    //Gets the inventory of this player
    get inventory(): IInventory {
        return this._inventory;
    }

    //Draws this player at the given screen location
    Draw(x: number, y: number): void {
        if (this.animationType === AnimationType.IDLE) {
            //Draw the idling animation in the appropriate direction
        } else if (this.animationType === AnimationType.WALKLEFT) {
            //TODO
        } else if (this.animationType === AnimationType.WALKRIGHT) {
            //TODO
        } else {
            //TODO handle error
        }

    }
}
