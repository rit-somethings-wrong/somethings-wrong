


//Generates all IDs used in the game
var _nextId = 0;
function NextId(): number {
    return _nextId++;
}



//Returns true if the given list contains the given object, else false
function contains(list, obj): boolean {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] == obj) {
            return true;
        }
    }
    return false;
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

    clicked(x: number, y: number): boolean;
    typed(char: string): boolean;
}

//
interface ILevel extends IUIHandler, IDrawable {
    Enter(player: IPlayer, engine: GameEngine): void;
    Leave(): void;
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

    SetDetails(player: IPlayer, level): void;

    //call the callback function to send results back to the level after the user does something
    RegisterResult(callback: any): void;

    Enter(player: IPlayer, engine: GameEngine, level: ILevel): void;
    Leave(): void;
}














