var fluidite = 200;
var cmp = 0;

function initCourbe1() {
    var tableCourbe = new Array(fluidite)
    for (var i = 0; i <= fluidite; i++) {
        let t2 = i / 100 * 2 * Math.PI;
        var x0 = 10 * Math.cos(t2);
        var y0 = 10 * Math.sin(t2);
        var z0 = 0;

        tableCourbe[i] = new THREE.Vector3(x0, y0, z0);
    }
    return tableCourbe
}

//dessine la courbe de trajectoir et le return
function aim(MaScene, objet, target) {
    //Rensseigne les points de controles
    var curve;
    curve = new THREE.CubicBezierCurve(
        objet.getPosition2,
        new THREE.Vector2(target.x /3, target.y ),
        new THREE.Vector2(target.x /2, target.y),
        target
    );
    //Construit virtuellement la courbe avec le nombre de points desire
    var points = curve.getPoints(fluidite);
    //Construit la geometry de la courbe 'points'
    //var arrow = drawVecteur(MaScene, objet.position, new THREE.Vector3(target.x /3, target.y, 0), 0x000000, 1, 1);
    var geometryBezier = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial({ color: 0xFFAA00 });
    var courbe = new THREE.Line(geometryBezier, material);
    courbe.name = "aim";
    MaScene.add(courbe);
    return points;
}
//Allonge la trajectoire
function bruch(menuGUI){ //Ne prend en compte que la derniere valeur (Celle d'arriver)
    var ecM = getEcartMoy();
    var pointsBruched = menuGUI.points;
    var lastIdx = pointsBruched.length -1;
    pointsBruched.push(new THREE.Vector2(pointsBruched[lastIdx].x, pointsBruched[lastIdx].y));
    if(pointsBruched[lastIdx+1].y >0){
        pointsBruched[lastIdx+1].y -=ecM[1];
    } else if(pointsBruched[lastIdx+1].y<0){
        pointsBruched[lastIdx+1].y +=ecM[1];
    } 
    pointsBruched[lastIdx+1].x +=ecM[0];
    return pointsBruched;
}

function deplacePierre(MaScene, menuGUI,pierre, courbe, target, team, tours) {
    document.getElementById("push").innerHTML += "<button onclick='rub()'>BALAIE</button>";
    var anima = setInterval(function () {
        var name = pierre.name;
        if (cmp < courbe.length) {
            var thisPoint = courbe[cmp];
            MaScene.remove(MaScene.getObjectByName(name));
            var pierreFocus = drawPierre(MaScene, menuGUI.color, new THREE.Vector3(thisPoint.x, thisPoint.y, 0), name);
            MaScene.add(pierreFocus);
            menuGUI.camera.position.set(thisPoint.x - 150, thisPoint.y, 35);
            menuGUI.camera.lookAt(pierreFocus.position);
            isColide(MaScene,pierreFocus,tours);
            cmp++;
        }
        if(cmp>=courbe.length){
            team.push(calculPoints(thisPoint,target));
            document.getElementById("score").innerHTML = "<p>"+calculPoints(thisPoint,target)+"</p>";
            cmp = 0;
            clearInterval(anima);
            document.getElementById("push").innerHTML = "";
            setTimeout(function(){
                document.getElementById("push").innerHTML = "<button onclick='nextTurn()'>TOUR SUIVANT</button>";
            }, 1000);
        }
    },20);
}

function calculPoints(position, target){
    return Math.floor((900-position.distanceTo(target))/10);
}

function getCoefMulti(pierre, positionVise) {
    /*Position initial de l'objet*/
    var posPierreX = pierre.position.x;
    var posPierreY = pierre.position.y;

    /*Position d'arriver de l'objet*/
    var posViseX = positionVise.position.x;
    var posViseY = positionVise.position.y;

    return (posViseY - posPierreY) / (posViseX - posPierreX);
}

function getOrigine(coef, point) {
    return point.position.y - (coef * point.position.x)
}

//Affiche l'array a partir de la valeur d'indice start
function afficheArray(ar,start){
    var toReturn = "";
    for (var i=start;i<ar.length;i++){
        toReturn+="("+Math.floor(ar[i].x)+"."+Math.floor(ar[i].y)+") + "+i+"\n";
    }
    return toReturn;
}

//retourne l'ecart moyen entre deux valeur du tableau sous forme d'un array
function getEcartMoy(){
    var ecM = [0,0];
    ecM[0] = (menuGUI.points[menuGUI.points.length-1].x - menuGUI.points[0].x)/fluidite;
    ecM[1] = (menuGUI.points[menuGUI.points.length-1].y - menuGUI.points[0].y)/(fluidite*3);
    return ecM;
}

//Fonction de detection de colision (Ecart entre x et y +1.5 (Rayon de la pierre))
function isColide(MaScene, obj,tours){
    var pos = obj.position;
    var toReturn;
    for(var i = 0 ; i<tours;i++){
        var posPA = MaScene.getObjectByName("pierre-"+i).position;
        if(Math.floor(pos.x) == Math.floor(posPA.x) && Math.floor(pos.y) == Math.floor(posPA.y)){
            toReturn = MaScene.getObjectByName("pierre-"+i);
            console.log("colision avec" + toReturn.name);
            return toReturn;
        }
    }
    return toReturn;
}