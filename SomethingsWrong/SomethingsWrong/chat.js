//Displays sequences of dialog messages
var Chat = (function () {
    //----- IInteraction methods -----//
    function Chat(msgId) {
        this.msg = GetMessage(msgId);
    }
    //-----  -----//
    //Switches to the next message.  If no next message, then tells the engine to stop displaying this interaction
    Chat.prototype.nextMsg = function () {
        if (this.msg === null || this.msg.connection === null) {
            this.engine.ClearInteraction();
            return;
        }

        this.msg = GetMessage(this.msg.connection);
    };

    Chat.prototype.Enter = function (player, engine, level) {
        this.engine = engine;
    };

    Chat.prototype.Update = function () {
    };

    Chat.prototype.Leave = function () {
        this.engine = null;
    };

    //----- IUIHandler methods -----//
    Chat.prototype.Clicked = function (x, y) {
        this.nextMsg();
        return true;
    };

    Chat.prototype.Typed = function (char) {
        this.nextMsg();
        return true;
    };

    //----- IDrawable methods -----//
    Chat.prototype.Draw = function (ctx, location) {
        if (!location) {
            location = new Vector(0, 0);
        }

        //TODO draw partially transparent background to enhance text contrast?
        //TODO adjust location and display based on type of message (thinking, other person, yelling, etc...)?
        //draw main message text
        ctx.fillStyle = '#005259';
        ctx.fillRect(0, 0, 10, 10);
        ctx.font = "20pt Arial";
        ctx.fillStyle = '#990000';

        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, location.getX(), location.getY());
        };
        img.src = "assets/GUI/text.GIF";

        //ctx.fillText(this.msg.dialog, location.getX(), location.getY());
        ctx.fillText("Yay, some stubbed chat text!", location.getX() + 10, location.getY() + 10);
    };
    return Chat;
})();
//# sourceMappingURL=chat.js.map
