// TODO: Criar o controller de preferências de viagem

/**
 * Arquivo: src/controllers/userPreferences.controller.ts
 *
 * Objetivo:
 * - Criar as funções que receberão requisições HTTP (POST e GET) para salvar e buscar preferências de viagem de um usuário.
 *
 * Requisitos:
 * - Usar Express para definir os handlers.
 * - Função `postUserPreferences`:
 *    - Recebe um JSON com os dados de preferências e interesses.
 *    - Chama `saveUserPreferences` do service.
 *    - Retorna os dados salvos ou erro 500.
 * - Função `getUserPreferencesById`:
 *    - Recebe um `userId` pela rota.
 *    - Chama `getUserPreferences` do service.
 *    - Retorna os dados encontrados ou erro 404.
 *
 * Observações:
 * - Já existem as funções `saveUserPreferences` e `getUserPreferences` em `src/services/userPreferences.service.ts`
 * - Essas funções devem ser usadas diretamente no controller.
 * - Adicionar tratamento de erro com `try/catch`.
 */
