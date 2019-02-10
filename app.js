const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');

const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');

   if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
   }
   else {
      next();
   }
});

app.use(isAuth);

app.use('/graphql', graphqlHttp({
   schema: graphqlSchema,
   rootValue: graphqlResolvers,
   graphiql: true
}));

mongoose.connect(
   'mongodb://localhost/graphql-booking-app-dev', { useNewUrlParser: true }
)
.then(() => {
   console.log('Connected to database');
   app.listen(8000, () => {
      console.log('Server running at port 3000')
   });
})
.catch(err => console.log(err));
