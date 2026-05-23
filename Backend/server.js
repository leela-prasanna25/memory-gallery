const express=require('express');
const cors=require("cors");
const dotenv=require("dotenv");
const connectDB=require("./config/db");

const authRoutes=require("./routes/authRoutes");
const memoryRoutes = require("./routes/memoryRoutes");

dotenv.config();
const app=express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/uploads", express.static("uploads"));

//test route
app.get("/",(req,res)=>{
    res.send("memory gallery api running");
});

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on the port ${PORT}`);
});




