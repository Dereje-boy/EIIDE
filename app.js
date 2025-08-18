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


// Route Imports
const controlTimeRoutes = require('./routes/controltime.route');
const customerRoutes = require('./routes/customer.route');
const employeeRoutes = require('./routes/employee.route');
const feedbackRoutes = require('./routes/feedback.route');
const orderRoutes = require('./routes/order.route');
const productRoutes = require('./routes/product.route');
const salesRoutes = require('./routes/sales.route');
const loginRoutes = require('./routes/login.route');

// Route Mapping (Plural endpoints)
app.use('/api/accounts', require('./routes/account.route'));
app.use('/api/ads', require('./routes/ad.route'));
app.use('/api/control-times', controlTimeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/login', loginRoutes)

app.get('/', (req, res) => {
    res.render('homepage/index.handlebars');
});
app.get('/signup', (req, res) => {
    res.render('create-account/createaccount.handlebars');
});

app.get('/orders', (req, res) => {
    res.render('order/order.handlebars');
});

app.get('/logout', (req, res) => {
    res.cookie('token', '')
    res.redirect('/');
});

app.get('/newproduct', (req, res) => {
    res.render('newproduct/newproduct.handlebars');
});

// 404 handler middleware (must be last)
app.use((req, res, next) => {
    res.status(404).send('404 : Page Not Found');
});

// Server Error handling middleware (for uncaught exceptions)
app.use((err, req, res, next) => {
    console.log(err)
    res.json({
        success: false,
        message: 'An unexpected error occurred',
        reason: err.message + ' Internal server error'
    });
});

app.listen(3000, () => console.log("server is up and running"));