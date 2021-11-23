var colorTeam1 = 0xff0000;
var colorTeam2 = 0x0000ff;
var tours=0;


function init() {
  /*Initialisation*/
  var stats = initStats();
  var courbeTourne = initCourbe1();
  let rendu = new THREE.WebGLRenderer({ antialias: true });
  rendu.shadowMap.enabled = true;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000000);
  rendu.shadowMap.enabled = true;
  rendu.setClearColor(new THREE.Color(0x000000));
  rendu.setSize(window.innerWidth * .9, window.innerHeight * .9);
  cameraLumiere(scene, camera);
  lumiere(scene, camera);
  camera.position.set(-400, 0, 100);
  camera.lookAt(new THREE.Vector3(0,0,0));
  drawRepere(scene);
  /*fin Initialisation*/
  /*MENU GUI*/
  var gui = new dat.GUI();
  var menuGUI = new function () {
    this.force = 0;
    this.courbe=0;
    this.points;
    this.color = 0x000000;
    this.lancer = false;
    this.controls = new THREE.OrbitControls(camera, rendu.domElement);
  }
  /*Parametres de lancer*/
  var param = gui.addFolder("Parametres");
  param.add(menuGUI,'force', 0,1000).onChange(function(){
    scene.remove(scene.getObjectByName("aim"));
    menuGUI.points = aim(scene, pierreF, new THREE.Vector2(menuGUI.force, menuGUI.courbe))
    tours++;
  });
  param.add(menuGUI,'courbe', -50,50).onChange(function(){
    scene.remove(scene.getObjectByName("aim"));
    menuGUI.points = aim(scene, pierreF, new THREE.Vector2(menuGUI.force, menuGUI.courbe))
    tours++;
  });
  param.add(menuGUI, 'lancer' ).onChange(function(e){
    if(e){
      deplacePierre(scene, menuGUI,pierreF, menuGUI.points, camera);
      menuGUI.lancer = false;
      tours++;
    }
  })
  /*Fin parametres de lancer */
  /*Compteur de tours */
  if(tours%2 == 0){
    menuGUI.color = colorTeam1;
  } else {
    menuGUI.color=colorTeam2;
  }

  /*FIN GUI*/
  document.getElementById("webgl").appendChild(rendu.domElement);

  // affichage de la scene
  rendu.render(scene, camera);
  drawGame(scene);
  var pierreF = drawPierre(scene, menuGUI.color, new THREE.Vector3(0, 0, 0), "pierreTest");

  renduAnim();


  function renduAnim() {
    stats.update();
    //La lumière suit la cam
    scene.remove(scene.getObjectByName("lumCam"));
    lumiere(scene, camera);
    //

    // render avec requestAnimationFrame
    requestAnimationFrame(renduAnim);
    // ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }

} // fin fonction init()