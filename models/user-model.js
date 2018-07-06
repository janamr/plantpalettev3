const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    userName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    profession: {
        type: String,
        default: "landscape designer"},
    role: {
        type: String,
        enum: [ "normal", "admin"],
        default:"normal"
    },
    encryptedPassword: { type: String},
    goodleID: { type: String},

},{
    timestamps: true
});

//加入一个virtual propoer来识别admin
userSchema.virtual("isAdmin").get(function() {
    return this.role === "admin";
})


const User = mongoose.model("User", userSchema);

module.exports = User;