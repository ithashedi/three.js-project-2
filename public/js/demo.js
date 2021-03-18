import * as THREE from '/build/three.module.js';

const context = new AudioContext();

// Define configurables
const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;
const SPEED = 0.01;

let theta = 0;
const radius = 10;

// Global representing intersected object
let INTERSECTED;

// Define global variables required for scene
let canvas, camera, scene, renderer, material, geometry, spheres, light;

// Define raycaster and vector representing mouse position
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Data defining the properties of the musical instrument interface controls
const controls = [
    { color: "red", note: "A4" },
    { color: "orange", note: "B4" },
    { color: "yellow", note: "C4" },
    { color: "green", note: "D4" },
    { color: "blue", note: "E4" },
    { color: "indigo", note: "F4" },
    { color: "violet", note: "G4" }
];

// ------------------------------- Audio -------------------------------------

function playNote(note) {
    let synth = new Tone.AMSynth().toMaster();
    synth.triggerAttackRelease(note, "8n");
}

// ---------------------------------------------------------------------------

// ------------------------------ Graphics -----------------------------------

function rotateObject(obj) {
    obj.rotation.x -= SPEED * 2;
    obj.rotation.y -= SPEED;
    obj.rotation.z -= SPEED * 3;
}

function rotateCamera(theta) {
    theta += 0.1;
    camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
    camera.lookAt( scene.position );
	camera.updateMatrixWorld();
    return theta;
}

// ---------------------------------------------------------------------------

// ------------------ Functions responding to user events --------------------

function onMouseMove( event ) {
/*  function calculates mouse position in normalized device 
    coordinates (-1 to +1) for both components 
*/
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// One-liner to resume playback when user interacted with the page.
window.addEventListener('click', function() {
    context.resume().then(() => {
        let info = document.getElementById("info");
        info.style.display = "none";
    });
});

// ---------------------------------------------------------------------------

// ---------------------- Initialisation of the scene ------------------------

function init() {

    canvas = document.getElementById("canvas-container");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer();

    spheres = new Array(7);
    controls.forEach( function(value, i) {
        let geo = new THREE.BoxGeometry();//(1, 32, 32);
        let material = new THREE.MeshStandardMaterial( { color: controls[i].color, name: controls[i].note } );
        spheres[i] = new THREE.Mesh( geo, material ); 
        spheres[i].position.x = 5 * Math.sin((Math.PI*2/7) * i);
        spheres[i].position.y = 5 * Math.cos((Math.PI*2/7) * i);
        scene.add( spheres[i] );
    });

    light = new THREE.DirectionalLight( 0xffffff, 1, 200, 100 );
    light.position.set( 0, 10, 20 );
    scene.add( light );
    renderer.setClearColor(new THREE.Color(0x000000)); // set background colour
    renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
    camera.position.z = 10;
    canvas.appendChild( renderer.domElement );
}

// ------------------------------ Animation loop -----------------------------

function animate() {

    renderer.render( scene, camera );

    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            INTERSECTED = intersects[ 0 ].object; // set INTERSECTED to be first object picked up by ray caster
            if (context.state == 'running') playNote(INTERSECTED.material.name);
        }
    } else {
        INTERSECTED = null;
    }

    spheres.forEach( function(value) {
        rotateObject(value);
    });

    //theta = rotateCamera(theta);

    requestAnimationFrame( animate );                               
}            

// Calls onMouseMove in response to mousemove event
window.addEventListener( 'mousemove', onMouseMove, false );

init();
animate();
