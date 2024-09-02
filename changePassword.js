const changeCurrentPassword = asyncHandler (async (req, res) => {

    const {oldPassword, newPassword, confirmPassword} = req.body

    const user = await User.findById(req?._id)
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
    
    if (!isPasswordCorrect) {
        throw new ApiError (401, "invalid password")
    }

    if (newPassword !== confirmPassword){
        throw new ApiError(402, "new password and old password does not match")
    }

    if (oldPassword === newPassword){
        throw new ApiError (403, "old password and new password can not be same")
    }

    user.password = newPassword
    user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json (
        new ApiResponse (
            200,
            {},
            "password changes successfully"
        )
    )
})

export default changeCurrentPassword