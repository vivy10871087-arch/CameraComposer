/*
CameraComposer.jsx - v0.2.2
AE 2025 ExtendScript
Fix: safe effect group handling + stable shake controls
*/

(function () {
    app.beginUndoGroup("CameraComposer v0.2.2");

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
    // Safe Effect Helpers
    // =========================

    function getEffectParade(layer) {
        return layer.property("ADBE Effect Parade");
    }

    function addSlider(layer, name, value) {
        var fx = getEffectParade(layer);
        if (!fx) {
            fx = layer.property("ADBE Effect Parade");
        }
        var ctrl = fx.addProperty("ADBE Slider Control");
        ctrl.name = name;
        ctrl.property("Slider").setValue(value);
        return ctrl;
    }

    // =========================
    // Shake Controls
    // =========================

    addSlider(controller, "Shake Frequency", 2);
    addSlider(controller, "Shake Amplitude", 30);

    // =========================
    // Camera Expressions
    // =========================

    cam.property("Position").expression =
        "ctrl = thisComp.layer('CC_Controller');\n" +
        "freq = ctrl.effect('Shake Frequency')('Slider');\n" +
        "amp = ctrl.effect('Shake Amplitude')('Slider');\n" +
        "base = ctrl.transform.position;\n" +
        "base + wiggle(freq, amp);";

    cam.property("Point of Interest").expression =
        "thisComp.layer('CC_Target').transform.position;";

    app.endUndoGroup();

    alert("CameraComposer v0.2.2 fixed:\nSafe effects + stable shake.");

})();