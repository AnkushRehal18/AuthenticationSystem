const {Client} = require("pg")
let client;

const ConnectDb = async ()=>{
    if(!client){
        client = new Client({
            connectionString : process.env.DB_CONNECTION_STRING,
            ssl:{
                rejectUnauthorized: false,
            }
        });
        try{
            await client.connect();
            console.log("Connected to the database")
        }
        catch(err){
            throw new Error(err)
        }
    }
    return client;
};
module.exports = {ConnectDb}