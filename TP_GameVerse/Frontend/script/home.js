const body = document.querySelector(".body");
const logoResponsive = document.querySelector(".foto-menu");
let div = document.querySelector(".lateral-menu");

logoResponsive.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log("click")
    div.style.left = '0'; // Nueva posición en X
    div.style.top = '0'; // Nueva posición en X
});

// Detectar clic fuera del elemento para restablecer la posición
document.addEventListener('click', (e) => {
    e.stopPropagation()
    if (e.target != div) {
        div.style.left = '-200px';
    }
});








