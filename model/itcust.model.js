module.exports = (sequelize, Sequelize) => {
    const Itcust = sequelize.define('TB_ITCUST', { 
    workId: {
        type: Sequelize.STRING,
        field: 'CUST_GB',
        allowNull: false,
        primaryKey: true
        },
      custGB: {
        type: Sequelize.STRING,
        field: 'CUST_GB',
        allowNull: false
      },
      custCD: {
        type: Sequelize.INTEGER,
        field: 'CUST_CD',
        allowNull: true
      }
    });
    Itcust.removeAttribute('id');
    
    return Itcust;
  }