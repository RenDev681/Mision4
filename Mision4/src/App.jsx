import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {obtenerPersonas, obtenerFusiones, buscarUsuario, crearUsuario, actualizarUsuario} from "./api";
import "./App.css";

const schema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
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

const IMAGENES_ELEMENTOS = {
    physical: "/src/assets/physical.png",
    gun: "/src/assets/gun.png",
    fire: "/src/assets/fire.png",
    ice: "/src/assets/ice.png",
    electric: "/src/assets/electric.png",
    wind: "/src/assets/wind.png",
    psy: "/src/assets/psy.png",
    nuclear: "/src/assets/nuclear.png",
    bless: "/src/assets/bless.png",
    curse: "/src/assets/curse.png"
};

function App() {

    const [usuario, setUsuario] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [fusiones, setFusiones] = useState([]);
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
    async function cargarDatos() {

        try{

            setCargando(true);
            setError("");

            const datosPersonas = await obtenerPersonas();

            setPersonas(datosPersonas);

            const datosFusiones = await obtenerFusiones();

            setFusiones(datosFusiones);

        }catch (error){

            setError("No se han podido cargar las Personas o las fusiones");
            console.error(error);

        } finally {
            setCargando(false);
        }
    }
    cargarDatos();

}, []);

    useEffect(() => {

        if (busqueda.trim() === "") {
            setResultados([]);
            return;
        }

        const coincidencias = personas.filter((persona) => {

            return (
                persona.nombre.toLowerCase().includes(busqueda.toLowerCase())||persona.Arcana.toLowerCase().includes(busqueda.toLowerCase())
            );
        });

        setResultados(coincidencias.slice(0, 10));
    }, [busqueda, personas]);

    function agregarPersona(persona) {

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

        setEquipo((equipoActual) => [...equipoActual, persona]);

        setBusqueda("");
        setResultados([]);
        setError("");
        setMensaje("");

    }

    function eliminarPersona(id) {

        setEquipo((equipoActual) =>equipoActual.filter((persona) => persona.id !== id));
    }

    function buscarFusion(persona1, persona2) {

        const fusionEncontrada = fusiones.find((fusion) => {

            const primera = String(fusion.persona1);
            const segunda = String(fusion.persona2);
            const idPersona1 = String(persona1.id);
            const idPersona2 = String(persona2.id);

            return ((primera === idPersona1 && segunda === idPersona2)||(primera === idPersona2 && segunda === idPersona1));
        });

        return fusionEncontrada ? fusionEncontrada.resultado : "-";
    }

    function mostrarAfinidades(persona) {

        return (
            <div className="tabla-afinidades">
                <h4>Afinidades</h4>
                <table>
                    <thead>
                        <tr>
                            {ELEMENTOS.map((elemento) => (
                                <th key={elemento}>
                                    <img
                                        src={IMAGENES_ELEMENTOS[elemento]}
                                        alt={NOMBRES_ELEMENTOS[elemento]}
                                        className="imagen-elemento"
                                        title={NOMBRES_ELEMENTOS[elemento]}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {ELEMENTOS.map((elemento) => {
                                const afinidad =
                                    persona.afinidades[elemento];

                                const clase =
                                    CLASES_AFINIDADES[afinidad];

                                return (
                                    <td key={elemento}>

                                        <span className={`afinidad ${clase}`}>
                                            {NOMBRES_AFINIDADES[afinidad]}
                                        </span>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    async function guardarEquipo() {

        if(equipo.length !== 6){

            setError("Debes seleccionar exactamente 6 Personas");
            return;
        }

        try{


            setGuardando(true);
            setError("");
            setMensaje();

            const usuarioEncontrado = await buscarUsuario(

                usuario.nombre,
                usuario.correo
            );

            const datosUsuario = {

                nombre: usuario.nombre,
                correo: usuario.correo,
                equipo: equipo
            };

            if (usuarioEncontrado) {

                await actualizarUsuario({...usuarioEncontrado,...datosUsuario});
                setMensaje("¡Tu equipo ha sido actualizado!");
            }else {

                await crearUsuario(datosUsuario);
                setMensaje("¡Tu equipo ha sido guardado!");
            }
        }catch(error){


            setError("No se pudo guardar el equipo");
            console.error(error);
        }finally{
            setGuardando(false);
        }
    }
    return (

        <main className="container">
            <h1>Constructor de equipo P5</h1>

            {!usuario?(
                <section className="formulario">

                    <h2>Registro de usuario</h2>

                    <form onSubmit={handleSubmit((datos) => {setUsuario(datos);})}>
                        <div className="campo">

                            <label htmlFor="nombre">Nombre</label>

                            <input id="nombre" type="text" {...register("nombre")}/>
                            {errors.nombre && (<p className="error">{errors.nombre.message}</p>)}
                        </div>
                        <div className="campo">
                            <label htmlFor="correo">Correo electrónico</label>

                            <input id="correo" type="email" {...register("correo")}/>
                            {errors.correo && (<p className="error">{errors.correo.message}</p>)}
                        </div>
                        <button type="submit">Continuar</button>
                    </form>
                </section>
            ):(
                <section className="constructor">

                    <h2>Bienvenido, {usuario.nombre}</h2>
                    <p> Selecciona seis Personas para tu equipo.</p>

                    <div className="buscador">
                        <input

                            type="text" placeholder="Buscar Persona o Arcana..." value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setError("");
                            }}
                        />

                    </div>


                    {cargando && (<p> Cargando Personas y fusiones...</p>)}

                    {resultados.length > 0 && (

                        <div className="resultados">
                            {resultados.map((persona) => (

                                <button type="button" key={persona.id} onClick={() => agregarPersona(persona)} className="resultado">
                                    <span>{persona.nombre}</span>
                                </button>
                            ))}
                        </div>
                    )}



                    {equipo.length > 1 && (
                        <div className="tabla-fusiones">
                            <h2>Tabla de fusiones</h2>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Persona</th>

                                        {equipo.map((persona) => (
                                            <th key={persona.id}>
                                                {persona.nombre}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {equipo.map((persona1) => (
                                        <tr key={persona1.id}>
                                            <th>{persona1.nombre}</th>

                                            {equipo.map((persona2) => (
                                                <td key={persona2.id}>
                                                    {String(persona1.id) === String(persona2.id)? "-": buscarFusion(persona1, persona2)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    
                    <h3>Equipo: {equipo.length}/6</h3>

                    <div className="equipo-grid">

                        {equipo.map((persona) => (

                            <article className="persona-card" key={persona.id}>

                                <div className="persona-header">

                                    <h3>{persona.nombre}</h3>

                                    <p>Arcana: {persona.Arcana}</p>
                                    <img
                                        src={IMAGENES_ELEMENTOS[persona.Inherit]}
                                        alt={NOMBRES_ELEMENTOS[persona.Inherit]}
                                        title={NOMBRES_ELEMENTOS[persona.Inherit]}
                                    />
                                    <button type="button" onClick={() => eliminarPersona(persona.id)}>Eliminar</button>
                                </div>
                                
                                {mostrarAfinidades(persona)}
                            </article>
                        ))}
                    </div>

                    {error && (<p className="error">{error}</p>)}
                    {mensaje && (<p className="mensaje">{mensaje}</p>)}
                    <button type="button"onClick={guardarEquipo}disabled={guardando || equipo.length !== 6}>
                        {guardando? "Guardando...": "Guardar equipo"}
                    </button>
                </section>
            )}
        </main>
    );
}
export default App;