'use strict';

const sequelize = require("sequelize");

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.createTable('Users',
      {
          id:{
            type: Sequelize.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true,

          },

          name:{
              type:Sequelize.STRING,
              allowNull:false,
          },

          email:{
              type: Sequelize.STRING,
              allowNull:false,
              unique:true,
          },

          password_hash:{
              type: Sequelize.STRING,
              allowNull:false,
          },

          provider:{
              type:Sequelize.BOOLEAN,
              allowNull:false,
              defaultValue:false,
          },

          createdAt:{
              type: Sequelize.DATE,
              allowNull:false,

          },

          updatedAt:{
              type:Sequelize.DATE,
              allowNull:false,
          }


      });

  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.dropTable('Users');

  }
};
