let searchCount = 0;

// Initialize Three.js globe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globe').appendChild(renderer.domElement);

// Create globe geometry
const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);
camera.position.z = 10;

// Animation loop for rotating the globe
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the globe
    globe.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();

// Add event listeners for dragging the globe
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', (event) => {
   isDragging = true;
});

document.addEventListener('mouseup', () => {
   isDragging = false;
});

document.addEventListener('mousemove', (event) => {
   if (isDragging) {
       const deltaMove = {
           x: event.offsetX - previousMousePosition.x,
           y: event.offsetY - previousMousePosition.y
       };

       // Rotate the globe based on mouse movement
       globe.rotation.y += deltaMove.x * 0.01; // Adjust sensitivity as needed
       globe.rotation.x += deltaMove.y * 0.01; // Adjust sensitivity as needed

       // Limit vertical rotation
       if (globe.rotation.x > Math.PI / 2) globe.rotation.x = Math.PI / 2;
       if (globe.rotation.x < -Math.PI / 2) globe.rotation.x = -Math.PI / 2;

       previousMousePosition = { x: event.offsetX, y: event.offsetY };
   }
});

// Search functionality
document.getElementById('search').addEventListener('input', function() {
   const query = this.value.trim();
   
   if (query.length > 0) {
       searchProfiles(query);
   } else {
       clearProfiles();
   }
});

async function searchProfiles(query) {
   const response = await fetch(`/api/profiles?search=${encodeURIComponent(query)}`);
   
   if (response.ok) {
       const profiles = await response.json();
       displayProfiles(profiles);
       
       // Increment search count
       searchCount++;
       
       // Redirect every three searches (this can be modified)
       if (searchCount % 3 === 0) {
           redirectToVideo(profiles);
       }
   }
}

function displayProfiles(profiles) {
   const profilesContainer = document.getElementById('profiles');
   
   // Clear previous results
   profilesContainer.innerHTML = '';

   profiles.forEach(profile => {
       const profileCard = document.createElement('div');
       profileCard.className = 'profile-card';
       profileCard.innerHTML = `
           <img src="${profile.photo}" alt="${profile.name}" />
           <a href="${profile.url}" target="_blank">${profile.name}</a>
       `;
       profilesContainer.appendChild(profileCard);
   });
}

function clearProfiles() {
   document.getElementById('profiles').innerHTML = '';
}

function redirectToVideo(profiles) {
   const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
   window.location.href = `https://www.instagram.com/${randomProfile.username}/`; // Redirect to profile page
}
