
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearUsuario } from "./api.js";

// Esquema de validación
const esquema = z.object({
    nombre: z.string().min(4, "El nombre debe tener más de 3 caracteres"),
    correo: z.email("Introduce un correo electrónico válido")
});

function App() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(esquema)
    });

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

export default App;
