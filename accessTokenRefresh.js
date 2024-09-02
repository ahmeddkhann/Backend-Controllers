import  jwt  from "jsonwebtoken"
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

const accessTokenRefresh = asyncHandler (async (req, res) => {

    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken
    
    if (!incomingToken) {
        throw new ApiError(401, "unAuthorized request")
    }

    const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_ACCESS)
    const user = User.findById(decodedToken?._id)

    if (!user) {
        throw new ApiError(402, "TOKEN IS NOT CORRECT")
    }


    if (incomingToken !== user?.refreshToken) {
        throw new ApiError(402, "wrong token")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

   const {accessToken, newRefreshToken} = generateAccessAndRefreshToken(user?._id)

   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", newRefreshToken, options)
   .json(
    new ApiResponse (
        200, 
        {
            accessToken, refreshToken: newRefreshToken
        },
        "token refreshed successfully "
    )
   )

})

export default accessTokenRefresh