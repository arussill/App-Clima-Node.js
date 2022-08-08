const fs = require("fs");
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    this.leerBD();
  }

  // parametros del endpoint de lugar
  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY, //para acceder a las variables de entorno especificamente al MAPBOX_KEY que tiene el token de la app de mapbox
      limit: 5,
      language: "es",
    };
  }

  // parametros del endpoint de clima
  get paramsOpenWeather() {
    return {
      appid: process.env.OPEN_WEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  //metodo para obtener el historial
  get historialCapitalizado() {
    //capitalizar cada palabra
    return this.historial.map((lugar) => {
      let palabra = lugar.split(" ");
      let palabraCapitalizada = palabra.map(
        (inicial) => inicial[0].toUpperCase() + inicial.substring(1)//el substring es para obtener la palabra sin la primera letra
        );
        return palabraCapitalizada.join(" ");
    });
  }

  async ciudad(lugar = "") {
    //Siempre es bueno usara un try catch para cuando se maneja peticiones axios
    try {
      //peticion http
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });

      const resp = await instance.get(); //retorna la respuesta de la peticion get que se hizo con axios

      // de la respuesta obtenida se saca la data y las caracteristicas ausar del lugar que se busco
      return resp.data.features.map((lugar) => ({
        //se retorna como objeto las propiedades que se necesiten de ese lugar
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      //si se quiere rebentar la app se lanza un error throw new Error('Error');
      //Aqui se esta enviando un arreglo vacio
      console.log(error);
      return [];
    }

    return []; //retornar los lugares
  }

  async climaLugar(lat, lon) {
    try {
      //intance axios.create()
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeather, lat, lon }, //se desestructura el getter y se le agrega el parametro lat y lon
      });

      //resp data
      const resp = await instance.get();
      const { weather, main } = resp.data; //se desestructura el objeto resp.data porque debemos sacar de weather y main las propiedades que necesitamos

      return {
        desc: weather[0].description, //como weather es un arreglo se debe usar el [0] para obtener el primer elemento y sacar la propiedad description
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  arregarHistorial(lugar = "") {
    //Para evitar duplicados
    if (this.historial.includes(lugar.toLocaleLowerCase())) return;

    this.historial = this.historial.slice(0, 5); //se saca el historial hasta el 6to elemento para que solo muestre esos
    
    //Agrega al arreglo historial el lugar que se busco
    this.historial.unshift(lugar.toLocaleLowerCase());

    //Grabar en DB
    this.guardarDB();
  }

  guardarDB() {
    const paylod = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(paylod));
  }

  leerBD() {
    //Si no existe no se hace nada
    if (!fs.existsSync(this.dbPath)) return;

    //si existe
    //cargar la informacion de la db
    const info = fs.readFileSync(this.dbPath, "utf8");

    //parsear la informacion para retornar un objeto
    const data = JSON.parse(info);

    //asignar el historial la informacion de la db
    this.historial = data.historial;
  }
}

module.exports = Busquedas;
