const API_URL = "http://localhost:3000";

// Obtener todas las Personas
export async function obtenerPersonas() {

    const respuesta = await fetch(`${API_URL}/Personas`);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    return datos;
}


// Buscar un usuario por nombre y correo
export async function buscarUsuario(nombre, correo) {

    const respuesta = await fetch(`${API_URL}/Usuarios`);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    const usuarioEncontrado = datos.find(
        (usuario) =>
            usuario.nombre?.toLowerCase() === nombre.toLowerCase() &&
            usuario.correo?.toLowerCase() === correo.toLowerCase()
    );

    return usuarioEncontrado;
}


// Crear un usuario nuevo
export async function crearUsuario(usuario) {

    const respuesta = await fetch(`${API_URL}/Usuarios`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(usuario)

    });

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    return datos;
}


// Actualizar un usuario existente
export async function actualizarUsuario(usuario) {

    const respuesta = await fetch(`${API_URL}/Usuarios/${usuario.id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(usuario)

    });

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    return datos;
}