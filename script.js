const access_key = `n_bVsA24t01_CX6S_yzPnTSDarTqEXsJzeKjPgYRLOE`;
const container = document.querySelector(".container");
const modal = document.querySelector(".modal");

window.addEventListener("DOMContentLoaded", () => {
  getAllImages();
});

async function getAllImages() {
  try {
    const data = await fetch(
      `https://api.unsplash.com/photos/?client_id=${access_key}`
    );
    const response = await data.json();
    showAllImages(response);
  } catch (error) {
    console.error(error);
  }
}

function showAllImages(images) {
  container.innerHTML = "";
  images.forEach((image) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${image.urls.regular}" 
           alt="${image.alt_description || "Unsplash Image"}"
           class="card_image"
           data-full="${image.urls.full}" />
    `;
    container.appendChild(card);
  });
}

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("card_image")) {
    const fullImage = e.target.dataset.full;
    showModal(fullImage);
  }
});

function showModal(imageUrl) {
  modal.innerHTML = `
    <div class="modal_content">
      <span class="close_btn">&times;</span>
      <img src="${imageUrl}" />
     
    </div>
  `;
  modal.style.display = "flex";
  localStorage.setItem("image", imageUrl);

  document.querySelector(".close_btn").addEventListener("click", () => {
    modal.style.display = "none";
    localStorage.removeItem("image");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}
