// Objeto tiempo que define la duración de una sesión
let tiempoAux = {
    min: 0,
    seg: 5
}
const tiempoPantalla = document.getElementById('tiempo')
const btnInicio = document.getElementById('start')
const btnReset = document.getElementById('reset')
btnInicio.dataset.id = 1
let intervalo

// Iniciar la cuenta regresiva al presionar el botón Start
// Cambiar el estado del botón entre Start y Stop en cada click
btnInicio.addEventListener('click', () =>{
    if(btnInicio.dataset.id == 1){
        console.log("start")
        btnInicio.dataset.id = 2
        btnInicio.innerText = "Stop"
        intervalo = setInterval("restarTiempo()", 1000);
    }else{
        console.log("stop")
        btnInicio.dataset.id = 1
        btnInicio.innerText = "Start"
        clearInterval(intervalo)
    }
})

const restarTiempo = () => {
    tiempoPantalla.innerHTML = formatoTiempo(tiempoAux.min, tiempoAux.seg)
    if(tiempoAux.seg == 0){
        tiempoAux.min--
        if(tiempoAux.min < 0){
            // detener la cuenta regresiva 
            clearInterval(intervalo)
            // Reiniciar el tiempo a sus valores originales
            tiempoAux.min = 0
            tiempoAux.seg = 5
            // Restablecer los valores del boton start
            btnInicio.dataset.id = 1
            btnInicio.innerText = "Start"
        }else{
            tiempoAux.seg = 59
        }
    }else{
        tiempoAux.seg--
    }
}

// Para mostrar el tiempo en el formato mm:ss
const formatoTiempo = (minutos, segundos) => {
    var m = minutos<9?"0"+minutos:minutos
    var s = segundos<9?"0"+segundos:segundos
    return m + ":" + s
}

// Reiniciar el contador con el botón reset
btnReset.addEventListener('click', () =>{
    clearInterval(intervalo)
    tiempoAux.min = 0
    tiempoAux.seg = 5
    tiempoPantalla.innerHTML = formatoTiempo(tiempoAux.min, tiempoAux.seg)
})