/// <reference path="collision.ts" />
/// <reference path="utilities.ts" />
/// <reference path="collision.ts" />
/// <reference path="engine.ts" />
// gui_interface.ts - classes for drawing and managing the GUI layer of our game.
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// Register dependent images.
RegisterImage(IMAGES.inventoryImg);

var GUIPanel = (function () {
    function GUIPanel(theEngine) {
        this.ourEngine = theEngine;
        this.children = [];
        this.imageWidth = null;
        this.imageHeight = null;
    }
    GUIPanel.prototype.SetPosition = function (thePos) {
        this.position = thePos;
    };

    GUIPanel.prototype.GetPosition = function () {
        return this.position;
    };

    GUIPanel.prototype.GetWidth = function () {
        return this.width;
    };

    GUIPanel.prototype.GetHeight = function () {
        return this.height;
    };

    GUIPanel.prototype.SetBackgroundImageName = function (imgName) {
        this.bgImageName = imgName;
    };

    GUIPanel.prototype.GetBackgroundImage = function () {
        return GetImage(this.bgImageName);
    };

    GUIPanel.prototype.GetBackgroundDimensions = function () {
        var bgImg = this.GetBackgroundImage();

        if (bgImg != null) {
            return new Vector(bgImg.width, bgImg.height);
        }

        return null;
    };

    GUIPanel.prototype.TransformMouseToImageCoordinates = function (mx, my) {
        // Get 0..1 scalars based on GUI panel plane.
        mx /= this.GetWidth();
        my /= this.GetHeight();

        var backgroundDimm = this.GetBackgroundDimensions();

        if (backgroundDimm != null) {
            // Return a vector that is in the image space.
            return new Vector(mx * backgroundDimm.getX(), my * backgroundDimm.getY());
        }

        return new Vector(mx, my);
    };

    GUIPanel.prototype.Enter = function () {
    };

    GUIPanel.prototype.Draw = function (context) {
        // If we have a background image, draw it.
        var backgroundImage = this.GetBackgroundImage();

        if (backgroundImage != null) {
            context.drawImage(backgroundImage, this.GetPosition().getX(), this.GetPosition().getY(), this.GetWidth(), this.GetHeight());
        }
    };

    GUIPanel.prototype.Leave = function () {
    };

    GUIPanel.prototype.Update = function () {
    };

    // GUIPanel can receive clicking events.
    GUIPanel.prototype.Clicked = function (mx, my) {
        // this method is meant to be overridden.
        // by default, GUIPanels accepts clicks.
        return true;
    };

    GUIPanel.prototype.Typed = function (charString) {
        return false;
    };
    return GUIPanel;
})();
;

var GUIInventoryScreen = (function (_super) {
    __extends(GUIInventoryScreen, _super);
    function GUIInventoryScreen(theEngine) {
        _super.call(this, theEngine);

        this.SetBackgroundImageName(IMAGES.inventoryImg);

        this.closeButtonArea = new BoundingRectangle(new Vector(50, 50), 100, 60);

        this.guiScale = 1;
    }
    GUIInventoryScreen.prototype.GetPosition = function () {
        var viewportSize = this.ourEngine.size;

        var width = this.GetWidth();
        var height = this.GetHeight();

        return new Vector(viewportSize.width / 2 - width / 2, viewportSize.height / 2 - height / 2);
    };

    GUIInventoryScreen.prototype.GetWidth = function () {
        var bgImg = this.GetBackgroundImage();

        if (bgImg != null) {
            return bgImg.width * this.guiScale;
        }

        return 160;
    };

    GUIInventoryScreen.prototype.GetHeight = function () {
        var bgImg = this.GetBackgroundImage();

        if (bgImg != null) {
            return bgImg.height * this.guiScale;
        }
        return 130;
    };

    GUIInventoryScreen.prototype.Clicked = function (mx, my) {
        console.log("clicked on inventory");

        // Test: try to click on the given area. if done, output some debug to console.
        var mouseCoordVector = this.TransformMouseToImageCoordinates(mx, my);

        if (this.closeButtonArea.intersectWithPoint(mouseCoordVector)) {
            console.log("clicked successfully!");
        }

        return _super.prototype.Clicked.call(this, mx, my);
    };
    return GUIInventoryScreen;
})(GUIPanel);
;

var GUIPauseScreen = (function (_super) {
    __extends(GUIPauseScreen, _super);
    function GUIPauseScreen(theEngine) {
        _super.call(this, theEngine);

        // TODO: set up the rectangles properly.
        this.saveQuitArea = new BoundingRectangle(new Vector(11, 22), 120, 20);
        this.continueArea = new BoundingRectangle(new Vector(11, 51), 120, 20);
    }
    GUIPauseScreen.prototype.Clicked = function (mx, my) {
        // Get the coordinate in image space.
        var backgroundClickAt = this.TransformMouseToImageCoordinates(mx, my);

        var hasClickedButton = false;

        // Either save/quit.
        if (this.saveQuitArea.intersectWithPoint(backgroundClickAt)) {
            // we clicked at save/quit button.
            hasClickedButton = true;
        }

        // Or continue.
        if (this.continueArea.intersectWithPoint(backgroundClickAt)) {
            // we clicked at continue button.
            hasClickedButton = true;
        }

        if (hasClickedButton) {
            this.ourEngine.ClearInteraction();
        }

        return true;
    };
    return GUIPauseScreen;
})(GUIPanel);
//# sourceMappingURL=gui_interface.js.map
