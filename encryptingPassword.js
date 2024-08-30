import bcrypt from "bcrypt"

userSchema.pre("save", async function (next){
    if (!this.Modified("password")) return next()
        this.password = bcrypt.hash (this.password, 10)
    next() 
})

userSchema.methods.isPasswordCorrect = async function (password){
     bcrypt.compare(password, this.password)
}