// login3d.js - Cinematic 3D Bitcoin Animation & Transitions

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(init3DScene, 100));
} else {
  setTimeout(init3DScene, 100);
}

function init3DScene() {
  const canvas = document.getElementById('coinCanvas');
  if (!canvas) return;

  // Move canvas to body so it acts as the global background
  document.body.appendChild(canvas);
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '10001'; // Above intro scene initially
  canvas.style.pointerEvents = 'none';

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 15);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffefcc, 1.5);
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffe6b3, 1.2);
  dirLight2.position.set(-5, -5, 5);
  scene.add(dirLight2);

  const pointLight = new THREE.PointLight(0xffffff, 1, 20);
  pointLight.position.set(0, 5, 2);
  scene.add(pointLight);

  // Materials & Geometry for Coins
  const textureLoader = new THREE.TextureLoader();
  const coinTexture = textureLoader.load('images/bitcoin_texture.png');
  coinTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  
  const radius = 3;
  const tube = 0.4;
  
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    metalness: 0.7,
    roughness: 0.1,
    emissive: 0x332200,
  });

  const faceMaterial = new THREE.MeshBasicMaterial({
    map: coinTexture,
    color: 0xffffff,
  });

  function createCoinMesh() {
    const coinGroup = new THREE.Group();

    const rimGeom = new THREE.TorusGeometry(radius - 0.2, tube / 2, 16, 64);
    const rim = new THREE.Mesh(rimGeom, rimMaterial);
    coinGroup.add(rim);

    const edgeGeom = new THREE.CylinderGeometry(radius - 0.2, radius - 0.2, tube, 64, 1, true);
    edgeGeom.rotateX(Math.PI / 2);
    const edge = new THREE.Mesh(edgeGeom, rimMaterial);
    coinGroup.add(edge);

    const faceGeom = new THREE.CircleGeometry(radius - 0.2, 64);
    const frontFace = new THREE.Mesh(faceGeom, faceMaterial);
    frontFace.position.z = tube / 2;
    coinGroup.add(frontFace);

    const backFace = new THREE.Mesh(faceGeom, faceMaterial);
    backFace.position.z = -tube / 2;
    backFace.rotation.y = Math.PI; // flip it
    coinGroup.add(backFace);

    return coinGroup;
  }

  // --- Intro Coin ---
  const introCoin = createCoinMesh();
  introCoin.position.y = -10; // Start below screen
  introCoin.rotation.x = Math.PI / 2; // Flat
  scene.add(introCoin);

  // --- Falling Coins (Main Background) ---
  const fallingCoins = [];
  const COIN_COUNT = 75; // Heavy flow
  
  for (let i = 0; i < COIN_COUNT; i++) {
    const mesh = createCoinMesh();
    // Varing scales for depth effect - medium-small
    const s = THREE.MathUtils.randFloat(0.18, 0.45);
    mesh.scale.set(s, s, s);
    mesh.visible = false;
    scene.add(mesh);
    
    fallingCoins.push({
      mesh,
      y: 0,
      speed: THREE.MathUtils.randFloat(0.05, 0.15),
      rotX: THREE.MathUtils.randFloat(-0.05, 0.05),
      rotY: THREE.MathUtils.randFloat(-0.05, 0.05),
      rotZ: THREE.MathUtils.randFloat(-0.05, 0.05)
    });
  }

  function resetFallingCoin(c) {
    c.mesh.position.x = THREE.MathUtils.randFloat(-15, 15);
    c.mesh.position.y = THREE.MathUtils.randFloat(10, 20);
    c.mesh.position.z = THREE.MathUtils.randFloat(-10, 5);
    c.mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
  }

  let introPhase = true;
  let isAnimating = true;

  // Add mouse listener on the whole screen for subtle global parallax
  let targetCamX = 0;
  let targetCamY = 0;
  window.addEventListener('mousemove', (e) => {
    // Normalized mouse coordinates (-1 to +1)
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    targetCamX = nx * 1.5; 
    targetCamY = ny * 1.5;
  });

  // Animation Loop
  function animate() {
    if (isAnimating) {
      requestAnimationFrame(animate);
    }

    if (!introPhase) {
      // Animate falling coins
      for (const c of fallingCoins) {
        c.mesh.position.y -= c.speed;
        
        // Slight wobble
        c.mesh.position.x += Math.sin(Date.now() * 0.001 + c.speed * 100) * 0.005;

        c.mesh.rotation.x += c.rotX;
        c.mesh.rotation.y += c.rotY;
        c.mesh.rotation.z += c.rotZ;

        if (c.mesh.position.y < -15) {
          resetFallingCoin(c);
        }
      }
      
      // Apply parallax to main camera
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ===== GSAP ANIMATION SEQUENCE =====
  
  // 1. Toss the coin up and spin
  gsap.to(introCoin.position, {
    y: 0,
    duration: 2,
    ease: "power3.out"
  });

  gsap.to(introCoin.rotation, {
    x: Math.PI * 8, // spin multiple times
    y: Math.PI * 4,
    z: 0,
    duration: 2.5,
    ease: "power2.out",
    onComplete: () => {
      // 2. Align coin facing forward
      gsap.to(introCoin.rotation, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.inOut"
      });
      
      // 3. Smooth scale up
      gsap.to(introCoin.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: morphToUI
      });
    }
  });

  function morphToUI() {
    // Hide intro coin
    introCoin.visible = false;
    
    // Start falling coins phase
    introPhase = false;
    for (const c of fallingCoins) {
      resetFallingCoin(c);
      c.mesh.position.y = THREE.MathUtils.randFloat(-15, 15);
      c.mesh.visible = true;
    }

    // Send canvas to background
    canvas.style.zIndex = '0'; // Behind login gate

    // 4. Fade out the intro scene and show the login UI
    const introScene = document.getElementById('introScene');
    if (introScene) {
      gsap.to(introScene, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          introScene.style.display = 'none';
        }
      });
    }

    const loginGate = document.getElementById('loginGate');
    if (loginGate) {
      loginGate.classList.remove('hidden-initially');
    }
    
    // Animate the login box coming in
    const loginBox = document.getElementById('loginBox');
    if (loginBox) {
      gsap.fromTo(loginBox, 
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.2)", delay: 0.2 }
      );
    }
  }
}
