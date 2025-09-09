"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate({ Comment, Category, Author, Rating, Wishlist, Basket }) {
      // check all dependencies
      this.hasMany(Comment, {
        foreignKey: "bookId",
        onDelete: "CASCADE",
      });
      this.hasMany(Rating, {
        foreignKey: "bookId",
        onDelete: "CASCADE",
      });
      this.belongsTo(Wishlist, {
        foreignKey: "wishlistId",
        onDelete: "CASCADE",
      });
      this.belongsTo(Basket, {
        foreignKey: "basketId",
        onDelete: "CASCADE",
      });
      this.belongsToMany(Category, {
        through: "Book_categories",
      });
      this.belongsToMany(Author, {
        through: "Book_authors",
      });
    }
  }
  Book.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Убираем `primaryKey: true` из wishlistId
      wishlistId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Wishlists",
          key: "id",
        },
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
// npx sequelize-cli db:migrate

/* 
Books.hasMany(Comments, {
  foreignKey: 'bookId',
  onDelete: 'CASCADE' // Включение каскадного удаления
});
*/
