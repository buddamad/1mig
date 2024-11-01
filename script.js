let searchCount = 0;

document.getElementById('search').addEventListener('input', function() {
    const query = this.value;
    searchProfiles(query);
});

async function searchProfiles(query) {
    // Fetch profiles from your backend or API
    const response = await fetch(`/api/profiles?search=${encodeURIComponent(query)}`);
    
    if (response.ok) {
        const profiles = await response.json();
        displayProfiles(profiles);
        
        // Increment search count
        searchCount++;
        
        // Redirect every three searches
        if (searchCount % 3 === 0) {
            redirectToVideo(profiles);
        }
    }
}

function displayProfiles(profiles) {
    const profilesContainer = document.getElementById('profiles');
    profilesContainer.innerHTML = ''; // Clear previous results

    profiles.forEach(profile => {
        const profileDiv = document.createElement('div');
        profileDiv.innerHTML = `<img src="${profile.photo}" alt="${profile.name}" /> 
                                <a href="${profile.url}" target="_blank">${profile.name}</a>`;
        profilesContainer.appendChild(profileDiv);
    });
}

function redirectToVideo(profiles) {
    const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
    window.location.href = `https://www.instagram.com/${randomProfile.username}/`; // Redirect to profile page
}

// Function to rotate the globe (simplified)
function rotateGlobe() {
   const globe = document.getElementById('globe');
   let rotation = 0;

   setInterval(() => {
       rotation += 0.5; // Adjust speed as needed
       globe.style.transform = `rotateY(${rotation}deg)`;
   }, 100); // Adjust interval as needed
}

// Start rotating the globe
rotateGlobe();
