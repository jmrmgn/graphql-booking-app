const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   const authHeader = req.get('Authorization');

   if (!authHeader) {
      req.isAuth = false;
      return next();
   }
   else {
      const token = authHeader.split(' ')[1]; // Authorization: Bearer <token>
      if (!token || token === '') {
         req.isAuth = false;
         return next();
      }

      let decodedToken;

      try {
         decodedToken = jwt.verify(token, 'sikretongmalupet');
      }
      catch (error) {
         req.isAuth = false;
         return next();
      }

      if (!decodedToken) {
         req.isAuth = false;
         return next();
      }
      else {
         req.isAuth = true;
         req.userId = decodedToken.userId;
      
         return next();
      }
      
      
   }
};