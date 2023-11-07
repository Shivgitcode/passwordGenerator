const slider = document.querySelector(".slider");
const p = document.querySelector(".yo");

slider.addEventListener("change", (ev) => {
  const value = ev.target.value;
  p.innerHTML = value;
});
