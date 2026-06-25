require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5001;
connectDB();
app.listen(PORT, () => {
  console.log(`AI Service running on ${PORT}`);
});
