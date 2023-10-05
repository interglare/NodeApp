import jwt from 'jsonwebtoken';
import type { JwtPayload } from "jsonwebtoken";

const invalidatedTokens = new Set<string>();

setInterval(() => {
    invalidatedTokens.forEach(token => {
      const decodedToken = jwt.decode(token) as JwtPayload;
      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        invalidatedTokens.delete(token);
      }
    });
}, 3600000);
export { invalidatedTokens };