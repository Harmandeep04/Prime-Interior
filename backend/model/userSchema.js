import mongoose from "mongoose"; // Mongoose import kar rahe haan taaki user data layi schema te model bana sakiye

const userSchema = new mongoose.Schema({ 
    firstName: { 
        type: String, 
        default: "" 
    },
    lastName: { 
        type: String, 
        default: "" 
    },
    email: { 
        type: String, 
        default: "" 
    },
    password: { 
        type: String, 
        default: "" 
    },
    phone: { 
        type: Number, 
        default: 0 
    },
    // ✅ Role field add kita hai (user = Customer, admin = Administrative)
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

// 'User' name da model create kita jo es schema de according data save karega
const userDataSchema = mongoose.model("User", userSchema);

export default userDataSchema;