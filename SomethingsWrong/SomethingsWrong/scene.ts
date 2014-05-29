// Scene.ts - interface of any drawable logic surface so that drawing can be stack-able.
// Idea behind it:
// - scenes that can be drawn should register themselves into the engine
// - scene drawing needs to be prioritized by the engine
// - implement level popups as highest priority scene.
// - scene does not really care where its being drawn
// this interface should be implemented by GUI and the level drawing manager

interface Scene
{
    public Draw(
        drawContext : any,
        posX : number, posY : number,
        width : number, height : number
    );
};