// Sander Ferdinand 2017

class SceneSpace1 extends Scene {
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
        render._camera.position.z = 2000;
        render._composer.addPass(new THREE.RenderPass(this.scene, render._camera));

        var copy = new THREE.ShaderPass(THREE.CopyShader);
        copy.renderToScreen = true;
        render._composer.addPass(copy);

        this.initMaterials();
        this.initLights();

        var bgGeo = new THREE.PlaneGeometry(10000, 10000, 10, 10);
        var bg = new THREE.Mesh(bgGeo, this.matCubeScape);
        bg.position.z = 0;
        this.scene.add(bg);
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
        this.matCubeScape = new THREE.ShaderMaterial( {
            uniforms: {
                time: { type: 'f', value: 0.1 },
                mouse: { type: "v2", value: new THREE.Vector2( 1.0, 1.0 ) }
            },
            vertexShader: THREE.Star1Shader['vertexShader'],
            fragmentShader: THREE.Star1Shader['fragmentShader'],
            side:THREE.FrontSide
        });
    }

    loop(){
        //this.matSmoke.uniforms[ 'time' ].value = render._iGlobalTime;
        this.matCubeScape.uniforms[ 'time' ].value = render._iGlobalTime*1;
        this.matCubeScape.uniforms[ 'mouse' ].value = new THREE.Vector2(render._iGlobalTime*0.0005, 1.0 );

        this.x += 0.0005;
    }
}