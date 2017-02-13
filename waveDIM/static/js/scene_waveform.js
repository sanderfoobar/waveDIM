// Sander Ferdinand 2017

class SceneWaveform extends Scene{
    constructor() {
        super();
    }

    build(){
        this.scene = new THREE.Scene();

        render._camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 3000);
        render._camera.position.z = 120;
        render._camera.position.y = 0;
        render._camera.position.x = -45;
        render._composer.addPass(new THREE.RenderPass(this.scene, render._camera));

        // camera controls
        render._controls = new THREE.OrbitControls(render._camera, render._renderer.domElement);
        render._controls.enableDamping = true;
        render._controls.dampingFactor = 0.25;
        render._controls.enableZoom = true;
        render._controls.minPolarAngle = 0.5; // radians
        render._controls.maxPolarAngle = 2.5;
        render._controls.minAzimuthAngle = -1.2; // radians
        render._controls.maxAzimuthAngle = 1.2; // radians

        // scene, skybox, fog
        this.scene.fog = new THREE.FogExp2(0x9999ff, 0.0085);
        this.skyBoxGeometry = new THREE.CubeGeometry(1000, 1000, 1000);
        this.skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
        this.skyBox = new THREE.Mesh(this.skyBoxGeometry, this.skyBoxMaterial);
        this.scene.add(this.skyBox);

        this._uniforms = {
            time: {type: "f", value: 1.0},
            resolution: {type: "v2", value: new THREE.Vector3()}
        };

        var copy = new THREE.ShaderPass(THREE.CopyShader);
        copy.renderToScreen = true;
        render._composer.addPass(copy);

        // materials
        this.material_wireframe = new THREE.MeshBasicMaterial({color: 'white', wireframe: true});
        this.material_bg = new THREE.MeshPhongMaterial({color: '#8282f4'});

        this.mesh = null;
        this.meshes = [];
        this.meshes_group = null;

        this.material = new THREE.MeshBasicMaterial({color: "#9999ff"});
        this.meshes_group = new THREE.Object3D();

        for (var i = 0; i != 255; i += 1) {
            var geometry = new THREE.BoxGeometry(0.5, 1.0, 0.5);

            this.mesh = new THREE.Mesh(geometry, this.material);
            this.mesh.position.x = i;
            this.mesh.castShadow = true;

            this.meshes.push(this.mesh);
            this.meshes_group.add(this.mesh);
        }

        this.meshes_group.position.x = -110;
        this.meshes_group.position.z = 10;
        this.scene.add(this.meshes_group);

        this.cubeGeometry = new THREE.CubeGeometry(1000, 500, 50);
        this.mesh_bg = new THREE.Mesh(this.cubeGeometry, this.material_bg);
        this.mesh_bg.position.z = -20;
        this.mesh_bg.receiveShadow = true;
        this.scene.add(this.mesh_bg);

        this.group_light = new THREE.Object3D();
        this.spotlight = new THREE.SpotLight("white");

        this.spotlight.position.set(0, 0, 0);
        this.spotlight.shadowCameraVisible = false;
        this.spotlight.shadowDarkness = 0.95;
        this.spotlight.intensity = 0.6;
        this.spotlight.castShadow = true;
        this.spotlight.distance = 0;
        this.spotlight.shadowCameraNear = 1;
        this.spotlight.shadowCameraFov = 70;
        this.spotlight.shadowMapWidth = 1024;
        this.spotlight.shadowMapHeight = 1024;
        this.spotlight.exponent = 20;
        this.spotlight.decay = 100;
        this.group_light.add(this.spotlight);

//                this.c = new THREE.CubeGeometry( 8, 8, 2 );
//                this.x = new THREE.Mesh( c, material_wireframe );
//                group_light.add(x);

        this.group_light.position.z = 30;
        this.group_light.position.x = -90;
        this.scene.add(this.group_light);

        this.light_target = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), this.material_wireframe);
        this.light_target.position.z = -16;
        this.scene.add(this.light_target);
        this.spotlight.target = this.light_target;
    }

    loop(){
        render.audio.audio_analyzer.getFloatFrequencyData(render.audio.audio_liveFreqData);
        render.audio.audio_analyzer.getByteTimeDomainData(render.audio.audio_liveWaveformData);
        let freqData = render.audio.audio_liveFreqData;
        let waveformData = render.audio.audio_liveWaveformData;

        this.f += 1;
        if(this.f % 2 == 1) {
            for (let i = 0; i != waveformData.length; i += 1) {
                let a = waveformData[i];
                let m = this.meshes[i];

                if (typeof m !== "undefined") {
                    //m.scale.y = Math.cos(a) + 2;
                    m.scale.y = (a / 256)*100;
                }
            }
        }
    }
}
