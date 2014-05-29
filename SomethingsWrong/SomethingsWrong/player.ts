<<<<<<< HEAD
class Player 
{
	private name: string;
	private WALKING : boolean; // Whether or not we are walking at the moment
	private FACE_LEFT : boolean;
	private ANIMATION_NUM : number;
	private width: number;
	private height: number;
	constructor(_name : string)
	{
		this.WALKING = false;
		this.FACE_LEFT = false;
		console.log("Player created, name: " + _name);
	}
	
	// Draws the character according to his current
	// animation style and frame number
	Draw()
	{
		if(this.WALKING == true)
		{
			if(this.FACE_LEFT)
			{
				switch(this.ANIMATION_NUM)
				{
					case 0: break;
					case 1: break;
					case 2: break;
					case 3: break;
				}
			}
			else 
			{
				switch(this.ANIMATION_NUM)
				{
					switch(this.ANIMATION_NUM)
					{
						case 0: break;
						case 1: break;
						case 2: break;
						case 3: break;
					}
				}
			}
		} // end if idling
		else if(this.WALKING == false)
		{
			if(this.FACE_LEFT)
			{
				switch(this.ANIMATION_NUM)
				{
					case 0: break;
					case 1: break;
					case 2: break;
					case 3: break;
				}
			}
			else
			{
				switch(this.ANIMATION_NUM)
				{
					case 0: break;
					case 1: break;
					case 2: break;
					case 3: break;
				}
			}
		} // end if we're walking
	}
	
	
}
=======
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
>>>>>>> ab1e955012f29790ef9b652decb6e5a3ca8a8ae4
