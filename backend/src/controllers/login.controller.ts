
/**
 * TODO - login.controller.ts
 *
 * Responsável por receber e tratar as requisições HTTP relacionadas ao login.
 *
 * O que deve ser implementado:
 * - Criar função assíncrona que receba a requisição POST com os dados de login (email e senha).
 * - Validar se os campos obrigatórios foram enviados.
 * - Chamar o serviço de autenticação (login.service.ts) para validar as credenciais.
 * - Em caso de sucesso, retornar resposta JSON com token JWT e dados básicos do usuário.
 * - Em caso de erro, retornar código HTTP adequado (ex: 401 Unauthorized) com mensagem clara.
 * - Tratar possíveis exceções e garantir que o servidor não quebre.
 * 
 * Nota para o time:
 * - Mantenha o controlador focado em lidar com requisição/resposta e erros.
 * - A lógica de autenticação fica toda no serviço.
 * - Use boas práticas REST e mensagens consistentes para o frontend interpretar.
 */