const express = require("express");

//importing templeting engine handlebars
const { engine } = require('express-handlebars');

//importing middlewares modules
var path = require('path');
var cookieParser = require('cookie-parser');

//importing routes
var accountsRouter = require('./routes/accounts');
var servicesRouter = require('./routes/services');
var bookingsRouter = require('./routes/bookings');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var resetPasswordRouter = require('./routes/reset-password');
var logoutRouter = require('./routes/logout');


const app = express();

//consuming our routes
app.use('/api/accounts/', accountsRouter);
app.use('/api/services/', servicesRouter);
app.use('/api/bookings/', bookingsRouter);
app.use('/login/', loginRouter);
app.use('/logout/', logoutRouter);
app.use('/signup/', signupRouter);
app.use('/request-reset-password/', resetPasswordRouter);


//consuming middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//templeting engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    // throw new Error('Test 500 error');
    res.render('home');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard', layout: false });
});

// 404 handler middleware (must be last)
app.use((req, res, next) => {
    console.log('passing through not found 404 error page')
    console.log(req.originalUrl);
    res.status(404).render('404', { title: 'Page Not Found', layout: false });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: 'Server Error', message: 'Something went wrong!', layout: false });
});

app.listen(3000, () => {
    console.log("The server started listening on port 3000");
})