
const { Sequelize } = require('sequelize');

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'backend/database/sqlite.db'
  });


  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


  
const User = sequelize.define('User', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
      // allowNull defaults to true
    }
  }, {
    // Other model options go here
  });
  
  // `sequelize.define` also returns the model
  console.log(User === sequelize.models.User); // true

