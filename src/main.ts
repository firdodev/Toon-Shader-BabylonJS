import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";

// import * as customVer from "./custom.vertex.fx"
// import * as customFrag from "./custom.fragment.fx"

// BABYLON.Effect.ShadersStore["customFrag"] = customFrag
// BABYLON.Effect.ShadersStore["customVer"] = customVer

class App {
    private torusKnotMaterial: BABYLON.ShaderMaterial;
    private shaderCreated: boolean = false;
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        var camera: BABYLON.FreeCamera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(1.441928862973195, 1.2918410491828538, 10.334819344543382));
        camera.position = new BABYLON.Vector3(1.2767977692339196,
            2.84570761396742,
            9.852929844296833);
            camera.attachControl(canvas, true);
        var light1: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        camera.lockedTarget = new BABYLON.Vector3(0, 0, 0);

        const vertexSource = `
        precision highp float;
            attribute vec3 position;
            attribute vec3 normal;
            attribute vec2 uv;
            uniform mat4 world;
            uniform mat4 worldViewProjection;
            varying vec3 vPositionW;
            varying vec3 vNormalW;
            varying vec2 vUV;
            void main(void) {
                vec4 outPosition = worldViewProjection * vec4(position, 1.0);
                gl_Position = outPosition;
                vPositionW = vec3(world * vec4(position, 1.0));
                vNormalW = normalize(vec3(world * vec4(normal, 0.0)));
                vUV = uv;
            }
        `

        const fragmentSource = `
            precision highp float;
            varying vec3 vPositionW;
            varying vec3 vNormalW;
            varying vec2 vUV;
            uniform vec3 vLightPosition;
            uniform vec3 vColor;
            void main(void) {
                float ToonThresholds[2];
                ToonThresholds[0] = 0.8;
                ToonThresholds[1] = 0.2;
                float ToonBrightnessLevels[3];
                ToonBrightnessLevels[0] = 1.0;
                ToonBrightnessLevels[1] = 0.8;
                ToonBrightnessLevels[2] = 0.5;
                vec3 lightVectorW = normalize(vLightPosition - vPositionW);
                float diffuse = max(0.0, dot(vNormalW, lightVectorW));
                vec3 color = vColor;
                if (diffuse > ToonThresholds[0]) {
                color *= ToonBrightnessLevels[0];
                } else if (diffuse > ToonThresholds[1]) {
                color *= ToonBrightnessLevels[1];
                } else {
                color *= ToonBrightnessLevels[2];
                }
                gl_FragColor = vec4(color, 1.0);
            }
        `

        
        
        this.torusKnotMaterial = new BABYLON.ShaderMaterial('torusKnotMaterial', scene, { vertexSource, fragmentSource }, {
            attributes: ['position', 'normal', 'uv'],
        uniforms: ['world', 'worldView', 'worldViewProjection'],
        })
        this.shaderCreated = true;
        let t = 0.0
        const lightPosition = new BABYLON.Vector3(5, 10, 10)
        const color = new BABYLON.Color3(0, 0, 0)
        
        const hero = BABYLON.Mesh.CreateBox("hero", 1, scene);
        hero.position = new BABYLON.Vector3(0, 0, 0)
        const sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
        sphere.position = new BABYLON.Vector3(3, 0, 0)

        sphere.material = this.torusKnotMaterial
        hero.material = this.torusKnotMaterial
        
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            t += 0.01
            lightPosition.x = 5 * Math.sin(t)
            lightPosition.y = 10 * Math.cos(t)

            BABYLON.Color3.LerpToRef(color, BABYLON.Color3.Teal(), 0.5, color)
            if(this.shaderCreated){
                this.torusKnotMaterial.setVector3('vLightPosition', lightPosition)
                this.torusKnotMaterial.setColor3('vColor', color)
            }
            scene.render()
        });
    }
}
new App();

