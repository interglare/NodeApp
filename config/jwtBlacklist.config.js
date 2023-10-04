const invalidatedTokens = new Set();

setInterval(() => {
    invalidatedTokens.forEach(token => {
      const decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        invalidatedTokens.delete(token);
      }
    });
}, 3600000);
export { invalidatedTokens };