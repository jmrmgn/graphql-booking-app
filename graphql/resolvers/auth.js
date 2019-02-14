const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

module.exports = {
   // Temporary
   users: async () => {
      try {
         const users = await User.find();
         return users;
      }
      catch (error) {
         return error;   
      }
   },
   createUser: async (args) => {
      const { email, password } = args.userInput;
      try {
         const user = await User.findOne({ email });

         if (user) {
            // User exist
            throw new Error('User exist already');
         }
         else {
            const hashPw = await bcrypt.hash(password, 12);
            const newUser = new User({ email, password: hashPw });
            await newUser.save();

            const userData = { _id: newUser._id, email, password: null };
            return userData;
         }
      }
      catch (error) {
         return error;
      }
   },
   login: async ({ email, password }) => {
      
      try {
         const user = await User.findOne({email});

         if (!user) {
            // User not exist
            throw new Error('User does not exist.');
         }
         else {
            const isEqual = await bcrypt.compare(password, user.password);

            if (!isEqual) {
               throw new Error('Password is incorrect');
            }
            else {
               // Create token
               const token = jwt.sign({
                  userId: user.id,
                  email: user.email
               }, 'sikretongmalupet', { expiresIn: '1h'} );

               return {
                  userId: user.id,
                  token: token,
                  tokenExpiration: 1
               };

            }
         }
      }
      catch (error) {
         return error;   
      }
   }
}