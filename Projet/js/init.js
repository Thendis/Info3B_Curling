var colorTeam1 = 0xff0000;
var colorTeam2 = 0x0000ff;
var target = new THREE.Vector3(900,0,0);
var tours = 0;


function init() {
  /*Initialisation*/
  var stats = initStats();
  let rendu = new THREE.WebGLRenderer({ antialias: true });
  rendu.shadowMap.enabled = true;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000000);
  var pierreF = null;
  rendu.shadowMap.enabled = true;
  rendu.setClearColor(new THREE.Color(0x000000));
  rendu.setSize(window.innerWidth, window.innerHeight);
  cameraLumiere(scene, camera);
  lumiere(scene, camera);
  camera.position.set(-400, 0, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  drawRepere(scene);
  /*fin Initialisation*/
  /*MENU GUI*/
  var gui = new dat.GUI();
  var menuGUI = new function () {
    this.force = 0;
    this.courbe = 0;
    this.vision ="";
    this.points;
    this.color = 0x000000;
    this.lancer = false;
  }
  /*Parametres de lancer*/
  var param = gui.addFolder("Parametres");
  param.add(menuGUI, 'force', 1, 1000).onChange(function () {
    scene.remove(scene.getObjectByName("aim"));
    menuGUI.points = aim(scene, pierreF, new THREE.Vector2(menuGUI.force, menuGUI.courbe));
  });
  param.add(menuGUI, 'courbe', -50, 50).onChange(function () {
    scene.remove(scene.getObjectByName("aim"));
    menuGUI.points = aim(scene, pierreF, new THREE.Vector2(menuGUI.force, menuGUI.courbe));
  });
  param.add(menuGUI, 'vision',["Standard", "Cible"]).onChange(function(e){
    if(menuGUI.vision=="Standard"){
      camera.position.set(-400, 0, 100);
      camera.lookAt(new THREE.Vector3(0,0,0));
    } else if (menuGUI.vision=="Cible"){
      camera.position.set(900, 0, 600);
      camera.lookAt(target);
    }else{

    }
  });
  param.add(menuGUI, 'lancer').onChange(function (e) {
    if (e) {
      deplacePierre(scene, menuGUI, pierreF, menuGUI.points, target,camera);
      menuGUI.lancer = false;
      setTimeout(function () {
        pierreF = null;
        tours++;
      }, 7000);

    }
  });
  /*Fin parametres de lancer */
  /*FIN GUI*/
  var game = setInterval(function () {
    if(tours<10){
      if (pierreF == null) {
        gameSet();
      }
    } else {
      alert("Arret : La fonction de fin n'a pas ete implemente");
    }
  }, 100);
  document.getElementById("webgl").appendChild(rendu.domElement);
  rendu.render(scene, camera);
  renduAnim();

  //Va modéliser le terrain et la pierre en accord avec le moment du jeu
  function gameSet() {
    document.getElementById("tours").innerHTML = "<p>Tours : "+(tours+1)+"</p>";
    //A qui de jouer
    if (tours % 2 == 0) {
      menuGUI.color = colorTeam1;
    } else {
      menuGUI.color = colorTeam2;
    }
    drawGame(scene);
    pierreF = drawPierre(scene, menuGUI.color, new THREE.Vector3(0, 0, 0), "pierre-" + menuGUI.color + "-" + tours);
  }

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

}




