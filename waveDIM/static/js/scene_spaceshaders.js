// Sander Ferdinand 2017

class SceneSpaceShaders extends Scene {
    constructor() {
        super();

        this.updateDistortionEffect = null;
        this.updateFXAAEffect = null;
    }

    build() {
        this.x = 0;
        this.meshgroup1 = null;
        this.meshgroup2 = null;
        this.meshgroup_current = null;
        this.meshgroup_changed = null;
        this.matSmoke = null;
        this.matStars = null;
        this.composer = true;

        render._camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000000);
        render._camera.position.z = 1800;
        render._composer.addPass(new THREE.RenderPass(this.scene, render._camera));

        var effect = new THREE.ShaderPass(this.getDistortionShaderDefinition());
        render._composer.addPass(effect);
        this.setupDistortionEffectAndGUI(effect);

        var fxaa = new THREE.ShaderPass(THREE.FXAAShader);
        fxaa.uniforms['resolution'].value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);
        render._composer.addPass(fxaa);
        this.setupFXAAEffect(fxaa);

        var copy = new THREE.ShaderPass(THREE.CopyShader);
        copy.renderToScreen = true;
        render._composer.addPass(copy);

        this.initMaterials();
        this.initLights();

        var bgGeo = new THREE.PlaneGeometry(10000, 10000, 10, 10);
        var bg = new THREE.Mesh(bgGeo, this.matStars);
        bg.position.z = -400;
        this.scene.add(bg);

        this.meshgroup1 = this._mesh1();
        this.meshgroup2 = this._mesh2();

        this.scene.add(this.meshgroup1);
        this.scene.add(this.meshgroup2);
    }

    _enable_group(name){
        this.meshgroup1.visible = false;
        this.meshgroup2.visible = false;
        this.meshgroup_current = name;
        this.meshgroup_changed = parseInt(render._iGlobalTime);
        this[name].visible = true;
    }

    _mesh1(){
        let group = new THREE.Object3D();
        group.position.z = 1200;
        group.name = "cubes";

        let object = new THREE.Object3D();
        group.add(object);

        // add block stack
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                for (var z = -1; z <= 1; z++) {
                    let mesh = this.generateMesh(1, THREE.CubeGeometry);
                    mesh.position.set(160 * (x), 160 * (y), 160 * (z));

                    let outline = this.generateOutlineMesh(mesh, THREE.CubeGeometry);
                    object.add(outline);
                    object.add(mesh);
                }
            }
        }

        group.visible = false;
        return group
    }

    _mesh2(){
        let group = new THREE.Object3D();
        group.position.z = 1200;
        group.name = "spheres";

        let object = new THREE.Object3D();
        group.add(object);

        for (var x = -1; x <= 1; x++) {
            let mesh = this.generateMesh(1, THREE.SphereGeometry);
            mesh.position.set(300*x, 60, -300);

            let outline = this.generateOutlineMesh(mesh, THREE.SphereGeometry);
            object.add(outline);
            object.add(mesh);
        }

        group.visible = false;
        return group;
    }

    initLights(){
        let light = new THREE.DirectionalLight(0xFFEEBB);
        light.position.set(0, 0.5, 1);
        light.name = "light1";
        this.scene.add(light);

        light = new THREE.DirectionalLight(0x223333);
        light.position.set(1, -.15, -0.22);
        light.name = "light2";
        this.scene.add(light);

        light = new THREE.DirectionalLight(0x223333);
        light.position.set(-1, -.15, -0.22);
        light.name = "light3";
        this.scene.add(light);
    }

    initMaterials() {
        this.matSmoke = new THREE.ShaderMaterial( {
            uniforms: {
                time: { type: 'f', value: 0.1 }
            },
            vertexShader: THREE.SmokeShader['vertexShader'],
            fragmentShader: THREE.SmokeShader['fragmentShader'],
            side:THREE.DoubleSide
        });

        this.matStars = new THREE.ShaderMaterial( {
            uniforms: {
                time: { type: 'f', value: 0.1 },
                mouse: { type: "v2", value: new THREE.Vector2( 1.0, 1.0 ) }
            },
            vertexShader: THREE.StarShader['vertexShader'],
            fragmentShader: THREE.StarShader['fragmentShader'],
            side:THREE.DoubleSide
        });
    }

    setupFXAAEffect(effect){
        this.updateFXAAEffect = function () {
            effect.uniforms['resolution'].value = new THREE.Vector2( 1/window.innerWidth, 1/window.innerHeight );
        }
    }

    setupDistortionEffectAndGUI(effect) {
        let guiParameters = {
            horizontalFOV: 160,
            strength: 0.6,
            cylindricalRatio: 0.25
        };

        this.updateDistortionEffect = function () {
            let height = Math.tan(THREE.Math.degToRad(guiParameters.horizontalFOV) / 2) / render._camera.aspect;

            render._camera.fov = Math.atan(height) * 2 * 180 / 3.1415926535;
            render._camera.updateProjectionMatrix();

            effect.uniforms["strength"].value = guiParameters.strength;
            effect.uniforms["height"].value = height;
            effect.uniforms["aspectRatio"].value = render._camera.aspect;
            effect.uniforms["cylindricalRatio"].value = guiParameters.cylindricalRatio;
        };

        this.updateDistortionEffect();
        //let gui = new dat.GUI({width: 320});
        //gui.add(guiParameters, "horizontalFOV", 5, 160, 1).onChange(this.updateDistortionEffect.bind(this));
        //gui.add(guiParameters, "strength", 0.0, 1.0, 0.025).onChange(this.updateDistortionEffect.bind(this));
        //gui.add(guiParameters, "cylindricalRatio", 0.25, 4.0, 0.025).onChange(this.updateDistortionEffect.bind(this));
    }

    generateOutlineMesh(cube, type){
        let geometry = new type(140, 140, 140);
        let material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.BackSide } );
        let mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = cube.position.x;
        mesh.position.y = cube.position.y;
        mesh.position.z = cube.position.z;
        mesh.scale.multiplyScalar(1.05);

        return mesh;
    }

    generateMesh(intensity, type) {
        // let randomColor = Math.round(intensity * (128 + 127 * Math.random())) * 0x010000 +
        //     Math.round(intensity * (128 + 127 * Math.random())) * 0x000100 +
        //     Math.round(intensity * (128 + 127 * Math.random())) * 0x000001;

        let material = new THREE.MeshLambertMaterial({
            color: 0x00,
            shading: THREE.FlatShading
        });

        let geometry = new type(140, 140, 140);
        let cube = new THREE.Mesh(geometry, material);

        return cube;
    }

    getDistortionShaderDefinition() {
        return {
            uniforms: {
                "tDiffuse": {type: "t", value: null},
                "strength": {type: "f", value: 0},
                "height": {type: "f", value: 1},
                "aspectRatio": {type: "f", value: 1},
                "cylindricalRatio": {type: "f", value: 1}
            },

            vertexShader: [
                "uniform float strength;",
                "uniform float height;",
                "uniform float aspectRatio;",
                "uniform float cylindricalRatio;",

                "varying vec3 vUV;",
                "varying vec2 vUVDot;",

                "void main() {",
                    "gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));",

                    "float scaledHeight = strength * height;",
                    "float cylAspectRatio = aspectRatio * cylindricalRatio;",
                    "float aspectDiagSq = aspectRatio * aspectRatio + 1.0;",
                    "float diagSq = scaledHeight * scaledHeight * aspectDiagSq;",
                    "vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));",

                    "float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;",
                    "float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);",

                    "vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;",
                    "vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);",
                    "vUV.xy += uv;",
                "}"
            ].join("\n"),

            fragmentShader: [
                "uniform sampler2D tDiffuse;",      // sampler of rendered scene's render target
                "varying vec3 vUV;",                // interpolated vertex output data
                "varying vec2 vUVDot;",             // interpolated vertex output data

                "void main() {",
                    "vec3 uv = dot(vUVDot, vUVDot) * vec3(-0.5, -0.5, -1.0) + vUV;",
                    "gl_FragColor = texture2DProj(tDiffuse, uv);",
                "}"
            ].join("\n"),

            z: `
                precision highp float;
                precision highp int;
                uniform sampler2D iChannel0;
                uniform vec2 resolution;
                uniform vec2 mouse;
                varying vec2 vUv;

                void main()
                {
                    vec2 p = vUv.xy / resolution.xy;
                    vec2 m = mouse.xy / resolution.xy;
                    float lensSize = 2.0;
                    float scale = 1.0;
                    vec2 d = p - m;
                    float r = scale * sqrt(dot(d, d));
                    float rThresh = 0.3;
                    vec2 pos = d;
                    float apertureHalf = 0.5 * 90.0 * (3.14159 / 180.0);
                    float maxFactor = sin(apertureHalf);
                    vec2 uv;
                    float avgD = (resolution.x + resolution.y) / 2.0;
                    vec2 fMinMouse = vUv.xy / avgD - mouse.xy / resolution.xy;
                    float r2 = scale * sqrt(dot(fMinMouse, fMinMouse));
                    if (r2 >= lensSize) {
                        gl_FragColor = vec4(0, 0, 0, 1.0);
                    } else {
                        vec2 p2 = vUv.xy / resolution.x;
                        float prop = resolution.x / resolution.y;
                        vec2 m2 = vec2(0.5, 0.5 / prop);
                        vec2 d2 = p2 - m2;
                        float r2 = sqrt(dot(d2, d2));
                        float power = (2.0 * 3.141592 / (2.0 * sqrt(dot(m2, m2)))) * (m.x - 0.2);
                        float bind;

                        if (power > 0.0) bind = sqrt(dot(m2, m2));
                        else {
                            if (prop < 1.0) bind = m2.x;
                            else bind = m2.y;
                        }

                        if (power > 0.0) {
                            uv = m2 + normalize(d2) * tan(r2 * power) * bind / tan(bind * power);
                        }
                        else if (power < 0.0) {
                            uv = m2 + normalize(d2) * atan(r2 * -power * 10.0) * bind / atan(-power * bind * 10.0);
                        }
                        else {
                            uv = p;
                        }

                        vec3 col = texture2D(iChannel0, vec2(uv.x, -uv.y * prop)).xyz;
                        gl_FragColor = vec4(col, 1.0);
                    }
                }`
        };
    }

    loop(){
        if(!this.meshgroup_changed){
            this._enable_group("meshgroup1");
        } else {
            if((parseInt(render._iGlobalTime) - this.meshgroup_changed) > 3){
                if(this.meshgroup_current == "meshgroup1"){
                    this._enable_group("meshgroup2");
                } else if(this.meshgroup_current == "meshgroup2"){
                    this._enable_group("meshgroup1");
                }
            }
        }

        this[this.meshgroup_current].rotation.y = Math.cos(this.x*120);
        this[this.meshgroup_current].rotation.x = Math.sin(this.x*200)/1.8;
        
        //this.matSmoke.uniforms[ 'time' ].value = render._iGlobalTime;
        this.matStars.uniforms[ 'time' ].value = render._iGlobalTime*25;
        this.matStars.uniforms[ 'mouse' ].value = new THREE.Vector2(render._iGlobalTime*0.0005, 1.0 );

        this.x += 0.0005;
    }
}