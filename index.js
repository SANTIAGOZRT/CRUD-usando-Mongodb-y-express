import express from "express";
import fs from "fs";
import bodyParser from "body-parser";


const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

app.get('/', (req, res) => {
  res.send("Bienvenido a la API de Productos");
  });

app.get("/productos", (req, res) => {
    const data = readData();
    res.json(data.productos);
});

app.get("/productos/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const productos = data.productos.find((productos) => productos.id === id);
  res.json(productos);
});

app.post("/productos", (req, res) => {
  const data = readData();
  const body = req.body;
  const newProducto = { id: data.productos.length + 1, ...body };
data.productos.push(newProducto);
writeData(data);
res.json(newProducto);

});

 app.put("/productos/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const productosindex = data.productos.findIndex((productos) => productos.id === id);
    data.productos[productosindex] = {
        ...data.productos[productosindex],
        ...body,
    };
    writeData(data);
    res.json({message: "Producto actualizado correctamente"});
 });   

 app.delete("/productos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const productosindex = data.productos.findIndex((productos) => productos.id === id);
    data.productos.splice(productosindex, 1);
    writeData(data);
    res.json({message: "Producto eliminado correctamente"});
});    

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

app.post('/productos', (req, res, next) => {
  console.log('Cuerpo crudo recibido:', req.rawBody);
  next();
});


app.listen(3000, () => {
  console.log("El servidor esta trabajando en el puerto 3000");
});