const Event = require('../../models/Event');
const User = require('../../models/User');

const { dateToString } = require('../../helpers/date');

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
                        date: dateToString(createdEvent.date)
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
   createEvent: async (args, req) => {
      if (!req.isAuth) {
         console.log(req.isAuth);
         throw new Error('Unauthenticated');
      }

      const { title, description, price } = args.eventInput;
      const event = new Event({ title, description, price, date: new Date(args.eventInput.date), creator: req.userId });

      try {
         await event.save();
         const user = await User.findById(req.userId);

         if (!user) {
            // No user found
            throw new Error('User not found');
         }
         else {
            user.createdEvents.push(event);
            await user.save();

            // PENDING
            return event;
         }
      }
      catch (error) {
         return error;
      }
   }
}