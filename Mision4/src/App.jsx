import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  // 4. Función que se ejecuta al enviar el formulario
  async function onSubmit(datos) {
    setMensaje("");

    try {
      const respuesta = await fetch("/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje);
      }

      setMensaje(resultado.mensaje);
      setRegistrado(true);

    } catch (error) {
      setMensaje(error.message);
      setRegistrado(false);
    }
  }

  return (
    <main>
      <h1>Registro de usuarios</h1>

      {!registrado && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            {...register("nombre")}
            aria-invalid={!!errors.nombre}
          />

          {errors.nombre && (
            <p role="alert">{errors.nombre.message}</p>
          )}

          <label htmlFor="email">Correo electrónico:</label>
          <input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />

          {errors.email && (
            <p role="alert">{errors.email.message}</p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Submit"}
          </button>

        </form>
      )}

      <p role="status">{mensaje}</p>

    </main>
  );
}

export default App;