const express = require('express');
const app = express();
app.use(express.json());

const tarifasPorPais = { // Tarifas por pais
  elsalvador: 1.50,
  guatemala: 2.00,
  honduras: 2.25,
  nicaragua: 2.50,
  costarica: 3.00,
  panama: 3.50
};


function calcularCostoBase(peso, tarifa) { // Costo Base = Peso x Tarifa
  return peso * tarifa;
}


function calcularDescuento(peso, costoBase) { // Si el peso es mayor a 20kg, se aplica un descuento del 10%
  if (peso > 20) {
    return costoBase * 0.10;
  }
  return 0;
}


function calcularRecargo(peso) { // Si el peso es menor a 1kg, se aplica un recargo de $5.00
  if (peso < 1) {
    return 5.00;
  }
  return 0;
}


function calcularEnvio(pais, peso) { // Función principal que arma el resultado final
  const tarifa = tarifasPorPais[pais];

  const costoBase = calcularCostoBase(peso, tarifa);
  const descuento = calcularDescuento(peso, costoBase);
  const recargo = calcularRecargo(peso);
  const total = costoBase - descuento + recargo;

  return {
    pais,
    peso,
    tarifaPorKg: tarifa,
    costoBase,
    descuento,
    recargo,
    total
  };
}

const paisesPermitidos = Object.keys(tarifasPorPais);

function validarPais(pais) { // Validar que el país sea válido
  if (!pais || typeof pais !== 'string') {
    return 'El país es obligatorio y debe ser un texto';
  }
  const paisNormalizado = pais.toLowerCase().trim();
  if (!paisesPermitidos.includes(paisNormalizado)) {
    return `País no permitido. Países válidos: ${paisesPermitidos.join(', ')}`;
  }
  return null;
}

// Validar que el peso sea válido
function validarPeso(peso) {
  if (peso === undefined || peso === null || peso === '') {
    return 'El peso es obligatorio';
  }
  const pesoNumerico = Number(peso);
  if (isNaN(pesoNumerico)) {
    return 'El peso debe ser un valor numérico';
  }
  if (pesoNumerico <= 0) {
    return 'El peso debe ser mayor a cero';
  }
  return null;
}

app.post('/api/calcular-envio', (req, res) => {
  try {
    const { pais, peso } = req.body;

    const errorPais = validarPais(pais);
    if (errorPais) {
      return res.status(400).json({ error: errorPais });
    }

    const errorPeso = validarPeso(peso);
    if (errorPeso) {
      return res.status(400).json({ error: errorPeso });
    }

    const paisNormalizado = pais.toLowerCase().trim();
    const pesoNumerico = Number(peso);

    const resultado = calcularEnvio(paisNormalizado, pesoNumerico);

    return res.status(200).json(resultado);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocurrió un error interno al calcular el envío' });
  }
});

//SERVIDOR 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

