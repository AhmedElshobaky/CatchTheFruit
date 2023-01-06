import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const renderer = new THREE.WebGLRenderer();
var isPlaying  = false;
// if button clicked start animation
const button = document.getElementById("start");

renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
const orbit = new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper( 3 );


scene.add( axesHelper );
camera.position.set( 0, 30, 40 );
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const box = new THREE.Mesh( boxGeometry, boxMaterial )
scene.add(box);

// create fruit basket geometry
const basketGeometry = new THREE.CylinderGeometry( 4, 2, 2, 100,1, true );
const basketMaterial = new THREE.MeshStandardMaterial( { color: 0x8b4513, wireframe: false } );
const basketInnerMaterial = new THREE.MeshStandardMaterial( { color: 0x8b4513, wireframe: false, side: THREE.BackSide} );


const basketBottom = new THREE.CircleGeometry( 3, 100 );
const basketBottomMaterial = new THREE.MeshBasicMaterial( { color: 0x8b4513, wireframe: false } );
const basketBottomMesh = new THREE.Mesh( basketBottom, basketBottomMaterial );
basketBottomMesh.rotation.x = -0.5 * Math.PI;

const basketInner = new THREE.Mesh( basketGeometry, basketInnerMaterial );
const basket = new THREE.Mesh( basketGeometry, basketMaterial );
basket.add( basketInner );
basket.add( basketBottomMesh );
basket.position.set( 0, 1, 0 );
scene.add( basket );
basket.castShadow = true;


const planeGeometry = new THREE.PlaneGeometry( 30, 30 );
const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x = -0.5 * Math.PI;
scene.add( plane );
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper( 30 );
scene.add( gridHelper );

const sphereGeometry = new THREE.SphereGeometry( 1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0x0000ff, wireframe: false } );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.position.set( -8, 20, 0 );
sphere.castShadow = true;

const ambiantLight = new THREE.AmbientLight( 0x333333, 1);
scene.add( ambiantLight );

// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8);
// scene.add( directionalLight );
// directionalLight.position.set( -30, 50, 0 );
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -10;


// const dLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5);
// scene.add( dLightHelper );

// const dLightShadowHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
// scene.add( dLightShadowHelper );

const spotLight = new THREE.SpotLight( 0xffffff, 1);
scene.add( spotLight );
spotLight.position.set( -30, 70, 0 );
spotLight.castShadow = true;
spotLight.angle = 0.3;


const sLightHelper = new THREE.SpotLightHelper( spotLight );
scene.add( sLightHelper );


const gui = new dat.GUI();

const options = {
    sphereColor: 0x0000ff,
    wireframe: false,
    speed: 0.05
};

gui.addColor( options, 'sphereColor' ).onChange(function(e){
    sphere.material.color.set(e);
})

gui.add( options, 'wireframe' ).onChange(function(e){
    sphere.material.wireframe = e;
})

gui.add( options, 'speed', 0, 0.1, 0.001 );
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

var positionX = basket.position.x;
var positionZ = basket.position.z;


var moveX  = 0;
var moveZ = 0;


function onKeyDown(event) {
  if (event.keyCode == 37) {
    moveX = -0.2;
  }
  if (event.keyCode == 39) {
    moveX = 0.2;
  }
  if (event.keyCode == 38) {
    moveZ = -0.2;
  }
    if (event.keyCode == 40) {
    moveZ = 0.2;
    }
}

function onKeyUp(event) {
  if (event.keyCode == 37) {
    moveX = 0;
  }
  if (event.keyCode == 39) {
    moveX = 0;
  }
    if (event.keyCode == 38) {
    moveZ = 0;
    }
    if (event.keyCode == 40) {
    moveZ = 0;
    }
}
function getRandomColor(){
  return Math.random()*0xffffff;
}
function updateBasketPosition() {
  positionX += moveX;
  positionZ += moveZ;

  if (positionX < -10) {
    positionX = -10;
  }else if(positionX > 10) {
    positionX = 10;
  }

  if (positionZ < -10) {
    positionZ = -10;
  }else if(positionZ > 10) {
    positionZ = 10;
  }

  basket.position.x = positionX;
  basket.position.z = positionZ;
}
var counter = 0;
function updateSpherePosition() {
    sphere.position.y -= options.speed;
    if (sphere.position.y <1 ) {
        // if sphere is in the basket counter increases by 1
        if (sphere.position.x > basket.position.x - 4 &&
            sphere.position.x < basket.position.x + 4 &&
            sphere.position.z > basket.position.z - 4 &&
            sphere.position.z < basket.position.z + 4
            ) {
            scene.remove(sphere);
            sphere.position.x = Math.random() * 20 - 10;
            sphere.position.z = Math.random() * 20 - 10;
            sphere.position.y = 20;
            sphere.material.color.set(getRandomColor());
            scene.add(sphere);
            counter++;
            if (counter % 3 == 0) {
                options.speed += 0.01;
            }
            
        }else{
            isPlaying = false;
            const msg = document.getElementById("gameOver");
            msg.style.display = "block";
            scene.remove(sphere);
        }
        document.getElementById("counter").innerHTML = '<p>Score: '+counter+ ' <br><br> Level: ' + ((options.speed.toFixed(2).slice(2)) - 4)+ '</p>';

    }
}

button.addEventListener("click", function(){
    counter = 0;
    sphere.material.color.set(getRandomColor());
    scene.add(sphere);
    button.style.display = "none";
    isPlaying = true;
});
function animate() {

    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    updateBasketPosition();
    if(isPlaying){
        updateSpherePosition();
    }
    

    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );



