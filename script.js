let animado = document.getElementsByClassName("Imagen");
let iconoMenu = document.getElementById("iconoMenu");
let Menu = document.getElementsByClassName("Menu")[0];
let botonMYEL = document.getElementsByClassName("BotonOverlay");

let bandera = true;

function MostrarScroll() {

    let ScrollTop = document.documentElement.scrollTop;

    for (var i = 0; i<=animado.length; i++)
    {
        let alturaAnimado = animado[i].offsetTop;
        if(alturaAnimado -550 <=ScrollTop)
        {
            animado[i].style.opacity=1;
            animado[i].classList.add("mostrarArriba");
        }
    }

}

iconoMenu.addEventListener("click", (e) => {
    if(bandera==true) {
        Menu.style.display="block";
        Menu.style.opacity=1
        bandera=false;
        
    }
    else {
        Menu.style.display="none";
        Menu.style.opacity=0;
        bandera=true;
    }
});
window.addEventListener('scroll', MostrarScroll);

