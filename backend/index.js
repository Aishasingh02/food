const express =require('express')

const app = express()
const port=5000

const mongoDB=require("./db")
mongoDB();

app.use((req,res,next)=>{
  res.setHeader("Access-control-Allow-Origin","http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use(express.json());

app.use('/api',require("./Routes/CreateUser"));
app.use('/api',require("./Routes/DisplayData"));
app.use("/api", require("./routes/OrderData"));
app.use("/api", require("./routes/MyOrderData"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});