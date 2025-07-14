// src/routes/list.routes.ts
import { Router } from 'express';
// import { ListController } from '../controllers/list.controller'; // Importe seu controller de listas se tiver um

const router = Router();
// const listController = new ListController(new ListService()); // Exemplo de instância do controller

// Rota para criar uma nova lista
router.post('/', (req, res) => {
    // Lógica para criar uma nova lista
    const { name } = req.body;
    // Aqui você faria a lógica de salvar no banco de dados, associar ao usuário, etc.
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'O nome da lista é obrigatório.' });
    }
    console.log(`Lista "${name}" criada com sucesso no backend!`);
    res.status(201).json({ id: Date.now(), name: name }); // Retorno de exemplo
});

export default router;