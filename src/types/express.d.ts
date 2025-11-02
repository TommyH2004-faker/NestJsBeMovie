
// import 'express'; 
// declare module 'express' 
// { interface Request 
//   { user?: 
//     { id: number,
//        username: string, 
//        email: string, roles?:
//         string[], // Assuming roles is an array of strings }; } }

import 'express';
import { JwtPayload } from './jwt-payload';

declare global {
  // eslint-disable-next-line prettier/prettier
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends JwtPayload {}  // Kế thừa luôn từ JwtPayload
    interface Request {
      user?: User;
    }
  }
}
