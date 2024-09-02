import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler (async (req, res, next) => {

    try {
        const token = req.cookie?.accessToken || req.header
        ("Authorization").replace("bearer ", "")

        if (!token) {
            throw new ApiError(400, "Token is not available")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )

        if (!user) {
            throw new ApiError (402, "Invalid token access")
        }

        req.user = user;
        next()
        
    } catch (error) {
        throw new ApiError (402, error?.message ||"USER LOGOUT FAILED!!!")
    }
}) 

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {refreshToken: 1}
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken" , accessToken, options)
    .clearCookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse (
            201, {}, "User Logged out!"
        )
    )
})

router.route("/logout").post(verifyJWT, logoutUser) 