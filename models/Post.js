const { Model, DataTypes } = require("sequelize");
const db = require("../db/connection");

class Post extends Model { }

Post.init(
    {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 3,
            },
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        modelName: "post",
    }
);

module.exports = Post;