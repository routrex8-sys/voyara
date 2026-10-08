const modal = document.querySelector("#profile-modal");
const toast = document.querySelector("#toast");
const savedProfile = JSON.parse(localStorage.getItem("voyara-profile") || "null");
if (savedProfile?.name) document.querySelector(".avatar").textContent = savedProfile.name.charAt(0).toUpperCase();
const openProfile = () => { modal.hidden = false; document.body.style.overflow = "hidden"; };
const closeProfile = () => { modal.hidden = true; document.body.style.overflow = ""; };
document.querySelectorAll("#open-profile, #hero-profile, #recommendation-button").forEach((button) => button.addEventListener("click", openProfile));
document.querySelector("#close-profile").addEventListener("click", closeProfile);
modal.addEventListener("click", (event) => { if (event.target === modal) closeProfile(); });

const prices = {
  Jericoacoara: { flight: 2150, stay: 980, tours: 420 },
  Cartagena: { flight: 2980, stay: 1320, tours: 610 },
  "Lençóis Maranhenses": { flight: 1690, stay: 740, tours: 350 },
};
const formatCurrency = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const destinationSelect = document.querySelector("#destination-select");
const updateTotal = () => {
  const selected = prices[destinationSelect.value];
  const keys = [["flight", "flight-price"], ["stay", "stay-price"], ["tours", "tours-price"]];
  let total = 0;
  keys.forEach(([key, priceId]) => {
    const checkbox = document.querySelector(`#${key}`);
    const value = selected[key];
    checkbox.dataset.price = value;
    document.querySelector(`#${priceId}`).textContent = formatCurrency(value);
    if (checkbox.checked) total += value;
  });
  const travelers = Number(document.querySelector("#traveler-count").textContent);
  total *= travelers / 2;
  document.querySelector("#total-price").textContent = formatCurrency(total);
  document.querySelector("#installment-price").textContent = formatCurrency(total / 10);
  document.querySelector(".price-label").textContent = `estimativa para ${travelers} ${travelers === 1 ? "pessoa" : "pessoas"}`;
};
destinationSelect.addEventListener("change", updateTotal);
document.querySelectorAll(".check-row input").forEach((input) => input.addEventListener("change", updateTotal));
let travelers = 2;
document.querySelector("#plus").addEventListener("click", () => { if (travelers < 8) travelers += 1; document.querySelector("#traveler-count").textContent = travelers; updateTotal(); });
document.querySelector("#minus").addEventListener("click", () => { if (travelers > 1) travelers -= 1; document.querySelector("#traveler-count").textContent = travelers; updateTotal(); });
document.querySelectorAll(".select-destination").forEach((button) => button.addEventListener("click", () => {
  destinationSelect.value = button.closest(".destination-card").dataset.destination;
  updateTotal();
  document.querySelector("#montar").scrollIntoView({ behavior: "smooth" });
}));
document.querySelectorAll(".heart").forEach((button) => button.addEventListener("click", () => {
  button.classList.toggle("saved");
  button.textContent = button.classList.contains("saved") ? "♥" : "♡";
}));
document.querySelector("#show-all").addEventListener("click", () => {
  document.querySelector("#destinos").scrollIntoView({ behavior: "smooth" });
  document.querySelectorAll(".destination-card").forEach((card) => card.animate([{ transform: "scale(1)" }, { transform: "scale(1.025)" }, { transform: "scale(1)" }], { duration: 550 }));
});
document.querySelector("#profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const profile = Object.fromEntries(new FormData(event.target).entries());
  localStorage.setItem("voyara-profile", JSON.stringify(profile));
  const name = profile.name;
  document.querySelector(".avatar").textContent = name.toString().trim().charAt(0).toUpperCase() || "L";
  closeProfile();
  toast.textContent = `Perfil de ${name} salvo! Sua curadoria está pronta ✦`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
});
document.querySelector("#continue-button").addEventListener("click", () => {
  toast.textContent = "Ótima escolha! Personalize os detalhes do seu roteiro ✦";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
});
updateTotal();
