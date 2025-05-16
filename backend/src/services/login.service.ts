/**
 * TODO - login.service.ts
 *
 * Responsável pela lógica de autenticação do usuário.
 *
 * O que deve ser implementado:
 * - Função que receba email e senha como parâmetros.
 * - Consultar o banco de dados para obter o usuário pelo email.
 * - Se usuário não existir, lançar erro específico.
 * - Comparar a senha fornecida com o hash armazenado usando bcrypt.
 * - Se a senha não coincidir, lançar erro específico.
 * - Gerar token JWT contendo informações essenciais (ex: id, email).
 * - Retornar objeto contendo usuário e token.
 * 
 * Nota para o time:
 * - Manter a lógica isolada para facilitar testes.
 * - Tratar erros com mensagens claras para o controlador interpretar.
 * - Garantir que a senha no banco esteja sempre armazenada como hash.
 */