import jwt from 'jsonwebtoken';

export function verifyRefresh(id, token) {
    try {
        const decoded = jwt.verify(token, "refreshSecret");
        return decoded.id === id;
    } catch (error) {
        // console.error(error);
        return false;
    }
}

export function jwtSignAccessToken(id) {
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

export function jwtSignRefreshToken(id) {
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

export function getPagination(page, size){
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};

export function getPagingData(data, page, limit){
    const { count: totalRows, rows } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalRows / limit);
  
    return { totalRows, rows, totalPages, currentPage };
};

export function validatePassword(pw) {

    return /[A-Z]/       .test(pw) &&
           /[a-z]/       .test(pw) &&
           /[0-9]/       .test(pw) &&
           /[^A-Za-z0-9]/.test(pw) &&
           pw.length > 4;
  
}

export const regexExp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;