const express = require('express');
const app = express();
const fs = require('fs').promises;

const hostname = '127.0.0.1';
const port = 3000;

// Setup view engine
//app.set('views',path.dirname('./views'));
//app.set('view engine', 'ejs');

async function listarArquivos(diretorio,arquivos) {

  if(!arquivos)
    arquivos = [];

  let listaDeAeroportos = await fs.readdir(diretorio)
  for(let i in listaDeAeroportos) {
    arquivos.push(listaDeAeroportos[i]);
  }
  return arquivos
}

async function listarArquivosDoDiretorio(diretorio, arquivos) {

  if(!arquivos)
      arquivos = [];

  let listaDeArquivos = await fs.readdir(diretorio);
  for(let k in listaDeArquivos) {
      let stat = await fs.stat(diretorio + '/' + listaDeArquivos[k]);
      console.log(stat)
      if(stat.isDirectory())
          await listarArquivosDoDiretorio(diretorio + '/' + listaDeArquivos[k], arquivos);
      else
          arquivos.push(listaDeArquivos[k]);
  }

  return arquivos;

}

app.get('/', async (req, res, next) => {
  let aeroportos = await listarArquivos('../charts')
  res.json(aeroportos)
  /* res.render('views/index')
  res.render('index',{
      title: "Meu primeiro servidor Express",
      aeroportos
  }); */

});

app.get('/cartas', async (req, res, next) => {
  let aeroportos = await listarArquivosDoDiretorio('./charts/SBAX')
  res.render('cartas',{
    title: "Meu primeiro servidor Express",
    aeroportos
  })
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});