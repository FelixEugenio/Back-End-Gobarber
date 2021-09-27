'use strict';

const sequelize = require("sequelize");

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.createTable('Appointments',
      {
       id: {
           type: Sequelize.INTEGER,
           type: Sequelize.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true,

       },

       date:{
           allowNull:false,
           type: Sequelize.DATE,

       },




       user_id:{
           type: Sequelize.INTEGER,
           allowNull: false,
           references:{ model: 'Users' , key:'id'},
           onUpdate:'CASCADE',
           onDelete:'SET NULL',
           allowNull:true,

       },

       provider_id:{
           type: Sequelize.INTEGER,
           references:{model:'Users',key:'id'},
           onupdate:'CASACADE',
           onDelete:'SET NULL',
           allowNull:true,
       },

       canceledAt:{
         type: Sequelize.DATE,
         allowNull:true,
       },

       createdAt:{
           type: Sequelize.DATE,
           allowNull:false,
       },

       updatedAt:{
           type:Sequelize.DATE,
           allowNull : false,
       }


      });

  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.dropTable('Appointments');

  }
};
