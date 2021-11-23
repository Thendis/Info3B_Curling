var xDir=0;
var yDir=0;
var zDir=0.25;
 
function cameraLumiere(scene,camera){   // creation de la camera 
 camera.up = new THREE.Vector3( 0, 0, 1 );
 let xPos=3;
 let yPos=3;
 let zPos=3;
 camera.position.set(xPos, yPos, zPos);
 camera.lookAt(xDir, yDir, zDir);
 camera.updateProjectionMatrix();
} // fin fonction cameraLumiere




function lumiere(scene, camera){
   let lumPt = new THREE.PointLight(0xffffff);
   lumPt.position.set(camera.position.x,camera.position.y,camera.position.z);
   lumPt.intensity = 1;
   lumPt.shadow.camera.far=2000;
   lumPt.shadow.camera.near=0;
   lumPt.name = "lumCam";
   scene.add(lumPt);
}// fin fonction lumiere