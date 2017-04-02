// Sander Ferdinand 2017

class Scene {
    constructor(){
        this.f = 0;
        this.scene = new THREE.Scene();
        render._renderer.setClearColor(0x00);

        this.build();
    }

    teardown(){
        this.scene.children.forEach(function(object){
            this.scene.remove(object);
        }.bind(this));

        for (var property in this) {
            if (this.hasOwnProperty(property)) {
                if(property == "dispose"){
                    this[property]();
                }
            }
        }

        if(render._composer) {
            console.log("composer");
            console.log(render._composer.passes.length);
        }

        console.log("teardown");
        render._composer.passes = [];
    }
}

class RenderStuff {
    constructor() {
        // Test WebGL compatibility
        if (!Detector.webgl) Detector.addGetWebGLMessage();

        this.scene = null;
        this.scenes = {
            "waveform": SceneWaveform,
            "arrows": SceneArrows,
            "space1": SceneSpace1,
            "space2": SceneSpace2,
            "cubescape": SceneCubescape
        };

        this._camera = null;
        this._controls = null;
        this._frame_id = null;

        // ShaderToy
        this.iResolution = { type: "v2", value: new THREE.Vector3() };
        this.iResolution.value.x = window.innerWidth;
        this.iResolution.value.y = window.innerHeight;

        this._renderer = new THREE.WebGLRenderer({antialias: true});
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        //this._renderer.shadowMapEnabled = true;
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._container = document.getElementById('container');
        this._container.appendChild(this._renderer.domElement);
        this._composer = new THREE.EffectComposer(this._renderer);

        this._clock = new THREE.Clock();
        this._fps = 30;
        this._iGlobalTime = -1;

        this.audio = new WaveDIMAudio();
        this._eventlisten_resize = false;
    }

    start(scene){
        if(this.scene){
            if(this._frame_id) cancelAnimationFrame(this._frame_id);
            this.scene.teardown();
        }
        this.scene = scene;

        render._composer.setSize(window.innerWidth, window.innerHeight);

        if(!render._eventlisten_resize) {
            render.onWindowResize();
            window.addEventListener('resize', render.onWindowResize.bind(this), false);
            this._eventlisten_resize = true;
        }

        this.animate();
    }
    
    animate(){
        this._frame_id = requestAnimationFrame(this.animate.bind(this));

        if(this._controls) {
            this._controls.update();
        }

        this.render();
    }

    render(){
        // update audio freq data
        render.audio.audio_analyzer.getByteFrequencyData(render.audio.audio_liveWaveformData);
        
        this.scene.loop();

        this._iGlobalTime = this._clock.getElapsedTime();

        if(this.scene.composer) {
            //this._composer.render();  # doesnt work :(
            this._renderer.render(this.scene.scene, this._camera);
        } else {
            this._renderer.render(this.scene.scene, this._camera);
        }
    }

    teardown(){
        this.audio.stop();
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize(event) {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(window.innerWidth, window.innerHeight);

        this.iResolution.value.x = window.innerWidth;
        this.iResolution.value.y = window.innerHeight;
        //this._composer.setSize(render._renderer.getSize().width, render._renderer.getSize().height);
    }
}