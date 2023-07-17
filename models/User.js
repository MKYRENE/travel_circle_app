const { Model, DataTypes } = require("sequelize");
const { hash, compare } = require("bcrypt");
const db = require("../db/connection");
const Thought = require("./Thought");

class User extends Model { }

User.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            min: 2,
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            min: 3,
        }
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
            min: 3,
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            min: 6
        }
    }
}, {
    sequelize: db,
    modelName: "user",
    hooks: {
        async beforeCreate(user) {
            const hashPassword = await hash(user.password, 10);

            user.password = hashPassword;
        }
    },
});

User.prototype.validatePass = async function(formPassword) {
    const isValid = await compare(formPassword, this.password);

    return isValid;
}

User.hasMany(Thought);
Thought.belongsTo(User);

module.exports = User;