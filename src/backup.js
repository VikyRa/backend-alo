const express = require('express');
const env = require('dotenv');
const { json } = require('express');
const { urlencoded } = require('express');
const  cors  = require('cors');
// connect mongoose db connection
const db = require('./db/connection');

const path = require('path');
const cookieParser = require("cookie-parser");
const cron = require("node-cron");

 
// CALL ENVERMENT VARIABLE
env.config();
// CREATE APP USING EXPRESS
const app = express();

const session = require('express-session')
const HashMap = require('hashmap');
var MongoDBStore = require('connect-mongodb-session')(session);




var map = new HashMap();
var connections = {};




var store = new MongoDBStore({
  uri: process.env.ONLINE_DB_URL,
  collection: 'mySessions'
});

app.set('trust proxy', 1)
app.use(session({
  key: "userId",
  secret: 'potatoe chips',
  resave: true,
  saveUninitialized: false,
  cookie: {
      expires: Date.now() + (5 * 86400 * 1000),
      httpOnly: true
  },
  store: store
}))


// import routes
const errorMiddleware = require("./common-middleware/error");

const adminauthRoutes = require('./routes/admin/admin');
const roleRouters = require('./routes/admin/role');
const useradminRouters = require('./routes/admin/user/userroute');
const astrologeradminRouters = require('./routes/admin/astrologer/astroroute');
const serviceRouters = require('./routes/admin/serviceroute');
const bannerRouters = require('./routes/admin/bannerroute');
const blogCategoryRouters =require('./routes/admin/blogroute/categoryblogroute');
const blogRouters =require('./routes/admin/blogroute/blogRoute');
// product section route
const categoryRouters = require('./routes/admin/product/categoryRoute');
const productRouters = require('./routes/admin/product/productRoute');

// for website
const callhistoryRouters = require('./routes/user/callhistoryRoute');
const productRoute = require('./routes/user/productroutes');
const userRegisterRouters = require('./routes/user/user');
const orderRoute = require('./routes/admin/order/orderRoute');

const blogHomeRouter = require('./routes/website/blogHomeRoutes');
const websettingRouter = require('./routes/admin/websettingRoute');
const contactRouter = require('./routes/website/contactRoute');
const webproductRouter = require('./routes/website/productRoutes');

const astrologerRoutes = require('./routes/astrologer/astrologer');
// const routeHandler = require('./routes/website/routes');
const errorHandler = require('./errorHandler/errorHandler.middleware');
// const http = require('http');



// GET PROT IN ENV FILE
const port = process.env.PORT || 8000;


// Handling Uncaught Exception
// process.on("uncaughtException", (err) => {
//     console.log(`Error: ${err.message}`);
//     console.log(`Shutting down the server due to Uncaught Exception`);
//     process.exit(1);
//   });
// Creating a cron job which runs on every 10 second


  


// var   server = http.Server(app);

// WORK AS MIDDLWARES 


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true })); //Parse URL-encoded bodies
// const config = {
//   origin: 'http://localhost:3000',
//   preflightContinue: true,
//   credentials: true,
// };
app.use(cors());
app.use('/public',express.static(path.join(__dirname,'uploads')));
// CREATE

// app.use(express.static(path.join(__dirname, "../client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
// });


// if(process.env.NODE_ENV=='producation'){
//   app.use(express.static('../client/build'));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
//   });
// }

app.use(errorHandler);

app.use('/api', adminauthRoutes);
app.use('/api', roleRouters);

// service
app.use('/api', serviceRouters);
// for banner
app.use('/api',bannerRouters);
// blog category
app.use('/api',blogCategoryRouters);
app.use('/api',blogRouters);

// product
app.use('/api',categoryRouters);
app.use('/api',productRouters);

// USER ADMIN SIDE ROUTE
app.use('/api',useradminRouters);
// ASTROLOGER ADMIN SIDE ROUTE
app.use('/api',astrologeradminRouters);

// ORDER ROUTE
app.use('/api',orderRoute);
// WEBSITE 
app.use('/api',callhistoryRouters);
app.use('/api',productRoute);
app.use('/api',userRegisterRouters);
app.use('/api',blogHomeRouter);
app.use('/api',websettingRouter);
app.use('/api',contactRouter);
app.use('/api',webproductRouter);

// astrologer website
app.use('/api',astrologerRoutes);


//handling all rountes here


 var server = app.listen(port, () => {
    console.log(`Server is running on port no ${port}`);
});
// new chat code start
// cron.schedule("*/60 * * * * *", function() {
//   console.log("running a task every 60 second");
// });

// const io = require('socket.io')(server, { pingTimeout: 25000, wsEngine: 'ws' });
const io = require('socket.io')(server, { pingTimeout: 25000 });
// Assign socket object to every request
app.use(function (req, res, next) {
  req.io = io;
  req.onlineUsers = map;
  next();
});





const chatsApiRoute = require('./routes/api/chatsroute');
const chatsloginApiRoute = require('./routes/api/checkloginroute');
const messagesApiRoute = require('./routes/api/messageroute')
const notificationsApiRoute = require('./routes/api/notificationsroute')

app.use("/api/chat", chatsloginApiRoute);
app.use("/api/chat", chatsApiRoute);
app.use('/api/chat', messagesApiRoute)
app.use('/api/chat', notificationsApiRoute)


// new chat code stop
// Middleware for Errors
app.use(errorMiddleware);


io.on('connection', (socket) => {
  socket.on('setup', (userData) => {
      map.set(socket.id, userData._id);
      connections[userData._id] = [...(connections[userData._id]||[]),socket.id];
      console.log("Connection Setup");
      io.sockets.emit('online', map);
      socket.emit('connected', map);
      socket.join(userData._id);
  })

  socket.on('join room', room => {
      socket.leave(room);
      socket.join(room)
  })

  socket.on('typing', room => socket.to(room).emit("typing"))
  socket.on('stop typing', room => socket.to(room).emit('stop typing'))
  socket.on('notification received', room => socket.to(room).emit('notification received'))

  socket.on('disconnect', function () {
      map.delete(socket.id);
      io.sockets.emit('offline', map);
  });

    // new chat request
    socket.on('requestchat', (userData) => {
      try{ 
          // console.log({Event:"requestchat",userData});
      map.set(socket.id,userData);
      console.log("userData",userData,"connections",connections, "map", map);
      connections[userData.astrologerId]?.map(connectionId=>socket.broadcast.to(connectionId).emit('requestnotification',userData));
      // user_id: socket.id
      // cache.setData(userData.astrologerId, JSON.stringify(socket.id));
      // socket.emit('requestnotification', map);
      // io.sockets.emit('requestnotification', userData);
      // io.to(socket.id).emit('requestnotification', "notification to be send...");
      socket.join(userData._id);
      }catch(error){
        console.log(error);
      }
    })
})


// Unhandled Promise Rejection
// process.on("unhandledRejection", (err) => {
//     console.log(`Error: ${err.message}`);
//     console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
//     server.close(() => {
//       process.exit(1);
//     });
//   });
  