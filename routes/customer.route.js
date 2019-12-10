module.exports = function(app) {
 
    const customerService = require('../services/customer.service.js');
    
    // Create a new Customer
    app.post('/cic/customers/create', customerService.create);

    // Retrieve all Customer
    app.get('/cic/customers', customerService.findAll);

    // Retrieve customer by id
    app.get('cic/customerbyId',);
 
}