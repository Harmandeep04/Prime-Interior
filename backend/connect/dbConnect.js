import mongoose from "mongoose"; //importing mongoose to connect to the database
import dns from "dns";
//dns mean domain name system (domain names ko ip addresses me convert karta hai taki hum internet par websites ko access kar sake.)
//dns severs es lyi use krte hai taki database connection me koi problem na aaye .jab hum database se connect krte hai to wo dns servers ke through connect hota hai agar dns servers me koi problem hoti hai to database connection me bhi problem aati hai isliye dns servers ko set krna zaruri hota hai
dns.setServers(["8.8.8.8", "8.8.4.4"]);
//google ke dns servers ko set krna kuiki google ke dns servers reliable hote hai aur unka uptime bhi acha hota hai isliye unko set krna chahiye taki database connection me koi problem na aaye
const dbConnectDB = async () => { 
    //awit function me database connection complete hone tak wait karte hai taki baad me aage ka code execute kar sake
  try { //try catch block me database connection karte hai taki agar connection me koi error aata hai to usko catch kar sake aur error ko log kar sake
    await mongoose.connect("mongodb+srv://Harmandeep:Harmandeep@cluster0.vfs3wif.mongodb.net/Harmandeep"); //.connect method se database se connect karte hai aur usme database ka url pass karte hai taki wo url ke through database se connect ho jaye
    console.log("MongoDB connected successfully");
  } catch (error) { 
    console.log(error)
  }
}
export default dbConnectDB