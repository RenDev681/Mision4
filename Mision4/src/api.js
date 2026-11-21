const API_Personas = "http://localhost:3000/Personas";
const API_Usuarios = "http://localhost:3000/Usuarios";

export async function obtenerPrefecturas() {
    const respuesta = await fetch(API_Personas);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    const prefecturas = Array.isArray(datos)
        ? datos
        : datos?.data;

    if (!Array.isArray(prefecturas)) {
        throw new Error("El formato de la respuesta no es válido.");
    }

    return prefecturas;
}


export async function crearUsuario(datosUsuario) {
    const respuesta = await fetch(API_Usuarios, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosUsuario)
    });

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const usuarioCreado = await respuesta.json();

    return usuarioCreado;
}