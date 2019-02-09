const bcrypt = require('bcryptjs');

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

            const userData = { email, password: null };
            return userData;
         }
      }
      catch (error) {
         return error;
      }
   }
}