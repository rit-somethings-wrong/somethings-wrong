/// <reference path="item.ts" />




//Manages a weight limited collection of IItems
class Inventory implements IInventory {
    private static MaxWeight: number = 100;
    private weight: number = 0;  //current weight of the items in our store
    private items: IEntity[] = [];  //list of items in our store

    //Gets all the items stores in this inventory.  If empty, an empty array is returned.
    GetAllItems(): IEntity[] {
        return this.items;
    }

    //Returns true if the given item is being stored in this inventory, else returns false.
    Has(id: string): boolean {
        return this.GetItem(id) !== null;
    }

    //Adds the given item to this inventory is there's enough free space (weight) for it.  Returns true if it was added, else false.
    AddItem(item: IEntity): boolean {
        if (item.weight === null) {
            return false;
        } else if (item.weight + this.weight > Inventory.MaxWeight) {
            return false;
        }

        this.items.push(item);
        this.weight += item.weight;
        console.log("Added item to inventory: ", item.id);
        return true;
    }

    //Removes all instances of the given item from this inventory.  Returns true if anything was removed, else returns false.
    RemoveItem(id: string): boolean {
        var len = this.items.length;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id) {
                this.weight -= this.items[i].weight;
                this.items.slice(i, 1);  //TODO does the length/index need updated?
            }
        }

        return len < this.items.length;
    }

    GetItem(id: string): IEntity {
        for (var i = 0; i < this.items.length; ++i) {
            if (this.items[i].id === id) {
                return this.items[i];
            }
        }

        return null;
    }
}