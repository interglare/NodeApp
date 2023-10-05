import jwt from 'jsonwebtoken';
import type { JwtPayload } from "jsonwebtoken";

export function verifyRefresh(id: string, token: string) {
    try {
        const decoded = jwt.verify(token, "refreshSecret") as JwtPayload;
        return decoded.id === id;
    } catch (error) {
        // console.error(error);
        return false;
    }
}

export function jwtSignAccessToken(id: string) {
    const accessToken = jwt.sign(
        { id },
        "accessSecret",
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 600, // 10 min
        });
    return accessToken;
}

export function jwtSignRefreshToken(id: string) {
    const refreshToken = jwt.sign(
        { id },
        "refreshSecret",
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 3600, // 1 hour
        });
    return refreshToken;
}

export function getPagination(page: number, size: number){
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};

export function getPagingData<T>(data: {count: number, rows: T[] }, page: number, limit: number){
    const { count: totalRows, rows } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalRows / limit);
  
    return { totalRows, rows, totalPages, currentPage };
};

export function validatePassword(pw: string) {

    return /[A-Z]/       .test(pw) &&
           /[a-z]/       .test(pw) &&
           /[0-9]/       .test(pw) &&
           /[^A-Za-z0-9]/.test(pw) &&
           pw.length > 4;
  
}

export const regexExp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;