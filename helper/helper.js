import jwt from 'jsonwebtoken';

function verifyRefresh(id, token) {
    try {
        const decoded = jwt.verify(token, "refreshSecret");
        return decoded.id === id;
    } catch (error) {
        // console.error(error);
        return false;
    }
}

function getPagination(page, size){
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};

function getPagingData(data, page, limit){
    const { count: totalRows, rows } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalRows / limit);
  
    return { totalRows, rows, totalPages, currentPage };
};

export { verifyRefresh, getPagination, getPagingData };
