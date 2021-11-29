var colorTeam1 = "#ff0000";
var colorTeam2 = "#0000ff";
var scoreTeam1 = [];
var scoreTeam2 = [];
var target = new THREE.Vector3(900, 0, 0); //Centre de la cible
var tours = 0;
/*MENU GUI*/
var gui = new dat.GUI({ autoPlace: false });
var customContainer = document.getElementById('guiCont');
setTimeout(function () {
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
  this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000000);
  this.scoreTeam = [];
}

function init() {
  /*Initialisation*/
  var stats = initStats();
  let rendu = new THREE.WebGLRenderer({ antialias: true });
  rendu.shadowMap.enabled = true;
  let scene = new THREE.Scene();
  rendu.shadowMap.enabled = true;
  rendu.setClearColor(new THREE.Color(0x000000));
  rendu.setSize(window.innerWidth, window.innerHeight);
  cameraLumiere(scene, menuGUI.camera);
  lumiere(scene, menuGUI.camera);
  menuGUI.camera.position.set(-400, 0, 100);
  menuGUI.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
      menuGUI.camera.position.set(-400, 0, 100);
      menuGUI.camera.lookAt(new THREE.Vector3(0, 0, 0));
    } else if (menuGUI.vision == "Cible") {
      menuGUI.camera.position.set(900, 0, 600);
      menuGUI.camera.lookAt(target);
    } else if (menuGUI.vision == "Large") {
      menuGUI.camera.position.set(-400, -800, 2000);
      menuGUI.camera.lookAt(new THREE.Vector3(500, 0, 0));
    }
  });
  param.add(menuGUI, 'lancer').onChange(function (e) {
    if (e) {
      deplacePierre(scene, menuGUI, menuGUI.pierreF, menuGUI.points, target, menuGUI.scoreTeam, tours);
      menuGUI.lancer = false;
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
  rendu.render(scene, menuGUI.camera);
  renduAnim();

  //Va modéliser le terrain et la pierre en accord avec le moment du jeu
  function gameSet() {
    document.getElementById("tours").innerHTML = "<p>Tours : " + (tours + 1) + "</p>";
    //A qui de jouer
    if (tours % 2 == 0) {
      menuGUI.color = colorTeam1;
      menuGUI.scoreTeam = scoreTeam1;
    } else {
      menuGUI.color = colorTeam2;
      menuGUI.scoreTeam = scoreTeam2;
    }
    drawGame(scene);
    menuGUI.pierreF = drawPierre(scene, menuGUI.color, new THREE.Vector3(0, 0, 0), "pierre-" + tours);
  }

  function renduAnim() {
    stats.update();
    //La lumière suit la cam
    scene.remove(scene.getObjectByName("lumCam"));
    lumiere(scene, menuGUI.camera);
    //

    // render avec requestAnimationFrame
    requestAnimationFrame(renduAnim);
    // ajoute le rendu dans l'element HTML
    rendu.render(scene, menuGUI.camera);
  }

}

//Met en place le tour suivant
function nextTurn() {
  for (menuGUI.pushValue; menuGUI.pushValue > 0; menuGUI.pushValue -= 1) {
    menuGUI.points.pop();
  }
  document.getElementById("push").innerHTML = "";
  menuGUI.pierreF = null;
  menuGUI.camera.position.set(-400, 0, 100);
  menuGUI.camera.lookAt(new THREE.Vector3(0, 0, 0));
  if (tours % 2 == 0) {
    document.getElementById("scoreTeam1").innerHTML = "<div>"+buildTable(menuGUI.scoreTeam)+"</div>";
  } else {
    document.getElementById("scoreTeam2").innerHTML = "<div>"+buildTable(menuGUI.scoreTeam)+"</div>";
  }
  tours++;
}

//Effectue x brossages
function rub() {
  for (var i = 0; i < 10; i++) {
    menuGUI.pushValue += 1;
    menuGUI.points = bruch(menuGUI);
  }
}

//renvoie un String contenant l'affichage des resultat sous forme de <table>
function buildTable(table){
  var toReturn = "<table style='color:"+menuGUI.color+"'><tbody><tr>";
  for(var i=0; i< table.length;i++){
    toReturn += "<td>"+table[i]+"</td>"
  }
  toReturn +="</tr></tbody></table>"
  return toReturn;
}