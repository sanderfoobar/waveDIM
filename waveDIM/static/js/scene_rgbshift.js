// from https://threejs.org/examples/webgl_postprocessing.html

class SceneRGBShift extends Scene {
    constructor() {
        super();
    }

    build(){
        // enable rendering through composer
        this.composer = true;

        this._composer = 
        this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        this._camera.position.z = 0;

        this.scene.fog = new THREE.Fog(0x000000, 1, 1000);

        this.object = new THREE.Object3D();
        this.object.position.z = -180;
        this.scene.add(this.object);

        var geometry = new THREE.SphereGeometry(1, 4, 4);
        var material = new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.FlatShading});

        for (var i = 0; i < 100; i ++) {
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
            mesh.position.multiplyScalar( Math.random() * 400 );
            mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
            this.object.add(mesh);
        }

        this.scene.add(new THREE.AmbientLight(0x222222));

        let light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        this.scene.add(light);

        // postprocessing
        render._composer = new THREE.EffectComposer(render._renderer);
        render._composer.addPass(new THREE.RenderPass(this.scene, render._camera));

        let effect = new THREE.ShaderPass(THREE.DotScreenShader);
        effect.uniforms['scale'].value = 4;
        render._composer.addPass(effect);

        effect = new THREE.ShaderPass(THREE.RGBShiftShader);
        effect.uniforms['amount'].value = 0.0015;
        effect.renderToScreen = true;
        render._composer.addPass(effect);
    }

    loop(){
        this.object.rotation.x += 0.005;
        this.object.rotation.y += 0.01;
    }
}