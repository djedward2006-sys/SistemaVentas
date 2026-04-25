const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 3010;

// =====================
// CORS CONFIG (IMPORTANTE)
// =====================
app.use(cors({
  origin: "*" // puedes cambiar esto luego por tu frontend
}));

app.use(express.json());

// =====================
// SWAGGER CONFIG
// =====================
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Cálculo de Valor Final",
    version: "1.0.0",
    description: "Calcula el valor final aplicando descuento y luego IVA"
  },
  servers: [
    {
      url: "https://sistemaventas-1.onrender.com"
    }
  ],
  paths: {
    "/calcular-valor-final": {
      post: {
        summary: "Calcula el valor final de un producto",
        description: "Aplica primero descuento y luego calcula IVA sobre el valor con descuento",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  costoBase: { type: "number", example: 100000 },
                  iva: { type: "number", example: 19 },
                  descuento: { type: "number", example: 15 }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Cálculo exitoso"
          },
          400: {
            description: "Datos inválidos"
          }
        }
      }
    }
  }
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// =====================
// ENDPOINT PRINCIPAL
// =====================
app.post("/calcular-valor-final", (req, res) => {
  let { costoBase, iva, descuento } = req.body;

  costoBase = Number(costoBase);
  iva = Number(iva);
  descuento = Number(descuento);

  if (
    !isFinite(costoBase) ||
    !isFinite(iva) ||
    !isFinite(descuento) ||
    costoBase < 0 ||
    iva < 0 ||
    descuento < 0
  ) {
    return res.status(400).json({
      codigo: 400,
      titulo: "Datos inválidos",
      valor: 0
    });
  }

  if (iva > 100 || descuento > 100) {
    return res.status(400).json({
      codigo: 400,
      titulo: "IVA o descuento fuera de rango",
      valor: 0
    });
  }

  try {
    const costoConDescuento =
      costoBase - (costoBase * descuento / 100);

    const ivaCalculado =
      costoConDescuento * iva / 100;

    const valorFinal =
      costoConDescuento + ivaCalculado;

    return res.status(200).json({
      codigo: 200,
      titulo: "Valor final a pagar",
      valor: Math.round(valorFinal)
    });

  } catch (error) {
    return res.status(400).json({
      codigo: 400,
      titulo: "Error en el cálculo",
      valor: 0
    });
  }
});

// =====================
// RUTA TEST (MUY ÚTIL)
// =====================
app.get("/", (req, res) => {
  res.send("API funcionando correctamente 🚀");
});

// =====================
// SERVIDOR
// =====================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en https://sistemaventas-1.onrender.com`);
});