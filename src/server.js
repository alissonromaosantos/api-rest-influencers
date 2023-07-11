require("dotenv").config({  
  path: process.env.NODE_ENV.trim() == 'test' ? ".env.test" : ".env"
})

const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}!`);
});