const { Sequelize } = require("sequelize");

const isProduction = process.env.JAWSDB_URL;
let sequelize;

if (isProduction) {
    sequelize = new Sequelize(process.env.JAWSDB_URL, {
        dialect: "mysql"
    });
} else {
    sequelize = new Sequelize("user_app_example", "root", "", {
        host: "localhost",
        dialect: "mysql"
    });
}

module.exports = sequelize;