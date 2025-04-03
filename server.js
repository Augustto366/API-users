import express from 'express';
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import cors from 'cors';

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Conectado ao MongoDB com Prisma!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
  }
}

main()

const app = express();
app.use(express.json());
app.use(cors());

app.post('/users', async (req, res) => {

    const saltRounds = 10;
    const password = req.body.password

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.create({

        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age,
            password: hashedPassword
        }
    })

    res.status(201).json(req.body);
})

app.get('/users', async (req, res) => {

    let users = []

    if (req.query) {
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email,
                age: req.query,
                password: users.password
            }
        })
    } else {
        const users = await prisma.user.findMany()
    }

    res.status(200).json(users)
});

app.put('/users/:id', async (req, res) => {
    await prisma.user.update({

        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json(req.body);
})

app.delete('/users/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({ message: "Usuário deletado com sucesso!" })
})


app.listen(3000);