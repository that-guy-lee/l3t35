const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/secrets').mongoUri;
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const cors = require('cors');

const app = express();

//Connect to remote mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true  })
.then(() => console.log('MongoDb remote connected...'))
.catch(err => console.log(err));

//Cross origin permission
app.use(cors({
    origin: ['*','http://localhost:3000', process.env.PORT]
}));

//Other middleware
app.use(express.json()); //body parser 
app.use(helmet()); 
app.use(morgan('tiny')); 

//Use routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);


//Listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is now listening on port ${port}`));