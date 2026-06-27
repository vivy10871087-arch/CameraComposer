/*
CameraComposer.jsx - v0.2.1
AE 2025 ExtendScript
Fix: proper follow + shake layering (no overwrite)
*/

(function () {
    app.beginUndoGroup("CameraComposer v0.2.1");

    var comp = app.project.activeItem;

    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    // =========================
    // Core Rig
    // =========================

    var controller = comp.layers.addNull();
    controller.name = "CC_Controller";
    controller.threeDLayer = true;
    controller.property("Position").setValue([0, 0, 0]);

    var target = comp.layers.addNull();
    target.name = "CC_Target";
    target.threeDLayer = true;
    target.property("Position").setValue([0, 0, -2000]);

    var cam = comp.layers.addCamera("CC_Camera", [comp.width / 2, comp.height / 2]);
    cam.threeDLayer = true;

    try {
        cam.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
    } catch (e) {}

    // =========================
    // Controls
    // =========================

    var freq = controller.property("Effects").addProperty("ADBE Slider Control");
    freq.name = "Shake Frequency";
    freq.property("Slider").setValue(2);

    var amp = controller.property("Effects").addProperty("ADBE Slider Control");
    amp.name = "Shake Amplitude";
    amp.property("Slider").setValue(30);

    // =========================
    // Camera Expressions (FIXED LAYERING)
    // =========================

    // Position = follow controller + shake
    cam.property("Position").expression =
        "ctrl = thisComp.layer('CC_Controller');\n" +
        "freq = ctrl.effect('Shake Frequency')('Slider');\n" +
        "amp = ctrl.effect('Shake Amplitude')('Slider');\n" +
        "base = ctrl.transform.position;\n" +
        "base + wiggle(freq, amp);";

    // LookAt target (separate, NOT overwritten)
    cam.property("Point of Interest").expression =
        "thisComp.layer('CC_Target').transform.position;";

    app.endUndoGroup();

    alert("CameraComposer v0.2.1 fixed:\nShake layering corrected.");

})();