const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://feonaakshitha662_db_user:brunobrownie18@careernexuscluster.2llajmg.mongodb.net/CareerNexusDB?retryWrites=true&w=majority&appName=CareerNexusCluster"
)
.then(() => {
  console.log("✅ Connected successfully");
  process.exit(0);
})
.catch((err) => {
  console.error("❌ Connection failed");
  console.error(err);
  process.exit(1);
});