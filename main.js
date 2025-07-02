const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    const radius = 0.01;
    const camera = new BABYLON.ArcRotateCamera("Camera",
        Math.PI / 2, Math.PI / 2.2, radius,
        BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = radius;
    camera.upperRadiusLimit = radius;
    camera.wheelPrecision = 1000;
    camera.panningSensibility = 0;

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.8;

    const room = BABYLON.MeshBuilder.CreateBox("room", { size: 10 }, scene);
    const roomMat = new BABYLON.StandardMaterial("roomMat", scene);
    roomMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.2);
    roomMat.backFaceCulling = false;
    room.material = roomMat;

    // 📸 Photo Wall
    const photoPlane = BABYLON.MeshBuilder.CreatePlane("photo", { width: 3, height: 3 }, scene);
    photoPlane.position = new BABYLON.Vector3(0, 0, -4.89);

    const photoMat = new BABYLON.StandardMaterial("photoMat", scene);
    const photoTex = new BABYLON.Texture("subikshan.jpeg", scene);
    photoTex.uScale = -1;
    photoMat.diffuseTexture = photoTex;
    photoMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    photoMat.backFaceCulling = false;
    photoPlane.material = photoMat;

    const framePlane = BABYLON.MeshBuilder.CreatePlane("photoFrame", { width: 3.2, height: 3.2 }, scene);
    framePlane.position = new BABYLON.Vector3(0, 0, -4.891);

    const frameMat = new BABYLON.StandardMaterial("frameMat", scene);
    frameMat.emissiveColor = new BABYLON.Color3(0.1, 0.6, 1);
    frameMat.alpha = 0.3;
    frameMat.backFaceCulling = false;
    framePlane.material = frameMat;

    const alphaAnim = new BABYLON.Animation("alphaPulse", "material.alpha", 30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    alphaAnim.setKeys([
        { frame: 0, value: 0.3 },
        { frame: 30, value: 0.6 },
        { frame: 60, value: 0.3 }
    ]);

    const colorAnim = new BABYLON.Animation("glowPulse", "material.emissiveColor", 30,
        BABYLON.Animation.ANIMATIONTYPE_COLOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    colorAnim.setKeys([
        { frame: 0, value: new BABYLON.Color3(0.1, 0.6, 1) },
        { frame: 30, value: new BABYLON.Color3(0.3, 0.8, 1) },
        { frame: 60, value: new BABYLON.Color3(0.1, 0.6, 1) }
    ]);

    framePlane.animations = [alphaAnim.clone(), colorAnim.clone()];
    scene.beginAnimation(framePlane, 0, 60, true);

    // 🧱 Side Panels
    const panels = [
        {
            text: "📁 Projects\n\n✨ Spell Corrector GUI \nUsing Tkinter\n✨ Expense Tracker Application \nUsing Java\n✨ Home Security Analytics Using IoT\n✨ Real Estate Management System\n✨ Wings On Time\n✨ To-Do List",
            position: new BABYLON.Vector3(-4.9, 0, 0),
            rotationY: Math.PI / 2
        },
        {
            text: "🧠 Skills\n\n🌠 HTML\n🌠 CSS\n🌠 JavaScript\n🌠 PHP\n🌠 MySQL\n🌠 Python\n🌠 C\n🌠 Java",
            position: new BABYLON.Vector3(4.9, 0, 0),
            rotationY: -Math.PI / 2
        },
        {
            text: "",
            position: new BABYLON.Vector3(0, 0, 4.9),
            rotationY: Math.PI
        }
    ];

    panels.forEach((p, i) => {
        const plane = BABYLON.MeshBuilder.CreatePlane("panel" + i, { width: 5, height: 3 }, scene);
        plane.position = p.position;
        plane.rotation.y = p.rotationY;

        const texture = new BABYLON.DynamicTexture("textTexture" + i, { width: 1024, height: 512 }, scene, true);
        const ctx = texture.getContext();
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-1024, 0);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 1024, 512);
        ctx.font = "bold 36px Arial";
        ctx.fillStyle = "#00ccff";
        ctx.textAlign = "center";

        const lines = wrapText(ctx, p.text, 900);
        lines.forEach((line, index) => {
            ctx.fillText(line, 512, 70 + index * 48);
        });
        ctx.restore();
        texture.update();

        const mat = new BABYLON.StandardMaterial("panelMat" + i, scene);
        mat.diffuseTexture = texture;
        mat.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        mat.backFaceCulling = false;
        plane.material = mat;

        const glowFrame = BABYLON.MeshBuilder.CreatePlane("framePanel" + i, { width: 5.2, height: 3.2 }, scene);
        glowFrame.position = p.position.add(new BABYLON.Vector3(0, 0, 0.01));
        glowFrame.rotation.y = p.rotationY;

        const glowMat = new BABYLON.StandardMaterial("glowMat" + i, scene);
        glowMat.emissiveColor = new BABYLON.Color3(0.1, 0.6, 1);
        glowMat.alpha = 0.3;
        glowMat.backFaceCulling = false;
        glowFrame.material = glowMat;

        glowFrame.animations = [alphaAnim.clone(), colorAnim.clone()];
        scene.beginAnimation(glowFrame, 0, 60, true);
    });

    // 📄 About Text on Floor
    const aboutPlane = BABYLON.MeshBuilder.CreatePlane("aboutPlane", { width: 6, height: 6 }, scene);
    aboutPlane.rotation.x = Math.PI / 2;
    aboutPlane.position.y = -4.9;

    const aboutTexture = new BABYLON.DynamicTexture("aboutTexture", { width: 1024, height: 1024 }, scene, true);
    const ctx = aboutTexture.getContext();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#00ccff";
    ctx.textAlign = "center";

    const aboutText = "👋 Hello! I'm Subikshan Mani,\nI am a passionate college student\nwith a keen interest in web development and technology,\nand very interested in researching about technologies \nthat inspires me a lot.";
    const lines = aboutText.split("\n");
    lines.forEach((line, i) => {
        ctx.fillText(line, 512, 200 + i * 60);
    });
    aboutTexture.update();

    const aboutMat = new BABYLON.StandardMaterial("aboutMat", scene);
    aboutMat.diffuseTexture = aboutTexture;
    aboutMat.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    aboutMat.backFaceCulling = false;
    aboutPlane.material = aboutMat;

    // 🎓 Education on Ceiling
    const eduPlane = BABYLON.MeshBuilder.CreatePlane("eduPlane", { width: 6, height: 3 }, scene);
    eduPlane.rotation.x = -Math.PI / 2;
    eduPlane.position.y = 4.89;

    const eduTexture = new BABYLON.DynamicTexture("eduTexture", { width: 1024, height: 512 }, scene, true);
    const eduCtx = eduTexture.getContext();
    eduCtx.fillStyle = "black";
    eduCtx.fillRect(0, 0, 1024, 512);
    eduCtx.font = "bold 30px Arial";
    eduCtx.fillStyle = "#00ccff";
    eduCtx.textAlign = "center";

    const eduText = "🎓 Education\nB.Tech in Artificial Intelligence And Data Science\nM. Kumarasamy College Of Engineering, Karur, Tamil Nadu (2023 - 2027)\nHSC - Computer Science at Trinity International School, Namakkal, Tamil Nadu\n(2022 - 2023)\nSSLC - Park View Academy, Namakkal, Tamil Nadu\n(2020 - 2021)";
    const eduLines = wrapText(eduCtx, eduText, 900);
    eduLines.forEach((line, i) => {
        eduCtx.fillText(line, 512, 80 + i * 50);
    });
    eduTexture.update();

    const eduMat = new BABYLON.StandardMaterial("eduMat", scene);
    eduMat.diffuseTexture = eduTexture;
    eduMat.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    eduMat.backFaceCulling = false;
    eduPlane.material = eduMat;

    // 📩 Contact Buttons (2x2 layout)
    const contactButtons = [
        { label: "📧 Email", action: () => window.open("mailto:subikshan.mailbox@gmail.com", "_blank"), position: new BABYLON.Vector3(-1.3, 0.7, 4.89) },
        { label: "📞 Call", action: () => window.open("tel:+919095076843", "_blank"), position: new BABYLON.Vector3(1.3, 0.7, 4.89) },
        { label: "LinkedIn", action: () => window.open("https://www.linkedin.com/in/subikshan-mani-ba0321290/", "_blank"), position: new BABYLON.Vector3(-1.3, -0.7, 4.89) },
        { label: "🌐 Website", action: () => window.open("https://your-portfolio-link.com", "_blank"), position: new BABYLON.Vector3(1.3, -0.7, 4.89) }
    ];

    contactButtons.forEach((btn, index) => {
        const button = BABYLON.MeshBuilder.CreatePlane("contactButton" + index, { width: 2, height: 0.6 }, scene);
        button.position = btn.position;
        button.rotation.y = Math.PI;

        const buttonTexture = new BABYLON.DynamicTexture("btnTexture" + index, { width: 512, height: 128 }, scene, true);
        const ctx = buttonTexture.getContext();
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-512, 0);
        ctx.fillStyle = "#00334d";
        ctx.fillRect(0, 0, 512, 128);
        ctx.fillStyle = "#00ccff";
        ctx.font = "bold 42px Arial";
        ctx.textAlign = "center";
        ctx.fillText(btn.label, 256, 80);
        ctx.restore();
        buttonTexture.update();

        const buttonMat = new BABYLON.StandardMaterial("btnMat" + index, scene);
        buttonMat.diffuseTexture = buttonTexture;
        buttonMat.emissiveColor = new BABYLON.Color3(0.2, 0.8, 1);
        buttonMat.backFaceCulling = false;
        button.material = buttonMat;

        const buttonFrame = BABYLON.MeshBuilder.CreatePlane("btnFrame" + index, { width: 2.2, height: 0.8 }, scene);
        buttonFrame.position = btn.position.add(new BABYLON.Vector3(0, 0, 0.001));
        buttonFrame.rotation.y = Math.PI;

        const glowMat = new BABYLON.StandardMaterial("btnFrameMat" + index, scene);
        glowMat.emissiveColor = new BABYLON.Color3(0.1, 0.6, 1);
        glowMat.alpha = 0.3;
        glowMat.backFaceCulling = false;
        buttonFrame.material = glowMat;

        button.actionManager = new BABYLON.ActionManager(scene);
        button.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => btn.action())
        );
        button.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, () => {
                button.scaling = new BABYLON.Vector3(1.1, 1.1, 1.1);
            })
        );
        button.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => {
                button.scaling = new BABYLON.Vector3(1, 1, 1);
            })
        );
    });

    const glow = new BABYLON.GlowLayer("glow", scene);
    glow.intensity = 0.6;
    glow.customEmissiveColorSelector = function (mesh, subMesh, material, result) {
        if (mesh.name.startsWith("frame") || mesh.name.startsWith("btnFrame")) {
            result.copyFrom(material.emissiveColor);
        } else {
            result.set(0, 0, 0);
        }
    };

    return scene;
};

function wrapText(ctx, text, maxWidth) {
    const paragraphs = text.split('\n');
    const lines = [];

    paragraphs.forEach(paragraph => {
        const words = paragraph.split(" ");
        let currentLine = "";

        words.forEach(word => {
            const testLine = currentLine + word + " ";
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth && currentLine !== "") {
                lines.push(currentLine.trim());
                currentLine = word + " ";
            } else {
                currentLine = testLine;
            }
        });

        lines.push(currentLine.trim());
    });

    return lines;
}

// 🌀 Run
const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
