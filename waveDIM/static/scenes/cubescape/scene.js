// Sander Ferdinand 2017

class SceneCubescape extends Scene {
    constructor() {
        super();

        this.updateFXAAEffect = null;
    }

    build() {
        this.x = 0;

        this.matSmoke = null;
        this.matCubeScape = null;

        // enable rendering through composer
        this.composer = true;

        render._camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 10000);
        render._camera.position.z = 2500;
        render._composer.addPass(new THREE.RenderPass(this.scene, render._camera));

        // var fxaa = new THREE.ShaderPass(THREE.FXAAShader);
        // fxaa.uniforms['resolution'].value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);
        // render._composer.addPass(fxaa);
        // this.setupFXAAEffect(fxaa);

        var copy = new THREE.ShaderPass(THREE.CopyShader);
        copy.renderToScreen = true;
        render._composer.addPass(copy);

        this.initMaterials();
        this.initLights();

        var bgGeo = new THREE.PlaneGeometry(10000, 10000, 10, 10);
        var bg = new THREE.Mesh(bgGeo, this.matCubeScape);
        bg.position.z = 0;
        this.scene.add(bg);

        this.startTime = Date.now();
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
        this.uniforms = {
            time: { type: 'f', value: 0.1},
            freq0: { type: 'f', value: 0.0},
            freq1: { type: 'f', value: 0.0},
            freq2: { type: 'f', value: 0.0},
            freq3: { type: 'f', value: 0.0},
            iChannel1:  { type: 't', value: THREE.ImageUtils.loadTexture('/static/scenes/cubescape/channel1.jpg') },
            mouse: { type: "v2", value: new THREE.Vector2( 1.0, 1.0 ) },
            iGlobalTime: { type: "f", value: 1.0 },
            iResolution: { type: "v2", value: new THREE.Vector2() }
        };

        this.uniforms.iChannel1.value.wrapS = this.uniforms.iChannel1.value.wrapT = THREE.RepeatWrapping;
        this.uniforms.iResolution.value.x = window.innerWidth;
        this.uniforms.iResolution.value.y = window.innerHeight;

        this.matCubeScape = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: THREE.PenisShader['vertexShader'],
            fragmentShader: THREE.PenisShader['fragmentShader'],
            side:THREE.FrontSide
        });
    }

    loop(){
        var currentTime = Date.now();
        this.matCubeScape.uniforms.iGlobalTime.value = (currentTime - this.startTime) * 0.001;
        this.matCubeScape.uniforms[ 'mouse' ].value = new THREE.Vector2(render._iGlobalTime*0.0005, 1.0 );

        let freqs = {0: 0, 1: 0, 2: 0, 3: 0};
        let wavedata = render.audio.audio_liveWaveformData;
        let freq_indice_length = wavedata.length / 4;

        for(var i = 0; i != wavedata.length; i++) freqs[Math.floor(i/(freq_indice_length))] += wavedata[i];

        this.matCubeScape.uniforms.freq0.value = Math.round((freqs[0] / freq_indice_length)/(wavedata.length/100))/100;
        this.matCubeScape.uniforms.freq1.value = Math.round((freqs[1] / freq_indice_length)/(wavedata.length/100))/100;
        this.matCubeScape.uniforms.freq2.value = Math.round((freqs[2] / freq_indice_length)/(wavedata.length/100))/100;
        this.matCubeScape.uniforms.freq3.value = Math.round((freqs[3] / freq_indice_length)/(wavedata.length/100))/100;

        this.x += 0.0005;
    }
}