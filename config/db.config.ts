import { Options } from "sequelize";

type configType = Options & {
    HOST:string
    USER:string
    PASSWORD:string
    DB:string
}

const config:configType = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "testdb",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

export { config };