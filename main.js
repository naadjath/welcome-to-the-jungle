// Script très léger pour une démo d'interactions

const keywordInput = document.getElementById("search-keyword");
const locationInput = document.getElementById("search-location");
const tags = document.querySelectorAll(".tag");
const searchForm = document.querySelector(".search-bar");

tags.forEach((tag) => {
  tag.addEventListener("click", () => {
    keywordInput.value = tag.textContent.trim();
    keywordInput.focus();
  });
});

searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(
    `Recherche simulée pour : "${keywordInput.value || "tout type de poste"}" à "${
      locationInput.value || "toutes localisations"
    }".\n\nSur le vrai site, cette recherche lancerait l'affichage des offres correspondantes.`
  );
});



