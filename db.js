const mangoose= require('mongoose')
const mongoURI= "mongodb://localhost:27017/iNotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
const connectToMongo=  ()=>{
      mangoose.connect(mongoURI,()=>{
        console.log("DataBase Connected Successfully")
    })
}
module.exports = connectToMongo;