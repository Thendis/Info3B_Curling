var colorTeam1 = 0xff0000;
var colorTeam2 = 0x0000ff;
var target = new THREE.Vector3(900, 0, 0); //Centre de la cible
var tours = 0;
/*MENU GUI*/
var gui = new dat.GUI({autoPlace: false});
var customContainer = document.getElementById('guiCont');
setTimeout(function(){
  customContainer.appendChild(gui.domElement);
}, 100); // Besoin car sinon essai de créer alors que le body n'est pas generé.
var menuGUI = new function () {
  this.force = 0;
  this.courbe = 0;
  this.vision = "";
  this.points = [];
  this.color = 0x000000;
  this.lancer = false;
  this.pushValue = 0;
  this.pierreF = null;
}


function init() {
  /*Initialisation*/
  var stats = initStats();
  let rendu = new THREE.WebGLRenderer({ antialias: true });
  rendu.shadowMap.enabled = true;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000000);
  rendu.shadowMap.enabled = true;
  rendu.setClearColor(new THREE.Color(0x000000));
  rendu.setSize(window.innerWidth, window.innerHeight);
  cameraLumiere(scene, camera);
  lumiere(scene, camera);
  camera.position.set(-400, 0, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  drawRepere(scene);
  /*fin Initialisation*/

  /*Parametres de lancer*/
  var param = gui.addFolder("Parametres");
  param.add(menuGUI, 'force', 1, 350).onChange(function () {
    scene.remove(scene.getObjectByName("aim"));
    menuGUI.points = aim(scene, menuGUI.pierreF, new THREE.Vector2(menuGUI.force, menuGUI.courbe));
  });
  param.add(menuGUI, 'courbe', -30, 30).onChange(function () {
    scene.remove(scene.getObjectByName("aim"));
    menuGUI.points = aim(scene, menuGUI.pierreF, new THREE.Vector2(menuGUI.force, menuGUI.courbe));
  });
  param.add(menuGUI, 'vision', ["Standard", "Cible", "Large"]).onChange(function (e) {
    if (menuGUI.vision == "Standard") {
      camera.position.set(-400, 0, 100);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    } else if (menuGUI.vision == "Cible") {
      camera.position.set(900, 0, 600);
      camera.lookAt(target);
    } else if (menuGUI.vision == "Large") {
      camera.position.set(-400, -800, 2000);
      camera.lookAt(new THREE.Vector3(500, 0, 0));
    }
  });
  param.add(menuGUI, 'lancer').onChange(function (e) {
    if (e) {
      deplacePierre(scene, menuGUI, menuGUI.pierreF, menuGUI.points, target, camera);
      menuGUI.lancer = false;
      document.getElementById("push").innerHTML += "<button onclick='nextTurn()'>Tour suivant</button>";
    }
  });
  /*Fin parametres de lancer */
  /*FIN GUI*/
  var game = setInterval(function () {
    if (tours < 10) {
      if (menuGUI.pierreF == null) {
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
    document.getElementById("tours").innerHTML = "<p>Tours : " + (tours + 1) + "</p>";
    //A qui de jouer
    if (tours % 2 == 0) {
      menuGUI.color = colorTeam1;
    } else {
      menuGUI.color = colorTeam2;
    }
    drawGame(scene);
    menuGUI.pierreF = drawPierre(scene, menuGUI.color, new THREE.Vector3(0, 0, 0), "pierre-" + menuGUI.color + "-" + tours);
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

//N'actualise pas la caméra
function nextTurn() {
  for(menuGUI.pushValue; menuGUI.pushValue>0; menuGUI.pushValue-=1){
    menuGUI.points.pop();
  }
  document.getElementById("push").innerHTML = "";
  menuGUI.pierreF = null;
  tours++;
}

function pushMe() {
  for (var i = 0; i < 10; i++) {
    menuGUI.pushValue+=1;
    menuGUI.points = bruch(menuGUI);
  }
}