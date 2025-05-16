import jwt from 'jsonwebtoken';

/**
 * TODO - jwt.util.ts
 *
 * Utilitário para manipulação de tokens JWT.
 *
 * O que deve ser implementado:
 * - Função para gerar token JWT, recebendo um payload (ex: id do usuário, email).
 * - Função para validar/verificar um token JWT e retornar o payload decodificado.
 * - Configurar segredo do JWT via variável de ambiente para segurança.
 * - Definir tempo de expiração do token (ex: 1 hora).
 * 
 * Nota para o time:
 * - Utilizar biblioteca segura e confiável, como jsonwebtoken.
 * - Tratar erros de token inválido ou expirado de forma apropriada.
 * - Este utilitário será usado pelo serviço de login para gerar tokens e futuramente para middlewares de autenticação.
 */