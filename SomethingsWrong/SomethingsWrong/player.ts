/// <reference path="inventory.ts" />

//-- movement states
enum AnimationType {
    IDLE,
    WALKLEFT,
    WALKRIGHT
};



class Player extends Entity implements IPlayer {
    private _inventory: IInventory;

    private animationFrame: number = 0;
    private animationCounter: number = 0;
    private animationCounterMax: number = 10; // so that animation doesn't move too fast
    
    private animationType: AnimationType = AnimationType.IDLE;
    
    private spriteWidth : number = 32; // for testchar
    private spriteHeight : number = 44; // for testchar 
    
    private imgWidth : number;
    private imgHeight : number; // these should scale off of the canvas/scene (actual drawing size in pixels)
    
    private spriteImg : HTMLImageElement;

    constructor(id: string, name: string, imgUrl : string) {
        super(id, name, imgUrl);

        this.spriteImg = GetImage(imgUrl);
        
        this.imgWidth = this.spriteWidth * 3; // for testing
        this.imgHeight = this.spriteHeight * 3; // for testing
        
        this._inventory = new Inventory();
    }

    //Gets the inventory of this player
    GetInventory(): IInventory {
        return this._inventory;
    }

    Pickup(id: string, fromInv: IInventory): boolean {
        if (fromInv === null || id === null) {
            return false;
        } else if (!fromInv.Has(id)) {
            return false;
        }

        //attempt to add the item to the player
        var entity = fromInv.GetItem(id);
        var added: boolean = this._inventory.AddItem(entity);
        if (!added) {
            return false;
        }

        //don't forget the other store no longer has the item
        fromInv.RemoveItem(id);
        return true;
    }

    set imageWidth(newWidth: number) {
        this.imgWidth = newWidth;
    }

    set imageHeight(newHeight: number) {
        this.imgHeight = newHeight;
    }

    get imageWidth(): number {
        return this.imgWidth;
    }

    get imageHeight(): number {
        return this.imgHeight;
    }
    
    
    //Draws this player at the given screen location
    Draw(context: CanvasRenderingContext2D, location?: Vector): void {
        console.log(this.spriteImg, this, "sprintImg");
        if (this.animationType === AnimationType.IDLE) {
        
            //Draw the idling animation in the appropriate direction http://www.w3schools.com/tags/canvas_drawimage.asp
            
            context.drawImage(this.spriteImg, 
            0 + (this.animationFrame * this.spriteWidth), /* width to start clipping for current idling frame */
            0 , /* height to start clipping for idle */
            this.spriteWidth,
            this.spriteHeight,
            location.getX() - (.5 * this.imgWidth),
            location.getY() - (.8 * this.imgHeight),
            this.imgWidth, /* stretch or reduce */
            this.imgHeight /* stretch or reduce */
            );
            
        } else if (this.animationType === AnimationType.WALKLEFT) {
            context.drawImage(this.spriteImg, 
            0 + (this.animationFrame * this.spriteWidth), /* width to start clipping for current idling frame */
            0 + (this.spriteWidth *1) , /* height to start clipping for walkleft */
            this.spriteWidth,
            this.spriteHeight,
            location.getX() - (.5 * this.imgWidth),
            location.getY() - (.8 * this.imgHeight),
            this.imgWidth, /* stretch or reduce */
            this.imgHeight /* stretch or reduce */
            );
        } else if (this.animationType === AnimationType.WALKRIGHT) {
        
            context.drawImage(this.spriteImg, 
            0 + (this.animationFrame * this.spriteWidth), /* width to start clipping for current idling frame */
            0 + (this.spriteWidth *2) , /* height to start clipping for walkleft */
            this.spriteWidth,
            this.spriteHeight,
            location.getX() - (.5 * this.imgWidth),
            location.getY() - (.8 * this.imgHeight),
            this.imgWidth, /* stretch or reduce */
            this.imgHeight /* stretch or reduce */
            );
        
        
            //TODO
        } else {
            //TODO handle error
            console.log("Error with character animation states");
        }
        
        /* Increment animationCounter, which will trigger a change of animationFrame upon reaching animationCounterMax */
        this.animationCounter++;
        if(this.animationCounter > this.animationCounterMax){
            // Increment animation frame and reset counter
            this.animationFrame++; if(this.animationFrame >= 3){ this.animationFrame = 0; } // assumes everything has 4 frames of animation
            this.animationCounter = 0;
        }
    }
}
