import { useState } from 'react'
import './App.css'

import { useForm } from "react-hook-form";

function App() {
  const {
    register,
    handleSubmit,
  } = useForm();

  function onSubmit(datos) {
    console.log(datos);
  }

  return (
    <div>
      <h1>Formulario de usuario</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Nombre:</label>
        <input {...register("nombre")} />

        <label>Email:</label>
        <input {...register("email")} />

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;
