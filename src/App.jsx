//src/App.jsx
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  Phone,
  Search,
  UserRound,
  Info,
  Layers3,
  Tag,
  ArrowRight,
} from "lucide-react";

import { crearCita } from "./lib/citasApi";

const AGENCIAS = [
  "VW Cordoba",
  "VW Orizaba",
  "VW Poza Rica",
  "VW Tuxtepec",
  "VW Tuxpan",
];

const VEHICULOS = [
  "Virtus",
  "Polo",
  "Jetta",
  "Jetta GLI",
  "Golf GTI",
  "Taos",
  "Nivus",
  "Taigun",
  "Tiguan",
  "Teramont",
  "Crossport",
  "Saveiro",
  "Amarok",
  "Seminuevos",
  "Tera",
  "Avaluo",
  "Transporter",
  "Caddy",
  "Crafter",
];

const FUENTE = [
  "Facebook",
  "WhatsApp",
  "VW-Concesionarios",
  "Llamada Entrante",
  "Prospeccion",
  "Cartera",
  "Eternizacion de credito",
  "Remarketing",
  "Base de Datos",
  "Ubicacion",
];

const TIPOS_CITA = [
  "Digital",
  "Tradicional",
  "Evento",
  "Evento Taigun",
  "Remarketing",
];

const MOTIVOS_CITA = [
  "Prueba de Manejo",
  "Avalúo de auto usado",
  "Cotización de financiamiento",
  "Solicitud de Crédito",
  "Anticipo /enganche",
  "Documentos para facturación",
  "Firma de contrato",
  "Lanzamiento",
  "Open Day",
  "Información Post-venta",
  "Noche Mexicana",
  "Buen Fin 2026",
];

const TIPO_VENTA = ["Nuevos", "Usados", "Comerciales"];

const ASESORES = [
  "AURA MARLIZETH FERNANDEZ LOPEZ",
  "Bianca Isabel Chavez Alarcon",
  "ERENDIRA SANTOS COYOTZI",
  "IRENE DEL CARMEN GUIZA LOPEZ",
  "MARCOS RAUL DIAZ RAMOS",
  "MARIO ALBERTO LOPEZ RAMOS",
  "MARISOL LAGUNES GONZALEZ",
  "NALLELY HERNANDEZ GARCIA",
  "OCTAVIO BRUNO GONZALEZ",
  "ROGELIO VAZQUEZ SANCHEZ",
  "RUBEN ALBERTO TOSQUY ADRIANO",
  "Saja Azzam Mohammad Jamous",
  "SANDRA LUZ PRIETO PEREZ",
  "YAMIL MISAEL RODRIGUEZ AGUILAR",
  "LUIS ALFONSO CORIA MARROQUIN",
  "CANDY DENISSE MARQUEZ CORTES",
  "DELMAR JAVIER ILLESCAS DOMINGUEZ",
  "EDGAR JESUS GOMEZ PEREZ",
  "Valeria Zilli Durante",
  "IDALMY JIMENEZ SANCHEZ",
  "IVAN JUAREZ ORTEGA",
  "JESSICA OLIVARES CAMPOS",
  "JESUS XITLAMA GOMEZ",
  "LIZBETH CANO CLARA",
  "LUIS MANUEL PALOMARES OLAYO",
  "MARIA DEL CARMEN ZAVALA VELAZQUEZ",
  "OMAR VILLIERS MONDRAGON",
  "RUBEN ROMERO VALDES",
  "VERONICA CASTILLO FUENTES",
  "Hector Rodriguez",
  "GEOVANI NAVA DIAZ",
  "ZEILA NAVARRO CONTRERAS",
  "JOSE ALFREDO BARRANCA REYES",
  "ADRIAN GALVEZ ROLDAN",
  "MARIA DE GUADALUPE VANVOLLENHOVEN DIAZ",
  "Marelly Tenorio Salinas",
  "ELIA INES ARANO REYES",
  "JORGE LUIS ALAMILLO RODRIGUEZ",
  "Cesar Ivan Salazar Reyes",
  "Cristian Fernando Rivera Godinez",
  "DULCE ABIGAIL GARCIA OLIVARES",
  "Felix Emmanuel Solis Angeles",
  "GERMAN JARITH SALAZAR MIRANDA",
  "Iris Yazmín Gómez Velázquez",
  "Israel Garcia Juarez",
  "JORGE ANTONIO RODRIGUEZ MARTINEZ",
  "JOSE DE JESUS GARCIA ROMAN",
  "JUAN MANUEL SOBREVILLA VICENCIO",
  "Miguel Capitanachi Paredes",
  "OLIMPIA VAZQUEZ MENDEZ",
  "Roberto Ramses Luna Fajardo",
  "Carlos Arturo Garces Vengas",
  "Edgar Omar Noguera Solis",
  "Javier Perez Meraz",
  "Luis Armando Almora Perez",
  "Mara Erubey Soto Villegas",
  "Sergio Ivan Quintana Martinez",
  "Sergio Rene Delgado Sarmiento",
  "Yoseth Ruiz Castellanos",
  "Paul Serrano Vera",
  "Luis Alberto Ramírez Santamaría",
  "Luis Manuel Álvarez",
  "ESTEFANO MARLOM DE AZCUE APARICIO",
  "JOSE ALBERTO SEDAS FLORES",
  "Maria Vanessa Jiménez Medina",
  "Juan Jesús Márquez Aquino",
  "Estefano Marlom Aparicio",
  "Blanca Patricia Hernández Hernández",
  "Luis Manuel Hernández Espejo",
  "JULIO RAMIREZ LOPEZ",
  "David Uriel García Navarro",
  "Gustavo Chontal Romero",
  "Maria Monserrath Zarate Gamboa",
  "Luz Eugenia Hernandez Bustos",
];

const FORM_INICIAL = {
  agencia: "",
  nombre: "",
  telefono: "",
  auto_interes: "",
  fecha_hora_cita: "",
  tipo_cita: "",
  motivo_cita: "",
  tipo_venta: "",
  fuente_prospeccion: "",
  asesor_piso: "",
  comentarios: "",
};

function cls(...clases) {
  return clases.filter(Boolean).join(" ");
}

function texto(valor) {
  return String(valor ?? "").trim();
}

function soloNumeros(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

function normalizarBusqueda(valor) {
  return texto(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function esAsesorValido(valor) {
  return ASESORES.includes(texto(valor));
}

function validarTelefono(valor) {
  const telefono = soloNumeros(valor);

  if (telefono.length === 10) return true;
  if (telefono.length === 12 && telefono.startsWith("52")) return true;

  return false;
}

function normalizarTelefonoMx(valor) {
  const telefono = soloNumeros(valor);

  if (telefono.length === 10) {
    return `52${telefono}`;
  }

  if (telefono.length === 12 && telefono.startsWith("52")) {
    return telefono;
  }

  return "";
}

function mensajeTelefono(valor) {
  const telefono = soloNumeros(valor);

  if (!telefono) return "Captura un teléfono numérico.";
  if (telefono.length < 10) return "El teléfono debe tener mínimo 10 dígitos.";
  if (telefono.length === 11) return "Usa 10 dígitos o 52 + 10 dígitos.";
  if (telefono.length === 12 && !telefono.startsWith("52")) {
    return "Si tiene 12 dígitos debe iniciar con 52.";
  }
  if (telefono.length > 12) return "Máximo 12 dígitos.";

  return "Teléfono inválido.";
}

function normalizarPayload(form) {
  return {
    agencia: texto(form.agencia),
    nombre: texto(form.nombre).toUpperCase(),
    telefono: normalizarTelefonoMx(form.telefono),
    auto_interes: texto(form.auto_interes),
    fecha_hora_cita: texto(form.fecha_hora_cita),
    tipo_cita: texto(form.tipo_cita),
    motivo_cita: texto(form.motivo_cita),
    tipo_venta: texto(form.tipo_venta),
    fuente_prospeccion: texto(form.fuente_prospeccion),
    asesor_piso: esAsesorValido(form.asesor_piso)
      ? texto(form.asesor_piso)
      : "",
    comentarios: texto(form.comentarios),
  };
}

function obtenerErrores(form) {
  const errores = {};

  if (!texto(form.agencia)) errores.agencia = "Selecciona el dealer.";
  if (!texto(form.nombre)) errores.nombre = "Captura el nombre del cliente.";
  if (!validarTelefono(form.telefono)) errores.telefono = mensajeTelefono(form.telefono);
  if (!texto(form.auto_interes)) errores.auto_interes = "Selecciona el VW de interés.";
  if (!texto(form.fecha_hora_cita)) errores.fecha_hora_cita = "Selecciona fecha y hora.";
  if (!texto(form.tipo_cita)) errores.tipo_cita = "Selecciona el tipo de cita.";
  if (!texto(form.motivo_cita)) { errores.motivo_cita = "Selecciona el motivo de la cita."; }
  if (!texto(form.tipo_venta)) errores.tipo_venta = "Selecciona el tipo de venta.";
  if (!texto(form.fuente_prospeccion)) errores.fuente_prospeccion = "Selecciona la fuente.";
  const asesorPiso = texto(form.asesor_piso);

  if (!asesorPiso) {
    errores.asesor_piso = "Selecciona el asesor de piso.";
  } else if (!esAsesorValido(asesorPiso)) {
    errores.asesor_piso = "Debes seleccionar un asesor válido del catálogo.";
  }
  return errores;
}

// ─── COMPONENTES DE FORMULARIO ───────────────────────────────────────────────
function Campo({ id, label, icono: Icono, requerido, error, ayuda, children, className = "" }) {
  return (
    <div className={cls("min-w-0", className)}>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-white/90 sm:text-xs">
        {Icono && <Icono className="h-4 w-4 shrink-0 text-white/90" />}
        <span>{label}{requerido && <span className="ml-1 text-rose-300">*</span>}</span>
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-200" role="alert">{error}</p>
      ) : ayuda ? (
        <p className="mt-1.5 text-xs text-white/65">{ayuda}</p>
      ) : null}
    </div>
  );
}

function Input({ error, className = "", ...props }) {
  return (
    <input
      {...props}
      aria-invalid={Boolean(error)}
      className={cls(
        "h-12 w-full min-w-0 rounded-xl border bg-white/10 px-4 text-base text-white outline-none transition placeholder:text-white/55 sm:text-sm",
        "focus:border-[#5da8ff] focus:bg-white/15 focus:ring-2 focus:ring-[#2e8cff]/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-rose-300" : "border-white/25 hover:border-white/40",
        className
      )}
    />
  );
}

function Select({ error, children, className = "", ...props }) {
  return (
    <select
      {...props}
      aria-invalid={Boolean(error)}
      className={cls(
        "h-12 w-full min-w-0 cursor-pointer rounded-xl border bg-[#09265e]/90 px-4 text-base font-semibold text-white outline-none transition sm:text-sm",
        "focus:border-[#5da8ff] focus:ring-2 focus:ring-[#2e8cff]/20",
        error ? "border-rose-300" : "border-white/25 hover:border-white/40",
        className
      )}
    >
      {children}
    </select>
  );
}

function Textarea({ error, className = "", ...props }) {
  return (
    <textarea
      {...props}
      aria-invalid={Boolean(error)}
      className={cls(
        "min-h-24 w-full resize-y rounded-xl border bg-white/10 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/55 sm:text-sm",
        "focus:border-[#5da8ff] focus:bg-white/15 focus:ring-2 focus:ring-[#2e8cff]/20",
        error ? "border-rose-300" : "border-white/25 hover:border-white/40",
        className
      )}
    />
  );
}

function AsesorAutocomplete({ value, onChange, error }) {
  const [abierto, setAbierto] = useState(false);

  const opciones = useMemo(() => {
    const busqueda = normalizarBusqueda(value);
    if (!busqueda) return ASESORES.slice(0, 8);
    return ASESORES.filter((asesor) => normalizarBusqueda(asesor).includes(busqueda)).slice(0, 8);
  }, [value]);

  const esInvalido = texto(value) && !esAsesorValido(value);

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-white/65" />
      <Input
        id="asesor_piso"
        value={value}
        error={error || esInvalido}
        onFocus={() => setAbierto(true)}
        onBlur={() => window.setTimeout(() => setAbierto(false), 180)}
        onChange={(e) => {
          onChange(e.target.value);
          setAbierto(true);
        }}
        autoComplete="off"
        placeholder="Buscar asesor..."
        className="pl-11"
      />
      {abierto && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-56 overflow-y-auto rounded-xl border border-[#539eff]/40 bg-[#071b41] p-1.5 shadow-2xl">
          {opciones.length === 0 && (
            <p className="px-3 py-2 text-xs text-white/75">No hay coincidencias. Selecciona un asesor del catálogo.</p>
          )}
          {opciones.map((asesor) => (
            <button
              key={asesor}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(asesor);
                setAbierto(false);
              }}
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-white hover:bg-[#1a4b91] focus:bg-[#1a4b91] focus:outline-none"
            >
              {asesor}
            </button>
          ))}
        </div>
      )}
      {esInvalido && !error && (
        <p className="mt-1.5 text-xs text-rose-200">Selecciona un asesor de la lista.</p>
      )}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export default function App() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [mostrarErrores, setMostrarErrores] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [guardado, setGuardado] = useState(false);

  const errores = useMemo(() => obtenerErrores(form), [form]);
  const hayErrores = Object.keys(errores).length > 0;

  function updateField(campo, valor) {
    setForm((anterior) => ({ ...anterior, [campo]: valor }));
    setGuardado(false);
    setMensaje("");
  }

  function error(campo) {
    return mostrarErrores ? errores[campo] : "";
  }

  async function enviarFormulario(e) {
    e.preventDefault();
    setMostrarErrores(true);
    setMensaje("");
    setGuardado(false);

    const erroresActuales = obtenerErrores(form);
    if (Object.keys(erroresActuales).length > 0) {
      setMensaje(Object.values(erroresActuales)[0]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setEnviando(true);
      await crearCita(normalizarPayload(form));
      setGuardado(true);
      setMensaje("Cita guardada correctamente.");
      setForm(FORM_INICIAL);
      setMostrarErrores(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setMensaje(err.message || "No fue posible guardar la cita.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06152f] text-white">
      {/* Imagen colocada en public/fondo-vw.png: Vite la sirve desde la raíz. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[850px] bg-cover bg-[position:70%_top] bg-no-repeat sm:bg-center"
        style={{ backgroundImage: "url('/fondo-vw.png')" }}
      />
      {/* Capas suaves para dar contraste sin tapar el Golf GTI. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[850px] bg-gradient-to-r from-[#06152f]/80 via-[#06152f]/40 to-[#06152f]/15" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[850px] bg-gradient-to-b from-[#06152f]/20 via-[#06152f]/10 to-[#06152f]" />

      <main className="relative z-10 mx-auto w-full max-w-[1560px] px-3 pb-8 pt-5 sm:px-6 sm:pb-12 lg:px-10 lg:pt-8">
        {/* Encabezado de marca */}
        <header className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-3">
            <img
              src="/vw_white.png"
              alt="Logo Volkswagen"
              className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
            />

            <span className="text-xl font-bold tracking-tight sm:text-2xl">Volkswagen | CRM</span>
          </div>
        </header>

        {/* Título central */}
        <div className="mb-7 mt-8 text-center sm:mb-9 sm:mt-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-[#06142f]/35 px-5 py-2 text-xs font-semibold text-white backdrop-blur-md sm:text-sm">
            <CarFront className="h-4 w-4" /> Automotriz R&amp;R
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">Registro de citas</h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#1d8bff] shadow-[0_0_22px_rgba(29,139,255,0.65)]" />
        </div>

        {mensaje && (
          <div
            role="alert"
            className={cls(
              "mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold backdrop-blur-md",
              guardado ? "border-emerald-300/50 bg-emerald-900/60 text-emerald-50" : "border-rose-300/50 bg-rose-950/70 text-rose-100"
            )}
          >
            {guardado ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <Info className="h-5 w-5 shrink-0" />}
            {mensaje}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-[28px] border border-[#89baff]/50 bg-[#17366f]/55 p-4 shadow-[0_25px_75px_rgba(0,9,40,0.45)] sm:p-7 lg:p-9"
        >
          <form onSubmit={enviarFormulario} noValidate>
            <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              <Campo id="agencia" label="Dealer" icono={Building2} requerido error={error("agencia")}>
                <Select id="agencia" value={form.agencia} error={error("agencia")} onChange={(e) => updateField("agencia", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {AGENCIAS.map((agencia) => <option key={agencia} value={agencia}>{agencia}</option>)}
                </Select>
              </Campo>

              <Campo id="nombre" label="Nombre del cliente" icono={UserRound} requerido error={error("nombre")}>
                <Input id="nombre" value={form.nombre} error={error("nombre")} onChange={(e) => updateField("nombre", e.target.value.toUpperCase())} placeholder="Nombre completo" />
              </Campo>

              <Campo id="telefono" label="Teléfono" icono={Phone} requerido error={error("telefono")} ayuda="10 dígitos o 52 + 10 dígitos.">
                <Input id="telefono" value={form.telefono} error={error("telefono")} inputMode="numeric" autoComplete="tel" onChange={(e) => updateField("telefono", soloNumeros(e.target.value).slice(0, 12))} placeholder="2711234567" />
              </Campo>

              <Campo id="auto_interes" label="VW de sus sueños" icono={CarFront} requerido error={error("auto_interes")}>
                <Select id="auto_interes" value={form.auto_interes} error={error("auto_interes")} onChange={(e) => updateField("auto_interes", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {VEHICULOS.map((vehiculo) => <option key={vehiculo} value={vehiculo}>{vehiculo}</option>)}
                </Select>
              </Campo>

              <Campo id="fecha_hora_cita" label="Fecha y hora" icono={CalendarDays} requerido error={error("fecha_hora_cita")}>
                <Input id="fecha_hora_cita" type="datetime-local" value={form.fecha_hora_cita} error={error("fecha_hora_cita")} onChange={(e) => updateField("fecha_hora_cita", e.target.value)} className="scheme-dark" />
              </Campo>

              <Campo id="tipo_cita" label="Tipo de cita" icono={CalendarDays} requerido error={error("tipo_cita")}>
                <Select id="tipo_cita" value={form.tipo_cita} error={error("tipo_cita")} onChange={(e) => updateField("tipo_cita", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {TIPOS_CITA.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                </Select>
              </Campo>

              <Campo id="fuente_prospeccion" label="Fuente" icono={Layers3} requerido error={error("fuente_prospeccion")}>
                <Select id="fuente_prospeccion" value={form.fuente_prospeccion} error={error("fuente_prospeccion")} onChange={(e) => updateField("fuente_prospeccion", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {FUENTE.map((fuente) => <option key={fuente} value={fuente}>{fuente}</option>)}
                </Select>
              </Campo>

              <Campo id="asesor_piso" label="Asesor de piso" icono={Search} requerido error={error("asesor_piso")}>
                <AsesorAutocomplete value={form.asesor_piso} error={error("asesor_piso")} onChange={(asesor) => updateField("asesor_piso", asesor)} />
              </Campo>

              <Campo label="Tipo de venta" icono={CarFront} requerido error={error("tipo_venta")}>
                <div role="group" aria-label="Tipo de venta" className={cls("flex h-12 w-full items-center gap-1 rounded-xl border bg-white/10 p-1", error("tipo_venta") ? "border-rose-300" : "border-white/25")}>
                  {TIPO_VENTA.map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      aria-pressed={form.tipo_venta === tipo}
                      onClick={() => updateField("tipo_venta", tipo)}
                      className={cls(
                        "min-w-0 flex-1 rounded-lg px-1 py-2.5 text-[11px] font-bold transition sm:text-xs",
                        form.tipo_venta === tipo ? "bg-gradient-to-r from-[#248dff] to-[#0659e0] text-white shadow-[0_0_12px_rgba(36,141,255,0.5)]" : "text-white/80 hover:bg-white/10"
                      )}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </Campo>

              <Campo id="motivo_cita" label="Motivo de cita" icono={Tag} requerido error={error("motivo_cita")}>
                <Select id="motivo_cita" value={form.motivo_cita} error={error("motivo_cita")} onChange={(e) => updateField("motivo_cita", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {MOTIVOS_CITA.map((motivo) => <option key={motivo} value={motivo}>{motivo}</option>)}
                </Select>
              </Campo>

              <Campo id="comentarios" label="Comentarios" icono={MessageSquareText} className="sm:col-span-2 lg:col-span-2">
                <Textarea id="comentarios" value={form.comentarios} onChange={(e) => updateField("comentarios", e.target.value)} placeholder="Notas adicionales de la cita..." rows={3} />
              </Campo>
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#80b8ff]/30 bg-[#061943]/85 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-3 text-sm text-white/85">
                <Info className="h-5 w-5 shrink-0" />
                <span>{mostrarErrores && hayErrores ? Object.values(errores)[0] : "Revisa los datos y guarda la cita."}</span>
              </div>
              <button
                type="submit"
                disabled={enviando}
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-7 text-sm font-bold text-[#0a2b75] shadow-lg transition hover:bg-[#e9f3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {enviando ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                {enviando ? "Guardando..." : "Guardar cita"}
                {!enviando && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
