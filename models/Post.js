const { Model, DataTypes } = require("sequelize");
const db = require("../db/connection");

class Post extends Model {}

Post.init({
    text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 3
        }
    }
}, {
    sequelize: db,
    modelName: "post"
});

module.exports = Post;