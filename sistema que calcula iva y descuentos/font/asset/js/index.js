const form = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener valores
  const codigo = document.getElementById("codigo").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const costoBase = document.getElementById("costoBase").value;
  const iva = document.getElementById("iva").value;
  const descuento = document.getElementById("descuento").value;

  // =========================
  // VALIDACIONES FRONTEND
  // =========================

  // Código alfanumérico
  const codigoRegex = /^[a-zA-Z0-9]+$/;
  if (!codigoRegex.test(codigo)) {
    resultado.innerText = "❌ Código inválido (solo letras y números)";
    return;
  }

  // Nombre solo letras
  const nombreRegex = /^[a-zA-Z\s]+$/;
  if (!nombreRegex.test(nombre)) {
    resultado.innerText = "❌ Nombre inválido (solo letras)";
    return;
  }

  try {
    const res = await fetch("https://sistemaventas-1.onrender.com/calcular-valor-final", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        costoBase: Number(costoBase),
        iva: Number(iva),
        descuento: Number(descuento)
      })
    });

    const data = await res.json();

    // =========================
    // RESPUESTA
    // =========================
    if (res.status === 200) {
      resultado.innerText = `✅ ${data.titulo}: $${data.valor}`;
    } else {
      resultado.innerText = `❌ ${data.titulo}`;
    }

  } catch (error) {
    console.error(error);
    resultado.innerText = "❌ Error al conectar con el servidor";
  }
});