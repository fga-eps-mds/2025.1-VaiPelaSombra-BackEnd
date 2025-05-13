// TODO: Criar o arquivo de rotas para preferências de viagem

/**
 * Arquivo: src/routes/userPreferences.routes.ts
 *
 * Objetivo:
 * - Definir as rotas HTTP relacionadas às preferências de viagem do usuário.
 *
 * Requisitos:
 * - Importar o `Router` do Express. [X]
 * - Importar as funções `postUserPreferences` e `getUserPreferencesById` do controller.
 * - Criar as seguintes rotas:
 *
 *   1. POST /api/user-preferences
 *      - Handler: postUserPreferences
 *      - Deve receber os dados de preferências do usuário e enviar ao controller.
 *
 *   2. GET /api/user-preferences/:userId
 *      - Handler: getUserPreferencesById
 *      - Deve receber o ID do usuário pela URL e retornar suas preferências.
 *
 * - Exportar o router como default.
 *
 * Exemplo básico:
 *   const router = Router();
 *   router.post("/", postUserPreferences);
 *   router.get("/:userId", getUserPreferencesById);
 *   export default router;
 *
 * Observações:
 * - As rotas devem ser registradas no app principal (src/app.ts), com:
 *     app.use("/api/user-preferences", userPreferencesRoutes);
 */

import { Router } from 'express';
import {
  postUserPreferences,
  getUserPreferencesById,
} from '../controllers/userPreferences.controller';

const router = Router();

// Rota para criar/salvar preferências do usuário
router.post('/', postUserPreferences);

// Rota para obter preferências de um usuário pelo ID
router.get('/:userId', getUserPreferencesById);

export default router;
