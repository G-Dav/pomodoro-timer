var conf = {
    pomodoro: {min: 25},
    dCorto: {min: 5},
    dLargo: {min: 15},
    sesiones: 0,
    automatic: false,   // indica si las sesiones se inician de forma automática
    alarma: true,
    volumen: 100
}

// Objeto tiempo que define el tiempo restante de una sesión
let tiempoAux = {
    min: 25,
    seg: 0
}

const tiempoPantalla = document.getElementById('tiempo')
const btnInicio = document.getElementById('start')
const btnReset = document.getElementById('reset')
const btnSesion = document.getElementById('pomodoro')
const btndCorto = document.getElementById('shortBreak')
const btndLargo = document.getElementById('longBreak')
const btnSave = document.getElementById('guardar')
btnInicio.dataset.id = 1
let intervalo = false   // indica si hay una sesión en curso, si la hay intervalo = setIterval()
let tipoSesion = 1      // 1: pomodoro, 2: descanso corto, 3: descanso largo
let confirmacion        // se utliza para indicar si el usuario elige interrumpir una sesión para iniciar otra
let numSesiones = 2     // número de sesiones pomodoro que se han terminado antes de un descanso largo

// Iniciar la cuenta regresiva al presionar el botón Start
// Cambiar el estado del botón entre Start y Stop en cada click
btnInicio.addEventListener('click', () =>{
    if(btnInicio.dataset.id == 1){
        btnInicio.dataset.id = 2
        btnInicio.innerText = "Stop"
        intervalo = setInterval("restarTiempo()", 1000);
        console.log("start"+intervalo)
    }else{
        resetBtnStart()
        clearInterval(intervalo)
        console.log("stop"+intervalo)
    }
})

// Función que realiza la cuenta regresiva
const restarTiempo = () => {
    //tiempoPantalla.innerHTML = formatoTiempo(tiempoAux.min, tiempoAux.seg)
    if(tiempoAux.seg == 0){
        tiempoAux.min--
        if(tiempoAux.min < 0){
            if(!conf.automatic){
                // detener la cuenta regresiva 
                clearInterval(intervalo)
                intervalo = false
            }
            // Asignar el tiempo de la sesión siguiente según la sesión actual
            switch(tipoSesion){
                case 1:
                    numSesiones++
                    if(numSesiones >= conf.sesiones){
                        tipoSesion = 3
                        tiempoAux.min = conf.dLargo.min
                        numSesiones = 0
                    }else{
                        tipoSesion = 2
                        tiempoAux.min = conf.dCorto.min
                    }
                    /*
                    if(conf.automatic){
                        numSesiones++
                        if(numSesiones >= conf.sesiones){
                            tipoSesion = 3
                            tiempoAux.min = conf.dLargo.min
                        }else{
                            tipoSesion = 2
                            tiempoAux.min = conf.dCorto.min
                        }
                    }else{
                        tipoSesion = 2
                        tiempoAux.min = conf.dCorto.min
                    }*/
                    break;
                case 2:
                    tiempoAux.min = conf.pomodoro.min
                    tipoSesion = 1
                    break;
                case 3:
                    tiempoAux.min = conf.pomodoro.min
                    tipoSesion = 1
                    break;
            }
            tiempoAux.seg = 0
            // Restablecer los valores del boton start
            resetBtnStart()
        }else{
            tiempoAux.seg = 59
        }
    }else{
        tiempoAux.seg--
    }
    tiempoPantalla.innerHTML = formatoTiempo(tiempoAux.min, tiempoAux.seg)
}

// Para mostrar el tiempo en el formato mm:ss
const formatoTiempo = (minutos, segundos) => {
    var m = minutos<10?"0"+minutos:minutos
    var s = segundos<10?"0"+segundos:segundos
    return m + ":" + s
}

// Reiniciar el contador con el botón reset
btnReset.addEventListener('click', () => {
    resetear()
    console.log(conf)
})

const resetear = () => {
    resetBtnStart()
    clearInterval(intervalo)
    intervalo = false
    console.log(tipoSesion)
    switch(tipoSesion){
        case 1:
            tiempoAux.min = conf.pomodoro.min
            break;
        case 2:
            tiempoAux.min = conf.dCorto.min
            break;
        case 3:
            tiempoAux.min = conf.dLargo.min
            break;
    }
    tiempoAux.seg = 0
    tiempoPantalla.innerHTML = formatoTiempo(tiempoAux.min, tiempoAux.seg)
}

// Cambiar a descanso corto
btndCorto.addEventListener('click', () => {
    if(!intervalo){
        cambioSesion(2, conf.dCorto.min)
    }
    else{
        confirmacion = window.confirm("Are you sure you want to interrupt the current session?")
        if(confirmacion){
            clearInterval(intervalo)
            cambioSesion(2, conf.dCorto.min)
        }
    }
})

// Cambiar a descanso largo
btndLargo.addEventListener('click', () => {
    if(!intervalo){
        cambioSesion(3, conf.dLargo.min)
    }
    else{
        confirmacion = window.confirm("Are you sure you want to interrupt the current session?")
        if(confirmacion){
            clearInterval(intervalo)
            cambioSesion(3, conf.dLargo.min)
        }
    }
})

// Cambiar a sesión pomodoro
btnSesion.addEventListener('click', () => {
    if(!intervalo){
        cambioSesion(1, conf.pomodoro.min)
    }
    else{
        confirmacion = window.confirm("Are you sure you want to interrupt the current session?")
        if(confirmacion){
            clearInterval(intervalo)
            cambioSesion(1, conf.pomodoro.min)
        }
    }
})

const cambioSesion = (tSesion, min) => {
    tipoSesion = tSesion
    tiempoAux.min = min
    tiempoAux.seg = 0
    tiempoPantalla.innerHTML = formatoTiempo(tiempoAux.min, tiempoAux.seg)
    intervalo = false
    resetBtnStart()
}

const resetBtnStart = () => {
    btnInicio.dataset.id = 1
    btnInicio.innerText = "Start"
}

// Modificar los valores de la variable conf según la elección del usuario
btnSave.addEventListener('click', () => {
    conf.pomodoro.min = document.config.tPomodoro.value
    conf.dCorto.min = document.config.tShortBreak.value
    conf.dLargo.min = document.config.tLongBreak.value
    conf.sesiones = document.config.interval.value
    conf.automatic = document.config.autostart.checked
    conf.alarma = document.config.alarm.checked
    conf.volumen = document.config.volume.value
    resetear()
})