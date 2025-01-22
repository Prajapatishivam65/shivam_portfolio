let scene, camera, renderer, stars;
let positions;
let velocities = [];

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.z = 1;
    camera.rotation.x = Math.PI / 2;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create buffer geometry
    const geometry = new THREE.BufferGeometry();
    positions = new Float32Array(6000 * 3);

    // Initialize stars
    for (let i = 0; i < 6000; i++) {
        const i3 = i * 3;
        positions[i3] = Math.random() * 600 - 300;
        positions[i3 + 1] = Math.random() * 600 - 300;
        positions[i3 + 2] = Math.random() * 600 - 300;
        velocities[i] = 0;
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    // Create star material with a basic circle texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.7,
        map: texture,
    });

    stars = new THREE.Points(geometry, starMaterial);
    scene.add(stars);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    for (let i = 0; i < 6000; i++) {
        const i3 = i * 3;
        velocities[i] += 0.015;
        positions[i3 + 1] -= velocities[i];

        if (positions[i3 + 1] < -200) {
            positions[i3 + 1] = 200;
            velocities[i] = 0;
        }
    }

    stars.geometry.attributes.position.needsUpdate = true;
    stars.rotation.y += 0.003;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();
window.addEventListener("resize", onWindowResize, false);


document.addEventListener('DOMContentLoaded', function () {
    // Get all navigation items
    const navItems = document.querySelectorAll('.nav-item');

    // Add click event listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            // Get the section id from the data-hover attribute
            const sectionId = this.getAttribute('data-hover').toLowerCase();

            // Get the corresponding section
            const section = document.getElementById(sectionId);

            if (section) {
                // Remove active class from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));

                // Add active class to clicked nav item
                this.classList.add('active');

                // Calculate scroll position (accounting for fixed navbar)
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const sectionPosition = section.offsetTop - navHeight - 20;

                // Smooth scroll to section
                window.scrollTo({
                    top: sectionPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optional: Add scroll spy functionality
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;

        // Get all sections
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav items
                navItems.forEach(item => item.classList.remove('active'));

                // Add active class to corresponding nav item
                const correspondingNavItem = document.querySelector(`.nav-item[data-hover="${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}"]`);
                if (correspondingNavItem) {
                    correspondingNavItem.classList.add('active');
                }
            }
        });
    });
});
