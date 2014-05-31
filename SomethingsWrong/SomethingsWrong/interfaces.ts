/// <reference path="engine.ts" />
/// <reference path="utilities.ts" />
/// <reference path="collision.ts" />




interface Scene {
    //TODO do we need this?
}


//Things that can be drawn on the canvas
interface IDrawable {
    Draw(cxt: CanvasRenderingContext2D, location?: Vector): void;
}

//Things that accept mouse clicks/presses and typed characters
interface IUIHandler {
    //returns true if they consume the ui event

    Clicked(x: number, y: number): boolean;
    Typed(char: string): boolean;
}

//
interface ILevel extends IUIHandler, IDrawable {
    Enter(player: IPlayer, engine: GameEngine): void;
    Update(): void;  //called every game step except when entering or leaving the level
    Leave(): void;
    GetInventory(): IInventory;
}

interface ILevelConfig {
    name: string;
    rectSize: number[];
    img: string;

    //TODO type info
    concurrentLine: any[];
    entryExits: any[];
    levelItems: IItem[]; //TODO spit this off?
}

//Things in the game and may be put into an inventory
interface IEntity extends IDrawable {
    location?: Vector;
    name: string;
    id: string;
    weight?: number;

    Place(location: Vector): void;
}

//Represents the human user's avatar
interface IPlayer extends IEntity {
    GetInventory(): IInventory;
    Pickup(entityId: string, from: IInventory): boolean;

    imageWidth: number;
    imageHeight: number;
}


//A collection of entities
interface IInventory {
    GetAllItems(): IEntity[];
    Has(id: string): boolean;
    AddItem(id: IEntity): boolean;
    RemoveItem(id: string): boolean;
    GetItem(id: string): IEntity;
}



interface IInteraction extends IUIHandler, IDrawable {
    Enter(player: IPlayer, engine: GameEngine, level: ILevel): void;
    Update(): void;  //called every game step except when entering or leaving the interaction
    Leave(): void;
}

interface IDialogMsg {
    id: number;
    dialog: string;
    connection: number;
    type: any;  //TODO this is an enum
}

interface IEntityTask {
    update( theEntity : Entity ): void;
    isFinished(): boolean;
    dispose(): void;
};

interface IItem {
    itemID: string;
    name: string;
    imgName?: string;
    itemWeight?: number;  //Note: things without a weight cannot be picked up  //TODO code this limitation
    x: number;
    y: number;
}
