//Permet de dessiner un Vecteur
function drawVecteur(MaScene, A, B, coulHexa, longCone, rayonCone) {
    var vecAB = new THREE.Vector3(B.x - A.x, B.y - A.y, B.z - A.z);
    vecAB.normalize(); // ?
    var arrow = new THREE.ArrowHelper(vecAB, A, B.distanceTo(A), coulHexa, longCone, rayonCone);
    arrow.name = "arrow";
    MaScene.add(arrow);
    return arrow;
  }
  //Dessine les flèches des trois axes x,y,z
  function drawRepere(MaScene) {
    var origine = new THREE.Vector3(0, 0, 0);
    var longCone = 0.1;
    var rayonCone = 0.05;
    drawVecteur(MaScene, origine, new THREE.Vector3(900, 0, 0), 0xFF0000, longCone, rayonCone);
    drawVecteur(MaScene, origine, new THREE.Vector3(0, 140, 0), 0x00FF00, longCone, rayonCone);
    drawVecteur(MaScene, origine, new THREE.Vector3(0, 0, 10), 0x0000FF, longCone, rayonCone);
  }
  //Rajoute un cube
  function drawBox(MaScene) {
    var objetGeo = new THREE.BoxGeometry(1, 1, 5);
    var material = new THREE.MeshBasicMaterial({ color: 0x905520 });
    var box = new THREE.Mesh(objetGeo, material);
    box.castShadow = true;
    box.receiveShadow = true;
    box.name = "homme";
    MaScene.add(box);
  }
  
  function drawRing(MaScene) {
    var objetGeo = new THREE.RingGeometry(0.5, 1, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0x525500 })
    var ring = new THREE.Mesh(objetGeo, material);
    MaScene.add(ring);
  }
  
  function drawTorus(MaScene) {
    const geometry = new THREE.TorusGeometry(2, 0.2, 10, 100);
    const material = new THREE.MeshLambertMaterial({ color: 0xFF5265, emissive: 0x0000FF });
    const torusKnot = new THREE.Mesh(geometry, material);
    MaScene.add(torusKnot);
  }
  
  function drawEquateur(MaScene, R, nbPoints, epaisseurCourbe, coul) {
    let points = new Array(nbPoints + 1);
    for (let i = 0; i <= nbPoints; i++) {
      let t2 = i / nbPoints * 2 * Math.PI;
      x0 = R * Math.cos(t2);
      y0 = R * Math.sin(t2);
      z0 = 0;
  
      points[i] = new THREE.Vector3(x0, y0, z0);
    }
    let ptsTab = new THREE.BufferGeometry().setFromPoints(points);
    let propriCourbe = new THREE.LineBasicMaterial({ color: coul, linewidth: epaisseurCourbe }); // ? Warning lineWitdh ?
    let courbe = new THREE.Line(ptsTab, propriCourbe);
    MaScene.add(courbe);
  }
  
  function drawMeridian(MaScene, R, nbPoints, epaisseurCourbe, coul) {
    let points = new Array(nbPoints + 1);
    for (let i = 0; i <= nbPoints; i++) {
      let t2 = i / nbPoints * 2 * Math.PI;
      x0 = R * Math.cos(t2);
      y0 = 0;
      z0 = R * Math.sin(t2);
  
      points[i] = new THREE.Vector3(x0, y0, z0);
    }
    let ptsTab = new THREE.BufferGeometry().setFromPoints(points);
    let propriCourbe = new THREE.LineBasicMaterial({ color: coul, linewidth: epaisseurCourbe }); // ? Warning lineWitdh ?
    let courbe = new THREE.Line(ptsTab, propriCourbe);
    MaScene.add(courbe);
  }

  /* Modelise une lathe selon les points de Bezier */
  function drawLathe(arrayPoints, col){
    var latheGeo = new THREE.LatheGeometry(arrayPoints, 60);
    var material = new THREE.MeshPhongMaterial({color : col, side:THREE.DoubleSide});
    var lathe = new THREE.Mesh(latheGeo,material);
    return lathe;
  }

  function drawPierre(MaScene, colorCenter, position, nom){

    /* Coordonnee des trois pieces de ma pierre et de la prise*/
    var pierreInf = new Array(
      new THREE.Vector2(0,0),
      new THREE.Vector2(2.5,0),
      new THREE.Vector2(2.8,0.5),
      new THREE.Vector2(3,1)
    );
    var pierreMid = new Array(
     new THREE.Vector2(3,1),
     new THREE.Vector2(3,1.5),
     new THREE.Vector2(3,2),
     new THREE.Vector2(3,2)
    );
   
    var pierreSup = new Array(
     new THREE.Vector2(3,2),
     new THREE.Vector2(2.8,2.5),
     new THREE.Vector2(2.5,3),
     new THREE.Vector2(0,3)
    );

    var pierreHand1 = new Array(
      new THREE.Vector2(2,3),
      new THREE.Vector2(1.5,3.3),
      new THREE.Vector2(1,3.4),
      new THREE.Vector2(0,3.4)
     );

     var pierreHand2 = new Array(
      new THREE.Vector2(0,3.4),
      new THREE.Vector2(.2,3.4),
      new THREE.Vector2(.2,3.8),
      new THREE.Vector2(.2,4)
     );

     /**Fin coordonnee**/
    /* Modelisation des parties */
    var inf = drawLathe(pierreInf, 0xFFFFFF);
    var mid = drawLathe(pierreMid, colorCenter);
    var sup = drawLathe(pierreSup, 0xFFFFFF);
    var hand1 = drawLathe(pierreHand1, colorCenter);
    
    /*Fusion des parties*/
    mid.add(inf);
    mid.add(sup);
    mid.add(hand1);
    MaScene.add(mid);
    mid.position.set(position.x,position.y,0);
    mid.rotation.x = Math.PI/2;
    mid.name = nom;
    return mid;
  }

  function drawGame(MaScene){
    
    /*Circuit*/
    var pisteGeo = new THREE.BoxGeometry(1168,300, 1);
    var pisteMaterial = new THREE.MeshBasicMaterial({color : 0xAAAAFF});
    var piste = new THREE.Mesh(pisteGeo, pisteMaterial);
    //ajout piste
    MaScene.add(piste);
    piste.position.set(500,0,-5);

    /*Cible - Maison*/
    var rayon = 32; //4pieds
    var centerGeo = new THREE.RingGeometry(rayon-29, rayon, 100);
    rayon+=32; //8pieds
    var midlleGeo = new THREE.RingGeometry(rayon-32, rayon, 100);
    rayon+=32; //12pieds
    var edgeGeo = new THREE.RingGeometry(rayon-32, rayon, 100);
    var centerMaterial = new THREE.MeshBasicMaterial({color:0xFF0000, side:THREE.DoubleSide});
    var midlleMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF, side:THREE.DoubleSide});
    var edgeMaterial = new THREE.MeshBasicMaterial({color:0x0000FF, side:THREE.DoubleSide});

    var center = new THREE.Mesh(centerGeo,centerMaterial);
    var midlle = new THREE.Mesh(midlleGeo,midlleMaterial);
    var edge = new THREE.Mesh(edgeGeo,edgeMaterial);
    midlle.add(center);
    midlle.add(edge);
    midlle.position.set(900, 0, -.1);
    //Ajout maison
    MaScene.add(midlle);
  }

  function getPosition2(objet){
    var toReturn = new THREE.Vector2(objet.x, objet.y);
    return toReturn;
  }

  