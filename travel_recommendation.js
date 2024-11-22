document.addEventListener("DOMContentLoaded", () => {
    alert("Welcome to Travel Recommendation! Explore the world with us.");

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const resetBtn = document.getElementById("resetBtn");
    const recommendationsContainer = document.getElementById("recommendations");

    // Load recommendations data from the JSON file
    let recommendationsData = [];

    fetch("./travel_recommendation_api.json") // Path to your JSON file
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            recommendationsData = data;
            console.log("Data fetched successfully:", data); // Debugging
        })
        .catch((error) => console.error("Error fetching JSON data:", error));

    // Function to display recommendations based on the keyword
    const displayRecommendations = (keyword) => {
        // Clear any previous recommendations
        recommendationsContainer.innerHTML = "";

        // Convert the keyword to lowercase for case-insensitive matching
        const lowerCaseKeyword = keyword.toLowerCase();
        const matchedResults = [];

        // Check if the keyword is one of the main categories
        if (["beach", "beaches"].includes(lowerCaseKeyword)) {
            if (recommendationsData.beaches) {
                recommendationsData.beaches.slice(0, 2).forEach((beach) => {
                    matchedResults.push({
                        name: beach.name,
                        description: beach.description,
                        imageUrl: beach.imageUrl,
                    });
                });
            }
        } else if (["temple", "temples"].includes(lowerCaseKeyword)) {
            if (recommendationsData.temples) {
                recommendationsData.temples.slice(0, 2).forEach((temple) => {
                    matchedResults.push({
                        name: temple.name,
                        description: temple.description,
                        imageUrl: temple.imageUrl,
                    });
                });
            }
        } else if (["country", "countries"].includes(lowerCaseKeyword)) {
            if (recommendationsData.countries) {
                recommendationsData.countries.slice(0, 2).forEach((country) => {
                    matchedResults.push({
                        name: country.name,
                        description: country.description,
                        imageUrl: country.imageUrl,
                    });
                });
            }
        } else {
            // Search across all categories for general keywords
            ["countries", "beaches", "temples"].forEach((category) => {
                if (recommendationsData[category]) {
                    recommendationsData[category].forEach((item) => {
                        if (item.name.toLowerCase().includes(lowerCaseKeyword)) {
                            matchedResults.push({
                                name: item.name,
                                description: item.description || `Explore the wonders of ${item.name}`,
                                imageUrl: item.imageUrl || "placeholder.jpg",
                            });
                        }

                        // Include cities for countries
                        if (category === "countries" && item.cities) {
                            item.cities.forEach((city) => {
                                if (city.name.toLowerCase().includes(lowerCaseKeyword)) {
                                    matchedResults.push({
                                        name: city.name,
                                        description: city.description || `Discover ${city.name}`,
                                        imageUrl: city.imageUrl || "placeholder.jpg",
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

        // Display matched results
        if (matchedResults.length > 0) {
            // Limit results to 2 recommendations
            matchedResults.slice(0, 2).forEach((result) => {
                const card = document.createElement("div");
                card.classList.add("recommendation-card");
                card.innerHTML = `
                    <img src="${result.imageUrl}" alt="${result.name}" class="recommendation-image">
                    <h3>${result.name}</h3>
                    <p>${result.description}</p>
                `;
                recommendationsContainer.appendChild(card);
            });
        } else {
            recommendationsContainer.innerHTML = `<p>No results found for "${keyword}".</p>`;
        }
    };

    // Event listener for the Search button
    searchBtn.addEventListener("click", () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            displayRecommendations(keyword);
        } else {
            recommendationsContainer.innerHTML = `<p>Please enter a keyword to search.</p>`;
        }
    });

    // Event listener for the Reset button
    resetBtn.addEventListener("click", () => {
        searchInput.value = "";
        recommendationsContainer.innerHTML = "";
    });
});
