// Importar el framework Express para crear el servidor y manejar rutas
const express = require('express');
const app = express();

// Middleware para que Express pueda interpretar y procesar datos en formato JSON
app.use(express.json());

//Ejercicio 1

app.get('/api/funcion/:monto', (req, res) => {
    try {
        // extrae el monto desde la url
        const { monto } = req.params;
        
        const salario = Number(monto);

        // capturando errores, si no es un isNan o si es menor o igual a cero
        if (isNaN(salario) || salario <= 0) {
            return res.status(400).json({
                error: "El salario debe ser un número mayor a cero"
            });
        }

        //calculos
        const iva = salario * 0.13;
        const renta = salario * 0.10;

        //retona los valores si fue exitosa la ejecucion
        return res.status(200).json({
            monto: salario,
            iva: Number(iva.toFixed(2)),
            renta: Number(renta.toFixed(2))
        });

    } catch (error) {
        // capturando el error
        console.error(error);
        return res.status(500).json({ 
            error: 'Ocurrió un error interno al procesar el cálculo' 
        });
    }
});

//configuracion de servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor del Ejercicio 1 corriendo en http://localhost:${PORT}`);
});
