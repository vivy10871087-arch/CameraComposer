/*
CameraComposer.jsx - v0.1
AE 2025 ExtendScript
Minimal working Camera Rig Generator
*/

(function () {
    app.beginUndoGroup("CameraComposer v0.1");

    var comp = app.project.activeItem;

    if (!(comp && comp instanceof CompItem)) {
        alert("Please select an active composition.");
        return;
    }

    // Create Controller
    var controller = comp.layers.addNull();
    controller.name = "CC_Controller";
    controller.threeDLayer = true;
    controller.property("Position").setValue([0, 0, 0]);

    // Create Target
    var target = comp.layers.addNull();
    target.name = "CC_Target";
    target.threeDLayer = true;
    target.property("Position").setValue([0, 0, -1000]);

    // Create Camera
    var cam = comp.layers.addCamera("CC_Camera", [comp.width / 2, comp.height / 2]);
    cam.threeDLayer = true;

    // Camera follows Controller position
    cam.property("Position").expression = 
        "thisComp.layer('CC_Controller').transform.position;";

    // Camera looks at Target
    cam.property("Point of Interest").expression = 
        "thisComp.layer('CC_Target').transform.position;";

    // Small safety: enable auto-orient off (optional)
    try {
        cam.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
    } catch (e) {}

    app.endUndoGroup();

    alert("CameraComposer v0.1 created:\nCC_Camera + Controller + Target");

})();