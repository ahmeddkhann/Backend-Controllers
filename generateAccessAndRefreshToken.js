import jwt from "jsonwebtoken"

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname
    }),
    process.env.ACCESS_TOKEN_SECRET
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    }),
    process.env.REFRESH_TOKEN_SECRET
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
}
    
