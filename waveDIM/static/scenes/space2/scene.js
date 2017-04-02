// Sander Ferdinand 2017

class SceneSpace2 extends Scene {
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

        var copy = new THREE.ShaderPass(THREE.CopyShader);
        copy.renderToScreen = true;
        render._composer.addPass(copy);

        this.initMaterials();
        this.initLights();

        var bgGeo = new THREE.PlaneGeometry(10000, 10000, 10, 10);
        var bg = new THREE.Mesh(bgGeo, this.matStar2);
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
        this.uniforms = {
            iGlobalTime: { type: "f", value: 1.0 },
            iResolution: { type: "v2", value: new THREE.Vector2() }
        };

        this.uniforms.iResolution.value.x = window.innerWidth;
        this.uniforms.iResolution.value.y = window.innerHeight;

        this.matStar2 = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: THREE.Star2Shader['vertexShader'],
            fragmentShader: THREE.Star2Shader['fragmentShader'],
            side:THREE.FrontSide
        });
    }

    loop(){
        this.matStar2.uniforms[ 'iGlobalTime' ].value = render._iGlobalTime*1;

        this.x += 0.0005;
    }
}