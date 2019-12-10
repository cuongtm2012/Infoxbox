module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define('TB_CUSTOMER', { 
      cusName: {
      type: Sequelize.STRING,
      field: 'CUS_NM',
      allowNull: false
      },
      cusAge: {
        type: Sequelize.INTEGER,
        field: 'CUS_AGE',
        allowNull: true
      }
    });
    Customer.removeAttribute('id');
    
    return Customer;
  }