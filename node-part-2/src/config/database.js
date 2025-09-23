import mongoose, { disconnect } from "mongoose";



const dbConnect = async () => {

    try {

        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
        console.log('database connecedted sucesfully!')
        
    } catch (error) {
        console.log(`Some error is caught while connecting to databse ${error.message}`)
        process.exit(1)
    }
}


// to stop databse gracefully!
const dbDisconnect = async () => {
    try {

        await mongoose.connection.close()
        console.log('Data base disconnect sucessfully!')
        
    } catch (error) {
        console.log(`Error caught while disconnecting data base ${error.message}`)
    }
}

export {dbConnect,dbDisconnect }