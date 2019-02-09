const bcrypt = require('bcryptjs');

const Event = require('../../models/Event');
const User = require('../../models/User');

module.exports = {
   events: async () => {
      try {
         const events = await Event
            .find()
            .populate({
               path: 'creator',
               select: 'email',
               populate: {
                  path: 'createdEvents',
                  select: 'title description price date'
               }
            })
            .exec();
         return events.map(event => {
            return {
               ...event._doc,
               date: new Date(event.date).toISOString(),
               creator: {
                  ...event.creator._doc,
                  createdEvents: event.creator.createdEvents.map(createdEvent => {
                     return {
                        ...createdEvent._doc,
                        date: new Date(createdEvent.date).toISOString()
                     }
                  })
               }
            };
         });
      }
      catch (error) {
         console.log(error);
      }
   },
   createEvent: async args => {
      const { title, description, price } = args.eventInput;
      const dummyID = '5c5eb6a56875042ee4ae2233';
      const event = new Event({ title, description, price, date: new Date(args.eventInput.date), creator: dummyID });

      try {
         await event.save();
         const user = await User.findById(dummyID);

         if (!user) {
            // No user found
            throw new Error('User not found');
         }
         else {
            user.createdEvents.push(event);
            await user.save();

            return event;
         }
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