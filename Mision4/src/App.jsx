import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {obtenerPersonas, buscarUsuario, crearUsuario, actualizarUsuario} from "./api";
import "./App.css";

const schema = z.object({
    nombre: z.string().min(4, "El nombre debe tener al menos 4 caracteres"),
    correo: z.string().email("Introduce un correo válido")
});

const ELEMENTOS = [
    "physical",
    "gun",
    "fire",
    "ice",
    "electric",
    "wind",
    "psy",
    "nuclear",
    "bless",
    "curse"
];

const NOMBRES_ELEMENTOS = {
    physical: "Físico",
    gun: "Arma",
    fire: "Fuego",
    ice: "Hielo",
    electric: "Electricidad",
    wind: "Viento",
    psy: "Psi",
    nuclear: "Nuclear",
    bless: "Bendición",
    curse: "Maldición"
};

const NOMBRES_AFINIDADES = {
    weak: "Débil",
    normal: "Normal",
    resist: "Resiste",
    null: "Anula",
    repel: "Refleja",
    absorb: "Absorbe"
};

const CLASES_AFINIDADES = {
    weak: "weak",
    normal: "normal",
    resist: "resist",
    null: "null",
    repel: "repel",
    absorb: "absorb"
};


function App() {

    const [usuario, setUsuario] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [resultados, setResultados] = useState([]);
    const [equipo, setEquipo] = useState([]);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(schema)
    });

    useEffect(() => {
        async function cargarPersonas() {

            try {

                setCargando(true);

                setError("");

                const datos = await obtenerPersonas();

                setPersonas(datos);

            } catch (error) {

                setError("No se han podido cargar las Personas");

                console.error(error);

            } finally {

                setCargando(false);

            }

        }

        cargarPersonas();

    }, []);


    // Buscador dinámico

    useEffect(() => {

        if (busqueda.trim() === "") {

            setResultados([]);

            return;

        }


        const coincidencias = personas.filter((persona) => {

            return (

                persona.nombre.toLowerCase().includes(
                    busqueda.toLowerCase()
                )

                ||

                persona.Arcana.toLowerCase().includes(
                    busqueda.toLowerCase()
                )

            );

        });


        setResultados(coincidencias.slice(0, 10));


    }, [busqueda, personas]);


    // Añadir Persona al equipo

    function agregarPersona(persona) {


        // Comprobar que no haya 6 Personas

        if (equipo.length >= 6) {

            setError("El equipo ya tiene 6 Personas");

            return;

        }

        const yaExiste = equipo.some(
            (p) => p.id === persona.id
        );


        if (yaExiste) {

            setError("Esta Persona ya está en tu equipo");

            return;

        }

        setEquipo((equipoActual) => [

            ...equipoActual,

            persona

        ]);

        setBusqueda("");
        setResultados([]);
        setError("");
        setMensaje("");

    }

    function eliminarPersona(id) {

        setEquipo((equipoActual) =>

            equipoActual.filter(
                (persona) => persona.id !== id
            )

        );

    }

    function mostrarAfinidades(persona) {

        return (

            <div className="tabla-afinidades">

                <h4>Afinidades</h4>

                <table>

                    <thead>

                        <tr>
                            <th>Elemento</th>
                            <th>Afinidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ELEMENTOS.map((elemento) => {
                            const afinidad =
                                persona.afinidades[elemento];
                            const clase =
                                CLASES_AFINIDADES[afinidad];
                            return (
                                <tr key={elemento}>
                                    <td>
                                        {NOMBRES_ELEMENTOS[elemento]}
                                    </td>
                                    <td>
                                        <span className={`afinidad ${clase}`}>

                                            {NOMBRES_AFINIDADES[afinidad]}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }


    // Guardar equipo

    async function guardarEquipo() {


        // Comprobar que el equipo tenga 6 Personas

        if (equipo.length !== 6) {

            setError("Debes seleccionar exactamente 6 Personas");

            return;

        }


        try {


            setGuardando(true);

            setError("");

            setMensaje();


            // Buscar si el usuario ya existe

            const usuarioEncontrado = await buscarUsuario(

                usuario.nombre,

                usuario.correo

            );


            // Crear objeto del usuario

            const datosUsuario = {

                nombre: usuario.nombre,

                correo: usuario.correo,

                equipo: equipo

            };


            // Si existe, actualizarlo

            if (usuarioEncontrado) {


                await actualizarUsuario({

                    ...usuarioEncontrado,

                    ...datosUsuario

                });


                setMensaje("¡Tu equipo ha sido actualizado!");


            }


            // Si no existe, crearlo

            else {


                await crearUsuario(datosUsuario);


                setMensaje("¡Tu equipo ha sido guardado!");


            }


        } catch (error) {


            setError("No se ha podido guardar el equipo");

            console.error(error);


        } finally {


            setGuardando(false);


        }

    }


    // Renderizado

    return (


        <main className="container">


            <h1>Persona 5 Team Builder</h1>


            {!usuario ? (


                // FORMULARIO DE USUARIO


                <section className="formulario">


                    <h2>Registro de usuario</h2>


                    <form

                        onSubmit={handleSubmit((datos) => {

                            setUsuario(datos);

                        })}

                    >


                        <div className="campo">


                            <label htmlFor="nombre">

                                Nombre

                            </label>


                            <input

                                id="nombre"

                                type="text"

                                {...register("nombre")}

                            />


                            {errors.nombre && (

                                <p className="error">

                                    {errors.nombre.message}

                                </p>

                            )}


                        </div>



                        <div className="campo">


                            <label htmlFor="correo">

                                Correo electrónico

                            </label>


                            <input

                                id="correo"

                                type="email"

                                {...register("correo")}

                            />


                            {errors.correo && (

                                <p className="error">

                                    {errors.correo.message}

                                </p>

                            )}


                        </div>



                        <button type="submit">

                            Continuar

                        </button>


                    </form>


                </section>


            ) : (


                // CONSTRUCTOR DEL EQUIPO


                <section className="constructor">


                    <h2>

                        Bienvenido, {usuario.nombre}

                    </h2>


                    <p>

                        Selecciona seis Personas para tu equipo.

                    </p>



                    {/* BUSCADOR */}


                    <div className="buscador">


                        <input

                            type="text"

                            placeholder="Buscar Persona o Arcana..."

                            value={busqueda}

                            onChange={(e) => {

                                setBusqueda(e.target.value);

                                setError("");

                            }}

                        />


                    </div>



                    {/* ESTADO DE CARGA */}


                    {cargando && (

                        <p>

                            Cargando Personas...

                        </p>

                    )}



                    {/* RESULTADOS DE BÚSQUEDA */}


                    {resultados.length > 0 && (


                        <div className="resultados">


                            {resultados.map((persona) => (


                                <button

                                    type="button"

                                    key={persona.id}

                                    onClick={() => agregarPersona(persona)}

                                    className="resultado"

                                >


                                    <span>

                                        {persona.nombre}

                                    </span>


                                    <span>

                                        {persona.Arcana}

                                    </span>


                                </button>


                            ))}


                        </div>


                    )}



                    {/* EQUIPO SELECCIONADO */}


                    <h3>

                        Equipo: {equipo.length}/6

                    </h3>



                    <div className="equipo-grid">


                        {equipo.map((persona) => (


                            <article

                                className="persona-card"

                                key={persona.id}

                            >


                                {/* INFORMACIÓN DE PERSONA */}


                                <div className="persona-header">


                                    <h3>

                                        {persona.nombre}

                                    </h3>


                                    <p>

                                        Arcana: {persona.Arcana}

                                    </p>


                                    <button

                                        type="button"

                                        onClick={() => eliminarPersona(persona.id)}

                                    >

                                        Eliminar

                                    </button>


                                </div>



                                {/* MATRIZ DE AFINIDADES */}


                                {mostrarAfinidades(persona)}


                            </article>


                        ))}


                    </div>



                    {/* ERRORES */}


                    {error && (


                        <p className="error">

                            {error}

                        </p>


                    )}



                    {/* MENSAJES */}


                    {mensaje && (


                        <p className="mensaje">

                            {mensaje}

                        </p>


                    )}



                    {/* BOTÓN DE GUARDADO */}


                    <button

                        type="button"

                        onClick={guardarEquipo}

                        disabled={guardando || equipo.length !== 6}

                    >


                        {guardando

                            ? "Guardando..."

                            : "Guardar equipo"}


                    </button>


                </section>


            )}


        </main>


    );


}


export default App;