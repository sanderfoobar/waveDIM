// from https://threejs.org/examples/misc_controls_orbit.html

class SceneArrows extends Scene {
    constructor() {
        super();
    }

    build(){
        this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

        render._renderer.setClearColor(this.scene.fog.color);
        render._camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        render._composer.addPass(new THREE.RenderPass(this.scene, render._camera));

        this.matrix = new THREE.Matrix4();
        this.geometry = new THREE.BoxGeometry(50, 50, 50);
        this.material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.0});
        this.box = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.box);

        render._camera.position.z = 500;

        // camera controls
        this._controls = new THREE.OrbitControls(render._camera, render._renderer.domElement );
        this._controls.enableZoom = false;

        var copy = new THREE.ShaderPass(THREE.CopyShader);
        copy.renderToScreen = true;
        render._composer.addPass(copy);

        // world
        var geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);
        var material = new THREE.MeshBasicMaterial( { color:0xfffff0 } );

        this.meshes = [];
        this.meshes_group = new THREE.Object3D();

        for (var i = 0; i < 510; i ++) {
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.x = (Math.random() - 0.5) * 1000;
            let y = (Math.random() - 0.5) * 1000;
            this.mesh.position.y = y;
            this.mesh.userData.positionY = y;
            this.mesh.position.z = (Math.random() - 0.5) * 1000;
            this.mesh.updateMatrix();

            this.meshes.push(this.mesh);
            this.meshes_group.add(this.mesh);
        }

        this.scene.add(this.meshes_group);

        // lights
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        this.scene.add( light );

        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        this.scene.add( light );

        light = new THREE.AmbientLight( 0x222222 );
        this.scene.add( light );
    }

    loop(){
        let delta = render._clock.getDelta();
        this.matrix.makeRotationY(delta * 2 * Math.PI / 15);
        render._camera.position.applyMatrix4(this.matrix);
        render._camera.lookAt(this.box.position);
    }
}
