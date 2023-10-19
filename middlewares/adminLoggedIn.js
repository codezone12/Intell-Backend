import { badRequest } from "../utils/responses.js";

export const validateAdminUser = async (req, res, next) => {
    try {
        const { userData: { user } } = req.body
        const isAdmin = user.user_type === 0


        if (!isAdmin)
            return badRequest(res, "Only admin can access")

        next()
    } catch (err) {
        return badRequest(res, err.message)
    }
}