import mongoose from "mongoose";

const dbConnect = async () => {
  try {
   
    const uri =
      process.env.NODE_ENV === "test"
        ? process.env.TEST_DB_URL || "mongodb://127.0.0.1:27017/testdb"
        : `${process.env.DB_URL}/${process.env.DB_NAME}`;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(" Database connected successfully!");
  } catch (error) {
    console.log(` Error while connecting to database: ${error.message}`);

    
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};


const dbDisconnect = async () => {
  try {
    await mongoose.connection.close();
    console.log(" Database disconnected successfully!");
  } catch (error) {
    console.log(` Error while disconnecting database: ${error.message}`);
  }
};

export { dbConnect, dbDisconnect };
