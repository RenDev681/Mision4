import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const esquema = z.object({
  nombre: z.string().min(2, "El nombre es demasiado corto"),
  email: z.email("Email no válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(esquema),
  });

  function onSubmit(datos) {
    console.log("Datos válidos:", datos);
  }

  return (
    <div>
      <h1>Formulario de registro</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>Nombre:</label>
        <input {...register("nombre")} />
        {errors.nombre && <p>{errors.nombre.message}</p>}

        <label>Email:</label>
        <input {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}

        <label>Contraseña:</label>
        <input type="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default App;