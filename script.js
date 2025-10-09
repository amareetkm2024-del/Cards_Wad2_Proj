const container = document.getElementById("petCards");
const API_KEY = "live_m9FVcETQaok0LTSqCHAJrMMvkhBAIF2PfmvUMfwKq7n3zQIcDuHndLIerVPtmKEH";
let allBreeds = [];

//load the list of breeds from the API key for dogs
async function loadAllBreeds() {
  try {
    const response = await axios.get("https://api.thedogapi.com/v1/breeds", {
      headers: { "x-api-key": API_KEY }
    });
    allBreeds = response.data;
  } catch (error) {
    console.error("Error fetching breed list:", error);
  }
}

// Step 2: Get image by breed name
async function getDogImageByBreedName(breedName) {
  try {
    // Find breed by name
    const breed = allBreeds.find(
      b => b.name.toLowerCase() === breedName.toLowerCase()
    );

    if (!breed) {
      console.warn(`Breed not found: ${breedName}`);
      return "https://via.placeholder.com/300x200?text=Breed+Not+Found";
    }

    // Fetch an image using the breed_id
    const response = await axios.get(
      `https://api.thedogapi.com/v1/images/search?breed_id=${breed.id}`,
      { headers: { "x-api-key": API_KEY } }
    );

    if (response.data && response.data.length > 0) {
      return response.data[0].url;
    } else {
      return "https://via.placeholder.com/300x200?text=No+Image";
    }
  } catch (error) {
    console.error(`Error fetching image for ${breedName}:`, error);
    return "https://via.placeholder.com/300x200?text=Image+Error";
  }
}

// Step 3: Display pet cards
async function displayPets() {
  await loadAllBreeds(); // ensure breeds are loaded before searching

  const petPromises = pets.map(async pet => {
    let imgURL = pet.image;

    if (!imgURL && pet.species.toLowerCase() === "dog") {
      imgURL = await getDogImageByBreedName(pet.breed);
    } else if (!imgURL) {
      imgURL = "https://via.placeholder.com/300x200?text=No+Image";
    }

    return { ...pet, image: imgURL };
  });

  const petData = await Promise.all(petPromises);

  container.innerHTML = ""; // clear container before adding
  petData.forEach(pet => {
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <img src="${pet.image}" class="card-img-top" alt="${pet.name}">
          <div class="card-body">
            <h5 class="card-title">${pet.name}</h5>
            <p class="card-text">${pet.species} - ${pet.breed}</p>
          </div>
        </div>
      </div>
    `;
  });
}

displayPets();