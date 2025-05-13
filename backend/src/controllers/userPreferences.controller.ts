// TODO: Criar o controller de preferências de viagem

/**
 * Arquivo: src/controllers/userPreferences.controller.ts
 *
 * Objetivo:
 * - Criar as funções que receberão requisições HTTP (POST e GET) para salvar e buscar preferências de viagem de um usuário.
 *
 * Requisitos:
 * - Usar Express para definir os handlers. [X]
 * - Função `postUserPreferences`:
 *    - Recebe um JSON com os dados de preferências e interesses. [X]
 *    - Chama `saveUserPreferences` do service. [X]
 *    - Retorna os dados salvos ou erro 500. [X]
 * - Função `getUserPreferencesById`:
 *    - Recebe um `userId` pela rota. [X]
 *    - Chama `getUserPreferences` do service. [X]
 *    - Retorna os dados encontrados ou erro 404. [X]
 *
 * Observações:
 * - Já existem as funções `saveUserPreferences` e `getUserPreferences` em `src/services/userPreferences.service.ts`
 * - Essas funções devem ser usadas diretamente no controller.
 * - Adicionar tratamento de erro com `try/catch`.
 */

import { Request, Response } from 'express';
import { getUserPreferences, saveUserPreferences } from '../services/userPreferences.service';

// POST /api/user-preferences
export const postUserPreferences = async (req: Request, res: Response): Promise<Response> => {
  try {
    const preferencesData = req.body; // Supondo que o corpo da requisição já esteja validado

    const savedPreferences = await saveUserPreferences(preferencesData); // Chama o serviço para salvar as preferências

    return res.status(201).json(savedPreferences); // Retorna as preferências salvas com status 201 (Created)
  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
    return res.status(500).json({ error: 'Erro ao salvar preferências do usuário.' });
  }
};

// GET /api/user-preferences/:userId
export const getUserPreferencesById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params; // Obtém o userId da rota

    const preferences = await getUserPreferences(Number(userId)); // ou String(userId), dependendo da tipagem

    if (!preferences) {
      return res
        .status(404)
        .json({ error: 'Preferências não encontradas para o usuário informado.' });
    }

    return res.status(200).json(preferences);
  } catch (error) {
    console.error('Erro ao buscar preferências:', error);
    return res.status(500).json({ error: 'Erro ao buscar preferências do usuário.' });
  }
};
