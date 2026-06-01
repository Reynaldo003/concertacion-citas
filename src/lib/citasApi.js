//src/lib/citasApi.js
const API_URL =
  import.meta.env.VITE_API_URL || "https://crm.grupoautomotrizryr.com";
// import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getAuthHeader() {
  try {
    const token = localStorage.getItem("auth.access");

    if (!token || token === "undefined" || token === "null") {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  } catch {
    return {};
  }
}

function limpiarTexto(valor) {
  return String(valor ?? "").trim();
}

function soloNumeros(valor) {
  return String(valor ?? "").replace(/\D/g, "");
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

function obtenerMensajeError(data) {
  if (!data) return "No se pudo guardar la cita en el servidor.";

  if (typeof data === "string") return data;

  if (data.detail) return data.detail;
  if (data.message) return data.message;
  if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
    return data.non_field_errors[0];
  }

  const primerError = Object.values(data).find((valor) => {
    return Array.isArray(valor) ? valor[0] : valor;
  });

  if (Array.isArray(primerError)) return primerError[0];
  if (typeof primerError === "string") return primerError;

  return "No se pudo guardar la cita en el servidor.";
}

export async function crearCita(respuestas) {
  const payload = {
    nombre: limpiarTexto(respuestas.nombre).toUpperCase(),
    telefono: normalizarTelefonoMx(respuestas.telefono),
    correo: "",

    agencia: limpiarTexto(respuestas.agencia),
    auto_interes: limpiarTexto(respuestas.auto_interes),
    fecha_hora_cita: limpiarTexto(respuestas.fecha_hora_cita) || null,

    tipo_cita: "Tradicional",
    fuente_prospeccion: limpiarTexto(respuestas.fuente_prospeccion),
    asesor_piso: limpiarTexto(respuestas.asesor_piso),
    comentarios: limpiarTexto(respuestas.comentarios),
  };

  const respuesta = await fetch(`${API_URL}/citas/api/citas/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  let data = null;

  try {
    data = await respuesta.json();
  } catch {
    data = null;
  }

  if (!respuesta.ok) {
    throw new Error(obtenerMensajeError(data));
  }

  return data;
}
