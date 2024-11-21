document.addEventListener("DOMContentLoaded", () => {
    alert("Welcome to Travel Recommendation! Explore the world with us.");
});

// Fetch and display travel recommendations
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = './travel_recommendation_api.json'; // Path to JSON file

    // Fetch data from JSON
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Debug: Log data to ensure it's fetched correctly
            displayRecommendations(data);
        })
        .catch(error => console.error('Error fetching data:', error));
});

// Function to display recommendations
function displayRecommendations(data) {
    const recommendationsContainer = document.querySelector('#recommendations');
    
    if (!recommendationsContainer) {
        console.error('Recommendations container not found in the DOM.');
        return;
    }

    // Clear previous content
    recommendationsContainer.innerHTML = '';

    // Categories of recommendations
    const categories = ['countries', 'temples', 'beaches'];

    categories.forEach(category => {
        const categoryData = data[category];
        const categoryTitle = capitalizeFirstLetter(category);

        const section = document.createElement('section');
        section.classList.add('recommendation-section');
        section.innerHTML = `<h2>${categoryTitle}</h2>`;

        categoryData.forEach(item => {
            const card = createRecommendationCard(item);
            section.appendChild(card);
        });

        recommendationsContainer.appendChild(section);
    });
}

// Function to create a recommendation card
function createRecommendationCard(item) {
    const card = document.createElement('div');
    card.classList.add('recommendation-card');

    card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="recommendation-image">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
    `;

    return card;
}

// Helper to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
