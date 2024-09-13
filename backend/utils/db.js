import mongoose from "mongoose";
const connnectDb = async() => {
    try {
     await mongoose.connect(process.env.MONGO_URI)
         console.log('database server connected success')
    } catch (error) {
        console.log('error',error)
    }

}
export default connnectDb;