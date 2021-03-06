const express = require("express")
const cors = require("cors")
const app = express();
const port = 8080;

app.use(express.json())
app.use(express.urlencoded())

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

app.use((req, res, next) => {
    const allowedOrigins = ['https://web.kristensen.tech', 'https://webapplication-wdjh6.ondigitalocean.app', 'http://127.0.0.1:9000', 'http://localhost:9000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.setHeader('Access-Control-Allow-Origin', 'https://webapplication-wdjh6.ondigitalocean.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get("/items", async (req, res) => {
    var items = await prisma.item.findMany()

    await prisma.$disconnect();

    res.json(items)
});

app.put("/items/:id", async (req, res) => {    
    var id = req.params.id

    const { title, description, imageSrc, category, color, price, remaining, soldOut } = req.body

    await prisma.item.update({
        where: {
            id: Number(id)
        },
        data: {            
            title: title, 
            description: description, 
            imageSrc: imageSrc, 
            category: category, 
            color: color, 
            price: Number(price), 
            remaining: Number(remaining), 
            soldOut: soldOut
        }
    })

    res.end();
})

app.post("/carts", async (req, res) => {
    await prisma.cart.create({
        data: {
            id: req.body.id,
            content: []
        }
    })

    res.end();
})

app.get("/carts/:id", async (req, res) => {
    var id = req.params.id

    var cart = await prisma.cart.findUnique({
        where: {
            id: id
        }
    })

    if (cart === null) {
        res.status(401).send('Sorry, we cannot find that!');
    } else {
        res.json(cart)
    }
})

app.put("/carts/:id", async (req, res) => {
    var id = req.params.id

    await prisma.cart.update({
        where: {
            id: id
        },
        data: {
            content: req.body.items
        }
    })

    res.end();
})

app.listen(port, () =>
  console.log(`Web Server listening on port ${port}!`),
);

