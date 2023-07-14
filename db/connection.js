const { Sequelize } = require("sequelize");

const isProduction = process.env.JAWSDB_URL;
let sequelize;

if (isProduction) {
    sequelize = new Sequelize(process.env.JAWSDB_URL, {
        dialect: "mysql"
    });
} else {
    sequelize = new Sequelize("travel_circle_app", "root", "", {
        host: "localhost",
        dialect: "mysql"
    });
}

module.exports = sequelize;