/// <reference path="inventory.ts" />

interface IPlayer extends IEntity {
    inventory: IInventory;
}

//-- movement states
enum AnimationType {
    IDLE,
    WALKLEFT,
    WALKRIGHT
};



class Player extends Entity implements IPlayer {
    private _inventory: IInventory;

    private animaionFrame: number = 0;
	private animationCounter: number = 0;
	private animationCounterMax: number = 10; // so that animation doesn't move too fast
	
    private animationType: AnimationType = AnimationType.IDLE;
	
	private spriteWidth : number = 23; // for testchar
	private spriteHeight : number = 44; // for testchar 
	
	private spriteImg : Image;

    constructor(id: number, name: string, imgUrl : string) {
        super(id, name);
		this.spriteImg = new Image(); 
		this.spriteImg.src = imgUrl;
        this._inventory = new Inventory();
    }

    //Gets the inventory of this player
    get inventory(): IInventory {
        return this._inventory;
    }

    //Draws this player at the given screen location
    Draw(location: Vector): void {
        if (this.animationType === AnimationType.IDLE) {
            //TODO draw the idling animation in the appropriate direction
			
			
        } else if (this.animationType === AnimationType.WALKLEFT) {
            //TODO
        } else if (this.animationType === AnimationType.WALKRIGHT) {
            //TODO
        } else {
            //TODO handle error
        }
		
		/* Increment animationCounter, which will trigger a change of animationFrame upon reaching animationCounterMax */
		animationCounter++;
		if(this.animationCounter > this.animationCounterMax){ 
			// Increment animation frame and reset counter
			this.animationFrame++; if(this.animationFrame >= 3){ this.animationFrame = 0; } // assumes everything has 4 frames of animation
			this.animationCounter = 0; 
		}
		
    }
}
