const bcrypt = require('bcryptjs');

const Event = require('../../models/Event');
const User = require('../../models/User');
const Booking = require('../../models/Booking');

const DUMMYID = '5c5eb6a56875042ee4ae2233';

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
   bookings: async () => {
      try {
         const prePopulate = [
            {
               path: 'user',
               select: 'email',
            },
            {
               path: 'event',
               select: 'title description date price',
               populate: {
                  path: 'creator',
                  select: 'email'
               }
            }
         ];

         const bookings = await Booking
            .find()
            .populate(prePopulate)
            .exec();
         return bookings.map(booking => {
            return {
               ...booking._doc,
               createdAt: new Date(booking.createdAt).toISOString(),
               updatedAt: new Date(booking.updatedAt).toISOString(),
               event: {
                  ...booking.event._doc,
                  date: new Date(booking.event.date).toISOString()
               }
            }
         });
      }
      catch (error) {
         return error;
      }
   },
   createEvent: async args => {
      const { title, description, price } = args.eventInput;
      const event = new Event({ title, description, price, date: new Date(args.eventInput.date), creator: DUMMYID });

      try {
         await event.save();
         const user = await User.findById(DUMMYID);

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
   },
   bookEvent: async args => {
      try {
         const event = await Event.findOne({ _id: args.eventId });
         const booking = new Booking({
            user: DUMMYID,
            event: event
         });

         const bookingData = await booking.save();

         return {
            ...bookingData._doc,
            createdAt: new Date(bookingData.createdAt).toISOString(),
            updatedAt: new Date(bookingData.updatedAt).toISOString()
         };


      }
      catch (error) {
         return error;
      }
   },
   cancelBooking: async args => {
      try {
         const booking = await Booking
            .findById(args.bookingId)
            .populate({
               path: 'event',
               populate: {
                  path: 'creator',
                  select: 'email'
               }
            });
         const event = booking.event;
         await Booking.deleteOne({ _id: args.bookingId});
         
         return event;
      }
      catch (error) {
         return error;
      }
   }
}