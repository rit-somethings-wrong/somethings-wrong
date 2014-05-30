


/*
interface IInteraction extends IUIHandler, IDrawable {

    SetDetails(player: IPlayer, level): void;

    //call the callback function to send results back to the level after the user does something
    RegisterResult(callback: any): void;

    Clicked(x: number, y: number): void;
    Enter(): void;
    Leave(): void;

    Draw(cxt: CanvasRenderingContext2D): void;

}
*/


//callback() tells Level results of the interaction, clearInteraction()  -> engine calls Leave()
//startInteraction(interaction) -> engine calls Enter()

