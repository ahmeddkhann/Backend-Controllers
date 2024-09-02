
const generateAccessAndRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generatRefreshToken()
    
        user.refreshToken = refreshToken
        user.save({validateBeforeSave: false})
        return {
            accessToken, refreshToken
        }

    } catch (error) {
        throw new ApiError (401, "error generating tokens")
    }
}

const loginUser = asyncHandler (async (req, res) => {

   const {username, email, password} = req.body

   if (!username || !email){
    throw new ApiError (400, "username or email is required")
   }
   
   const user = await User.findById({
    $or: [[username, email]]
   })

   if (!user){
    throw new ApiError (401, "user does not exists")
   }

   const checkPassword = await user.isPasswordCorrect(password)
   if (!checkPassword){
    throw new ApiError (402, "password is invalid")
   }

   const {accessToken, refreshToken} = generateAccessAndRefreshToken(user._id)
   const loggedInUser = User.findById(user._id)
   .select("-password -refreshToken")

   const options = {
    httpOnly: true,
    secure: true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
    new ApiResponse (
        200,
        {user: loggedInUser, accessToken, refreshToken},
        "user logged in successfully"
    )
   )

})

export default loginUser