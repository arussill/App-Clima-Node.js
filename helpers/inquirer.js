const inquirer = require("inquirer");

require('colors');

const inquirerMenu = async () => {
  console.clear();
  console.log("===========================================".blue);
  console.log("           APLICACION DEL CLIMA:".green);
  console.log("===========================================\n".blue);

  const preguntas = [
    {
      type: "list",
      name: "opcion",
      message: "¿Que desea hacer?",
      choices: [
        {
          value: 1,
          name: `${"1.".green} Buscar ciudad`,
        },
        {
          value: 2,
          name: `${"2.".green} Histoiral`,
        },
        {
          value: 0,
          name: `${"0.".green} Salir`,
        },
      ], 
    },
  ];

  const { opcion } = await inquirer.prompt(preguntas); 

  return opcion;
};

const pausa = async () => {
  const siguiente = [
    {
      type: "input",
      name: "continuar",
      message: `Presione ${"ENTER".green} para continuar\n`,
      // default: "ENTER",
    },
  ];

  console.log("\n");
  const continuar = await inquirer.prompt(siguiente);
  return continuar;
};

const leerInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "descripcion",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];
  const { descripcion } = await inquirer.prompt(question);
  return descripcion;
};

const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, index) => {
    const idx = `${index + 1}.`.green;
    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`,
    };
  });

  choices.unshift({
    value: "0",
    name: `${"0.".green} Cancelar`,
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(preguntas);
  return id;
};

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
};
