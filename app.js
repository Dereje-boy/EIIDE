const express = require('express')

//importing templeting engine handlebars
const { engine } = require('express-handlebars');

//importing middlewares modules
var path = require('path');
var cookieParser = require('cookie-parser');

const app = express();

//consuming middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//templeting engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


// Routes
app.use('/api/accounts', require('./routes/account.routes'));
app.use('/api/ads', require('./routes/ad.routes'));

app.get('/', (req, res) => {
    res.send('welcome homepage');
});


// 404 handler middleware (must be last)
app.use((req, res, next) => {
    res.status(404).send('404 : Page Not Found');
});

// Server Error handling middleware (for uncaught exceptions)
app.use((err, req, res, next) => {
    res.json({
        success: false,
        message: 'An unexpected error occurred',
        reason: err.message + ' Internal server error'
    });
});

app.listen(3000, () => console.log("server is up and running"));