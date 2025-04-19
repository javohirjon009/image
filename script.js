const access_key = `n_bVsA24t01_CX6S_yzPnTSDarTqEXsJzeKjPgYRLOE`;


const container = document.querySelector(".container");
const modal = document.querySelector(".modal");
const input = document.querySelector("input");

window.addEventListener("DOMContentLoaded", () => {
  getAllImages();
});

let interval;

input.addEventListener("input", async (e) => {
  const query = e.target.value;
  clearInterval(interval);

  interval = setTimeout(async () => {
    try {
      const data = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${access_key}`
      );
      const response = await data.json();
      showAllImages(response?.results);
    } catch (error) {
      alert(error);
    }
  }, 500);
});

async function getAllImages() {
  const data = await fetch(
    `https://api.unsplash.com/photos/?client_id=${access_key}`
  );
  const response = await data.json();

  showAllImages(response);
}

function showAllImages(images) {
  container.innerHTML = "";
  if (images.length > 0) {
    images?.forEach((image) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${image.urls.full}" class="card_image" data-id=${image.id} />
        `;
      container.append(card);
    });
  }
}

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("card_image")) {
    let id = e.target.dataset.id;
    showLoading(e.target.parentElement, e.target.src, id);
  }
});

function showLoading(element, src, id) {
  element.innerHTML = "<h1>Loading...</h1>";
  setTimeout(() => {
    element.innerHTML = `<img src="${src}" class="card_image" data-id="${id}"/>`;
    openModal(id);
  }, 1000);
}

async function openModal(id) {
  modal.innerHTML = "";
  modal.classList.add("open");
  const data = await fetch(
    `https://api.unsplash.com/photos/${id}?client_id=${access_key}`
  );
  const resp = await data.json();
  const div = document.createElement("div");
  div.classList.add("modal-div");
  div.innerHTML = `<img src="${resp.urls.full}"/>
  <div class="like-btn" onclick='addToLikedPhotos("${id}")'>
  ${checkIsLiked(id)}
   <p>${resp.likes} </p> 
  </div>
  `;

  modal.appendChild(div);
}

function addToLikedPhotos(id) {
  const likedPhotos = JSON.parse(localStorage.getItem("liked") || "[]");

  if (!likedPhotos.includes(id)) {
    likedPhotos.push(id);
    localStorage.setItem("liked", JSON.stringify(likedPhotos));
  } else {
    const removedLike = likedPhotos.filter((likedIds) => likedIds !== id);
    localStorage.setItem("liked", JSON.stringify(removedLike));
  }
  openModal(id);
  checkIsLiked();
}

function checkIsLiked(id) {
  const likedPhotos = JSON.parse(localStorage.getItem("liked") || "[]");
  return `${
    likedPhotos.includes(id)
      ? '<i class="bx bxs-heart"></i>'
      : '<i class="bx bx-heart"></i>'
  }`;
}
