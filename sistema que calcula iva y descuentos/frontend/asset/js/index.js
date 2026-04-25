    const form = document.getElementById("formulario");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const costoBase = document.getElementById("costoBase").value;
      const iva = document.getElementById("iva").value;
      const descuento = document.getElementById("descuento").value;

      try {
        const res = await fetch("http://localhost:3010/calcular-valor-final", {
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

        document.getElementById("resultado").innerText =
          `${data.titulo}: ${data.valor}`;

      } catch (error) {
        console.error(error);
      }
    });
