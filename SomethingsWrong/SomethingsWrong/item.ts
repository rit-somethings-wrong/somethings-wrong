

interface IItem {
    name: string;
    id: number;
    weight: number;
}

//Represents a generic item in the game
class Item implements IItem {
    private _name: string;
    private _id: number;
    private _weight: number;

    constructor(id: number, name: string, weight: number) {
        this._id = id;
        this._name = name;
        this._weight = weight;
    }

    get name(): string {
        return this._name;
    }

    get id(): number {
        return this._id;
    }

    get weight(): number {
        return this._weight;
    }

}