const DataTypes= require('sequelize');
require('dotenv').config();

const sequelize = require('./sequelize');


const User = sequelize.define('user', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false
  },
  isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
  },
  totalAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
  }
})



const Expenses = sequelize.define('userexepense', {
    // Define the columns of the table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement:true,
      unique:true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    category: {
      type: DataTypes.STRING,
      allowNull:false,
      
    }
  });
  
  const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    paymentId: DataTypes.STRING,
    orderId: DataTypes.STRING,
    status: DataTypes.STRING,
})



const ForgotPasswordRequest = sequelize.define('forgot_password_request',{
  sl:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false,
  
    
  },
  id:{
      type: DataTypes.INTEGER,
      unique:true,
      allowNull:false
  },
  userId:{ 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isActive:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  }

});


const DownloadedFile = sequelize.define('downloadedFile',{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  links: {
    type: DataTypes.STRING,
    allowNull: false
  }

}) 






// Create the table in the database
async function createTable(obj) {
  try {
    await obj.sync({ force: false });
    console.log('Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
}


User.hasMany(Expenses);
Expenses.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);

let ex = async()=>{
    await createTable(User);
    await createTable(Expenses);
    await createTable(Order);
    await createTable(ForgotPasswordRequest);
    await createTable(DownloadedFile);
}

ex();



module.exports = {
    User:User,
    Expenses:Expenses,
    Order: Order,
    ForgotPasswordRequest: ForgotPasswordRequest,
    DownloadedFile: DownloadedFile
};
