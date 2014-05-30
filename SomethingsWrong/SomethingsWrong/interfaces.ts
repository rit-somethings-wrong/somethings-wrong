/// <reference path="engine.ts" />
/// <reference path="utilities.ts" />
/// <reference path="collision.ts" />




interface Scene {
    //TODO do we need this?
}

//Ingame location data
//interface Vector {
//TODO extract info from the vector file
//}

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
    Leave(): void;
}

interface ILevelConfig {
    name: string;
    rectSize: number[];
    img: string;

    //TODO type info
    concurrentLine: any[];
    entryExits: any[];
    levelItems: any[]; //TODO spit this off
}

//Things in the game
interface IEntity extends IDrawable {
    location?: Vector;
    name: string;
    id: number;

    Place(location: Vector): void;
}

//Represents the human user's avatar
interface IPlayer extends IEntity {
    inventory: IInventory;

    imageWidth: number;
    imageHeight: number;
}

//Things that can be put into an IInventory
interface IStorable extends IEntity {
    weight: number;

    Pickup(): void;
}

//A collection of IStorables
interface IInventory {
    GetAllItems(): IStorable[];
    Has(item: IStorable): boolean;
    AddItem(item: IStorable): boolean;
    RemoveItem(item: IStorable): boolean;
}



interface IInteraction extends IUIHandler, IDrawable {

    //call the callback function to send results back to the level after the user does something
    RegisterResult(callback: any): void;

    Enter(player: IPlayer, engine: GameEngine, level: ILevel): void;
    Leave(): void;
}
