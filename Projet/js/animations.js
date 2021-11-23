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

function deplacePierre(MaScene, menuGUI,pierre, courbe, camera) {
    var anima = setInterval(function () {
        var name = pierre.name;
        var color;
        menuGUI.controls.enabled = false;
        if (cmp < fluidite) {
            var thisPoint = courbe[cmp];
            MaScene.remove(MaScene.getObjectByName(name));
            var pierreFocus = drawPierre(MaScene, menuGUI.color, new THREE.Vector3(thisPoint.x, thisPoint.y, 0), name);
            MaScene.add(pierreFocus);
            camera.position.set(thisPoint.x - 150, thisPoint.y, 35);
            camera.lookAt(pierreFocus.position);
            cmp++;
        }
        if(cmp>fluidite){
            cmp = 0;
            clearInterval(anima);
        }
    },20);
    setTimeout(function(){
        camera.position.set(-400, 0, 100);
        camera.lookAt(new THREE.Vector3(0,0,0));
        menuGUI.controls.enabled = true; // /!\ Ne reactive pas l'orbitControl
    }, 6000);
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