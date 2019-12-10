module.exports = function(app) {
 
    const customers = require('../controllers/customer.controller.js');
 
    // Create a new Customer
    app.post('/cic/customers/create', customers.create);

    // Retrieve all Customer
    app.get('/cic/customers', customers.findAll);
 
}