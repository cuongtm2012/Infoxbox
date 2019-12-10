const db = require('../config/db.config.js');
const Customer = db.customers;

// Post a Customer
exports.create = (req, res) => {
  // Save to MariaDB database
  Customer.create({
    cusName: req.body.name,
    cusAge: req.body.age
  })
    .then(customer => {
      // Send created customer to client
      res.json(customer);
    })
    .catch(error => res.status(400).send(error))
};

// Fetch all Customers
exports.findAll = (req, res) => {
  Customer.findAll({
    attributes: {
      include: ['CUS_ID'],
      exclude: []
    }
  })
    .then(customers => {
      res.json(customers);
    })
    .catch(error => res.status(400).send(error))
};

// Find a Customer by Id
exports.findById = (req, res) => {
  Customer.findById(req.params.customerId,
    { attributes: { exclude: ["createdAt", "updatedAt"] } }
  )
    .then(customer => {
      if (!customer) {
        return res.status(404).json({ message: "Customer Not Found" })
      }
      return res.status(200).json(customer)
    }
    )
    .catch(error => res.status(400).send(error));
};
