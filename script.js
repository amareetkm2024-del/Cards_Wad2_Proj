const container = document.getElementById("petCards");
const API_KEY = "live_m9FVcETQaok0LTSqCHAJrMMvkhBAIF2PfmvUMfwKq7n3zQIcDuHndLIerVPtmKEH";
let allBreeds = [];

// Load all dog breeds
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

// Get dog image by breed name
async function getDogImageByBreedName(breedName) {
  try {
    const breed = allBreeds.find(
      b => b.name.toLowerCase() === breedName.toLowerCase()
    );

    if (!breed) {
      console.warn(`Breed not found: ${breedName}`);
      return "https://via.placeholder.com/300x200?text=Breed+Not+Found";
    }

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

// // Get rabbit image by breed name
// async function getRabbitImageByBreedName(breedName) {
//   try {
//     const response = await axios.get(
//       `https://rabbit-api-two.vercel.app/api/breeds/${encodeURIComponent(breedName)}`
//     );

//     if (response.data && response.data.image) {
//       return response.data.image;
//     } else {
//       return "https://via.placeholder.com/300x200?text=No+Image";
//     }
//   } catch (error) {
//     console.error(`Error fetching rabbit image for ${breedName}:`, error);
//     return "https://via.placeholder.com/300x200?text=Image+Error";
//   }
// }


// Display pet cards dynamically
async function displayPets() {
  await loadAllBreeds(); // ensure breeds are loaded

  const petPromises = pets.map(async pet => {
    let imgURL = pet.image;

    if (!imgURL) {
      if (pet.species.toLowerCase() === "dog") {
        imgURL = await getDogImageByBreedName(pet.breed);
      } else if (pet.species.toLowerCase() === "rabbit") {
        imgURL = await getRabbitImageByBreedName(pet.breed);
      } else {
        imgURL = "https://via.placeholder.com/300x200?text=No+Image";
      }
    }

    return { ...pet, image: imgURL };
  });

  const petData = await Promise.all(petPromises);

  // Clear container
  container.textContent = "";

  petData.forEach(pet => {
    // Column
    const col = document.createElement("div");
    col.classList.add("col-md-4", "mb-3");

    // Card
    const card = document.createElement("div");
    card.classList.add("card", "shadow-sm");

    // Image
    const img = document.createElement("img");
    img.src = pet.image;
    img.alt = pet.name;
    img.classList.add("card-img-top");

    // Card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "d-flex", "flex-column");

    // Title
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = pet.name;

    // Breed
    const text = document.createElement("p");
    text.classList.add("card-text");
    text.textContent = `${pet.breed}`;

    // Description
    const description = document.createElement("p");
    description.classList.add("card-text");
    description.textContent = `${pet.description}`;

    // View More button
    const button = document.createElement("button");
    button.classList.add("btn", "btn-orange", "mt-auto");
    button.textContent = "View More";

    // Append elements
    cardBody.appendChild(title);
    cardBody.appendChild(text);
    cardBody.appendChild(description);
    cardBody.appendChild(button);

    card.appendChild(img);
    card.appendChild(cardBody);

    col.appendChild(card);

    container.appendChild(col);
  });
}

// Call the function
displayPets();
