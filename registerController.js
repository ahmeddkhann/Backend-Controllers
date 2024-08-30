import uploadOnCloudinary from "./uploadOnCloudinary"


const registerUser = asyncHandler (async (req, res) => {
    
    const {username, email, password, fullname} = req.body 

    if (
        [username, email, password, fullname].some((field)=> field?.trim == "")
    ) {
        throw new ApiError (404, "All fields are required")
    }

    const alreadyRegisterdUser = await User.findOne({
        $or: [username, email]
    })

    if (alreadyRegisterdUser){
        throw new ApiError (402, "username or email is already registered")
    }

    const avatarLocalPath = req.files?.avatar[0]?.url
    
   if (req.files && Array.isArray (req.files.coverImage)
           && req.files.coverImage.length > 0) {

            const coverImageLocalPath = req.files.coverImage.url
   }

    if (!avatarLocalPath) {
        throw new ApiError (403, "Avatar file is must required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar){
        throw new ApiError (402, "uploading avatar failed")
    }

    const user = await User.create({
        username,
        email,
        password,
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url
    })

    const createdUser = await User.findById(user).select(
        "-password"
    )

    if (!createdUser){
        throw new ApiError (500, "user registeration failed due to unknown reasons")
    }

    return res.status(200).json(
        new ApiRespone (201, createdUser, "user created successfully")
    )

    
})

export default registerUser