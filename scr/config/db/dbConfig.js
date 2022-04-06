import Sequelize from "sequelize";

const sequelize = new Sequelize("auth-db", "root", "root",{
    host: "localhost",
    dialect: "postgres",
    quoteIdentifiers:false,
    define: {
        syncOnAssociation: true,
        timestamps: false,
        underscored: true,
        underscoredAll: true,
        freezeTableName: true
    },
})

sequelize
    .authenticate()
    .then(() =>{
        console.info("Connection has been stablished!")
    })
    .catch((err) => {
        console.error("Unable to connect to then database.")
        //console.error(err.message)
    })

    export default sequelize;