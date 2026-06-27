/*
CameraComposer.jsx - v0.1.1 (FIXED)
AE 2025 ExtendScript
Stable Camera Rig Generator
*/

(function () {
    app.beginUndoGroup("CameraComposer v0.1.1");

    // Get or create comp
    var comp = app.project.activeItem;

    if (!(comp && comp instanceof CompItem)) {
        comp = app.project.items.addComp(
            "CameraComposer_Comp",
            1920,
            1080,
            1,
            10,
            30
        );
    }

    // Ensure comp is active
    app.project.activeItem = comp;

    // Create Controller
    var controller = comp.layers.addNull();
    controller.name = "CC_Controller";
    controller.threeDLayer = true;
    controller.property("Position").setValue([0, 0, 0]);

    // Create Target
    var target = comp.layers.addNull();
    target.name = "CC_Target";
    target.threeDLayer = true;
    target.property("Position").setValue([0, 0, -2000]);

    // Create Camera
    var cam = comp.layers.addCamera("CC_Camera", [comp.width / 2, comp.height / 2]);
    cam.threeDLayer = true;

    // Force camera to be visible
    cam.property("Position").setValue([0, 0, -1000]);

    // Camera follows Controller
    cam.property("Position").expression = 
        "thisComp.layer('CC_Controller').transform.position;";

    // Camera looks at Target
    cam.property("Point of Interest").expression = 
        "thisComp.layer('CC_Target').transform.position;";

    // Make this camera active
    comp.activeCamera = cam;

    // Disable auto orient
    try {
        cam.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
    } catch (e) {}

    app.endUndoGroup();

    alert("CameraComposer v0.1.1 FIXED:\nRig created successfully.");

})();