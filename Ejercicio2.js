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
