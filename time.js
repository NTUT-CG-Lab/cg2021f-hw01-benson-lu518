let container;
let camera, cameraTarget, scene, renderer;
let group, textMesh1, textMesh2, textGeo, material;
let firstLetter = true;

let text = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const height = 15,
    size = 15,
    hover = 30,
    curveSegments = 4,
    bevelThickness = 2,
    bevelSize = 1.5;

let font = null;
const mirror = true;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.set(0, 400, 700);

    cameraTarget = new THREE.Vector3(0, 150, 0);

    // SCENE
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 250, 1400);

    // LIGHTS

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
    dirLight.position.set(0, 0, 1).normalize();
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 100, 90);
    scene.add(pointLight);

    material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true});

    const geometry = new THREE.CircleGeometry( 130, 130 );
    const circleColor = new THREE.MeshBasicMaterial( { color:'#9FC5E8' } );
    const circle = new THREE.Mesh( geometry, circleColor );
   
    group = new THREE.Group();
    group.position.y = 150;
    group.position.x = 0;
    group.add(circle);

    scene.add(group);


    const loader = new THREE.TTFLoader();
    loader.load('/fonts/Arial_Unicode.ttf', function (json) {
        font = new THREE.Font(json);
        text.forEach((textString, index) => {
            createText(textString, index);
        });


    });

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(500, 500),
        new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.5, transparent: true })
    );
    plane.position.y = 0;
    plane.rotation.x = - Math.PI / 2;
    scene.add(plane);

    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // EVENTS

    container.style.touchAction = 'none';
    container.addEventListener('pointerdown', onPointerDown);

    // document.addEventListener('keypress', onDocumentKeyPress);
    // document.addEventListener('keydown', onDocumentKeyDown);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

// function onDocumentKeyDown(event) {

//     if (firstLetter) {

//         firstLetter = false;
//         text = '';

//     }

//     const keyCode = event.keyCode;

//     // backspace

//     if (keyCode === 8) {

//         event.preventDefault();

//         text = text.substring(0, text.length - 1);
//         refreshText();

//         return false;

//     }

// }

// function onDocumentKeyPress(event) {

//     const keyCode = event.which;

//     // backspace

//     if (keyCode === 8) {

//         event.preventDefault();

//     } else {

//         const ch = String.fromCharCode(keyCode);
//         text += ch;

//         refreshText();

//     }

// }

function createText(aa, index) {

    textGeo = new THREE.TextGeometry(aa, {

        font: font,

        size: size,
        height: height,
        curveSegments: curveSegments,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: true

    })
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();


    const angle = -30;
    // 初始計算是由圓心點右方開始計算，因陣列是從 子開始，故初始起點由上方開始計算
    let initAngle = 90;
    const angular =initAngle+(angle*index);

    const geometryA = new THREE.CircleGeometry( 20, 20 );
    const asd = new THREE.MeshBasicMaterial( { color:'#3D85C6' } );
    const asdd = new THREE.Mesh( geometryA, asd );
    asdd.position.x=10;
    asdd.position.y=10;


    textMesh1 = new THREE.Mesh(textGeo, material);
    textMesh1.position.x = parseInt(100*Math.cos((angular*3.2)/ 180),10)-10;
    textMesh1.position.y =parseInt(100*Math.sin((angular*3.2)/ 180),10);
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = 0;




    textMesh1.add(asdd);
    group.add(textMesh1);

    // if (mirror) {

    //     textMesh2 = new THREE.Mesh(textGeo, material);

    //     textMesh2.position.x = centerOffset;
    //     textMesh2.position.y = - hover;
    //     textMesh2.position.z = height;

    //     textMesh2.rotation.x = Math.PI;
    //     textMesh2.rotation.y = Math.PI * 2;

    //     group.add(textMesh2);

    // }

}

// function refreshText() {

//     group.remove(textMesh1);
//     if (mirror) group.remove(textMesh2);

//     if (!text) return;

//     createText();

// }

function onPointerDown(event) {

    if (event.isPrimary === false) return;

    pointerXOnPointerDown = event.clientX - windowHalfX;
    targetRotationOnPointerDown = targetRotation;

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

}

function onPointerMove(event) {

    if (event.isPrimary === false) return;

    pointerX = event.clientX - windowHalfX;
    
    targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
}

function onPointerUp() {

    if (event.isPrimary === false) return;

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

}



function animate() {

    requestAnimationFrame(animate);

    group.rotation.y += (targetRotation - group.rotation.y) * 0.05;

    camera.lookAt(cameraTarget);

    renderer.render(scene, camera);

}

