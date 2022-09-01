const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

//create our User model
class User extends Model {}

//define table columns and configuration

User.init(
    {
        //define column
        id: {
            //use the special Sequelize Datatypes object provide what type of data it is
            type: DataTypes.INTEGER,
            //this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            //instruct that this tis the Primary Key
            primaryKey: true,
            autoIncrement: true
        },
         //define a usermane column
         username: {
            type: DataTypes.STRING,
            allowNull: false
         },
         //define email address column
         email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there connot be any duplicate email values in this table
            unique: true,
            //if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least four characters long
                len:[4]
            }
        }

    },
    
    
    {
        //TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration)


        //pass in our imported sequelize connection (the direct connection to our database)
        sequelize,

        //don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,

        //don't pluralize name of database table
        freezeTableName: true,

        //use underscores instead of camel-casing (i.e `comment_text` and not `commentText` )
        modelName: 'user'
    }
);
module.exports = User;