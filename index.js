const puppeteer = require("puppeteer");
const express = require("express");
const { contentType } = require("express/lib/response");
const app = express();
const port = 3000;

app.get("/", function (req, res) {
  res.json({
    status: "API Its Working",
    message: "Welcome to RESTHub crafted with love!",
  });
});

app.get("/jornada", function (req, res) {
  (async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(
      "https://resultados.as.com/resultados/futbol/primera/2022_2023/jornada/"
    );

    //await page.screenshot({path:'prueba.jpg'})

    //await page.waitForSelector('.cont-modulo resultados')

    const results = await page.evaluate(() => {
      let objeto = {};
      const jornada = document.querySelector(".tit-jornada").innerText;

      const partidos = document.querySelectorAll(".list-resultado");
      const data = [];
      partidos.forEach((partido) => {
        data.push({
          escudoLocal: partido.querySelector(
            ".equipo-local a .cont-img-escudo img"
          ).src,
          local: partido.querySelector(".equipo-local a").innerText,
          escudoVisitante: partido.querySelector(
            ".equipo-visitante a .cont-img-escudo img"
          ).src,
          visitante: partido.querySelector(".equipo-visitante a").innerText,
          resultado: partido.querySelector(".cont-resultado a").innerText,
        });
      });

      objeto = {
        jornada,
      };

      data.push(objeto);

      return data;
    });

    console.log(results.length);
    console.log(results);
    res.json({
      results,
    });

    await browser.close();
  })();
}); //cierre del endpoint jornada

app.get("/clasificacion", function (req, res) {
  (async () => {
    const browser1 = await puppeteer.launch({ headless: true });
    const page1 = await browser1.newPage();
    await page1.setViewport({ width: 1920, height: 1080 });
    await page1.goto(
      "https://resultados.as.com/resultados/futbol/primera/clasificacion/?omnil=src-sab"
    );

    const ress = await page1.evaluate(() => {
      const posiciones = document.querySelectorAll(
        "#clasificacion-total .cont-modulo .completa .tabla-datos tbody tr"
      );
      const dataPosicion = [];
      posiciones.forEach((posicion) => {
        dataPosicion.push({
          num: posicion.querySelector(".cont-nombre-equipo .pos").innerText,
          nombre: posicion.querySelector("a .nombre-equipo").innerText,
          escudo: posicion.querySelector(
            ".cont-nombre-equipo a .cont-img-escudo img"
          ).src,
          puntos: posicion.querySelector(".destacado").innerText,
        });
      });

      return dataPosicion;
    });

    console.log(ress.length);

    res.json({
      ress,
    });

    await browser1.close();
  })();
}); // cierre del endpoint clasificacion

app.get("/equipos", function (req, res) {
  (async () => {
    const browser1 = await puppeteer.launch({ headless: true });
    const page1 = await browser1.newPage();
    await page1.setViewport({ width: 1920, height: 1080 });
    await page1.goto(
      "https://resultados.as.com/resultados/futbol/primera/equipos/"
    );

    const ress = await page1.evaluate(() => {
      const posiciones = document.querySelectorAll(
        ".equipos-inferior .row ul .content-info-mod-equipo"
      );
      const dataPosicion = [];
      posiciones.forEach((posicion) => {
        dataPosicion.push({
          nombre: posicion.querySelector("a .escudo").innerText,
          escudo: posicion.querySelector("a .escudo img").src,
          estadisticas:
            "https://resultados.as.com" +
            posicion.querySelector("a").getAttribute("href"),
          partidos_jugados:'',
          goles_favor:'',
        });
      });

      return dataPosicion;
    });

    console.log(ress.length);

    //console.log(ress[0])
    
    const datos=[]
    for (i = 0; i < ress.length; i++) {
      
      await page1.goto(ress[i].estadisticas);

      const lista= await page1.waitForSelector('.data-list-horiz ul');
      const objeto= await lista.$('li:nth-child(3) .txt-dato-ppal')
      const getObjeto= await page1.evaluate(objeto=>objeto.innerText, objeto)
      const objeto1= await lista.$('li:nth-child(4) .txt-dato-ppal')     
      const getObjeto1= await page1.evaluate(objeto1=>objeto1.innerText, objeto1)
      console.log(getObjeto)  
      

      ress[i].partidos_jugados=getObjeto
      ress[i].goles_favor=getObjeto1
        
      }   
    

    res.json({
      ress,
    });

    await browser1.close();
  })();
}); // cierre del endpoint equipos

app.listen(port, () =>
  console.log(`App de ejemplo escuchando el puerto ${port}!`)
);
