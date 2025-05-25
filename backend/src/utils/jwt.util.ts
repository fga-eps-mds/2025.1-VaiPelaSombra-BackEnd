import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

type JwtPayload = {
  id: number;
};

export function generateToken(payload: object) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET isn't defined!");
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET isn't defined");

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch {
    throw new Error('Invalid or expired token');
  }
}

// const {password:_, ...userLogin} = user
// return res.json({
// 	user: userLogin,
// 	token: token,
// })

// export function verifyToken(req: Request, res: Response){
//   const { authorization } = req.headers
//   if (!authorization) {
//     throw new UnauthorizedError('Não autorizado')
//   }

//   const token = authorization.split(' ')[1]

//   const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

//   const user = await userRepository.findOneBy({ id })

//   if (!user) {
//     throw new UnauthorizedError('Não autorizado')
//   }

//   const { password: _, ...loggedUser } = user
//   return res.json(loggedUser)
//}
