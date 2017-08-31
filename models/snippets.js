'use strict';
module.exports = function(sequelize, DataTypes) {
  var Snippets = sequelize.define('Snippets', {
    title: DataTypes.STRING,
    code: DataTypes.TEXT,
    notes: DataTypes.STRING,
    languages: DataTypes.STRING,
    tags: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Snippets;
};