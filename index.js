require("dotenv").config(); //paquete de npm para leer las variables de entorno del archivo .env

const {
  inquirerMenu,
  leerInput,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

// console.clear();
// console.log(process.env);//para ver las variables de entorno del archivo .env
//el archivo .env es un aechivo que evita subir al github, se usaria uno parecido donde se dejan las instruciones de cuales deberian ser las variables de entorno para ayudar a quien use la app

const main = async () => {
  const busquedas = new Busquedas();
  let opt = "";

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //mostrar mensaje
        const termino = await leerInput("Ingrese la ciudad:");

        // Buscar los lugares
        const lugares = await busquedas.ciudad(termino);

        //Seleccionar el lugar
        const idSelect = await listarLugares(lugares);
        //este condicional es para cuando el usuarios despues de buscar un lugar quiere cancelar la busqueda con la opcio 0 que aparece en el menu
        if (idSelect === "0") continue;

        const lugarSelect = lugares.find((lugar) => lugar.id === idSelect);

        //Guardar en DB
        busquedas.arregarHistorial(lugarSelect.nombre); //esti para guardar en el historial los lugar que el usuario seleciono en el menu y mostrarlo en el caso 2 de historial

        //Clima
        const clima = await busquedas.climaLugar(
          lugarSelect.lat,
          lugarSelect.lng
        );

        //Mostrar Resultados
        console.clear();
        console.log("\nInformación de la ciudad\n".green);
        console.log("Ciudad:", lugarSelect.nombre.green);
        console.log("Lat:", lugarSelect.lat);
        console.log("Lng:", lugarSelect.lng);
        console.log(`Temperatura: ${clima.temp}°C`);
        console.log(`Mínima: ${clima.min}°C`);
        console.log(`Máxima: ${clima.max}°C`);
        console.log("Descripción:", clima.desc);

        break;

      case 2:
        busquedas.historialCapitalizado.forEach((lugar, index) => {
          const idx = `${index + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
