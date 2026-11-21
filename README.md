# Mision 4

Misión M4 . Full Contact Forms

## Cómo probarlo
Abre index.html en el navegador (o con Live Server). Pulsa «Jugar»:
tienes 30 segundos para aplastar bugs. Tecla secreta: pulsa "n" para
el modo nocturno.

## Uso de IA
Usé Gemini CLI (VS Code) como pareja de programación, fase a fase.
Ejemplo de prompt real: "Propón 4 o 5 fases pequeñas para construir un
whack-a-mole en JS puro; no escribas código todavía".
Verifiqué cada cambio jugando una partida completa antes de aceptar la
siguiente fase, y probé los casos límite (clic en casilla vacía, clic
después del fin de partida).
Escribí a mano: el setTimeout encadenado que hace aparecer los bugs,
que la primera propuesta resolvía con setInterval y no se detenía bien
al acabar la partida.

## Autopsia





import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { obtenerPrefecturas, crearUsuario } from "./api.js";

// 1. Esquema de validación
const esquema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.email("Introduce un correo electrónico válido")
});

function App() {

  // 2. Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(esquema)
  });

  // 3. Estados de la aplicación
  const [registrado, setRegistrado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [nombreAnimal, setNombreAnimal] = useState("");
const [idAnimal, setIdAnimal] = useState(null);
const [error, setError] = useState("");

const [nuevoAnimal, setNuevoAnimal] = useState("");
  // 4. Función que se ejecuta al enviar el formulario
  async function onSubmit(datos) {
    try {
        const usuarioCreado = await crearUsuario(datos);

        console.log("Usuario creado:", usuarioCreado);

        alert("Usuario registrado correctamente");

        reset();

    } catch (error) {
        console.error(error);

        alert("Error al registrar el usuario");
    }
}


  async function buscarAnimal() {
    try {
        setError("");
        setIdAnimal(null);

        // Obtenemos todos los animales de la API
        const animales = await obtenerPrefecturas();

        // Buscamos el animal escrito por el usuario
        const animalEncontrado = animales.find(
            (animal) =>
                animal.nombre.toLowerCase() ===
                nombreAnimal.trim().toLowerCase()
        );

        // Comprobamos si existe
        if (animalEncontrado) {
            setIdAnimal(animalEncontrado.id);
        } else {
            setError("No se ha encontrado ese animal.");
        }

    } catch (error) {
        setError("Error al consultar la API: " + error.message);
    }
}



async function handleCrearCuenta(e) {
    e.preventDefault();

    setMensaje("");
    setError("");

    // Comprobamos que no esté vacío
    if (nuevoAnimal.trim() === "") {
        setError("Debes introducir el nombre de un animal.");
        return;
    }

    try {
        // Enviamos el animal a la API
        const animalCreado = await crearAnimal(nuevoAnimal);

        setMensaje(
            `Animal creado correctamente. ID: ${animalCreado.id}`
        );

        // Limpiamos el input
        setNuevoAnimal("");

    } catch (error) {
        setError(error.message);
    }
}


  /*return (
    
<section>
    <h2>Buscador de animales</h2>

    <input
        type="text"
        placeholder="Escribe un animal..."
        value={nombreAnimal}
        onChange={(e) => setNombreAnimal(e.target.value)}
    />

    <button onClick={buscarAnimal}>
        Buscar
    </button>

    {idAnimal !== null && (
        <p>El ID del animal es: {idAnimal}</p>
    )}

    {error && (
        <p>{error}</p>
    )}


    <section>
    <h2>Añadir un nuevo animal</h2>

    <form onSubmit={handleCrearAnimal}>
        <label htmlFor="nuevoAnimal">
            Nombre del animal:
        </label>

        <input
            id="nuevoAnimal"
            type="text"
            value={nuevoAnimal}
            onChange={(e) => setNuevoAnimal(e.target.value)}
            placeholder="Ejemplo: Oso"
        />

        <button type="submit">
            Crear animal
        </button>
    </form>

    {mensaje && (
        <p role="status">{mensaje}</p>
    )}

    {error && (
        <p role="alert">{error}</p>
    )}
</section>
</section>



  );
}

export default App;*/

return (
    <main>
        <h1>Registro de usuario</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <label htmlFor="nombre">
                Nombre:
            </label>

            <input
                id="nombre"
                type="text"
                {...register("nombre")}
            />

            {errors.nombre && (
                <p role="alert">
                    {errors.nombre.message}
                </p>
            )}

            <label htmlFor="correo">
                Correo electrónico:
            </label>

            <input
                id="correo"
                type="email"
                {...register("correo")}
            />

            {errors.correo && (
                <p role="alert">
                    {errors.correo.message}
                </p>
            )}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Registrar"}
            </button>

        </form>
    </main>
);

}
export default App