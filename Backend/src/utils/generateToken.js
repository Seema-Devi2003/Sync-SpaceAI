import jwt from 'jsonwebtoken'
 export function generateAccessToken(userId, email){
    return jwt.sign({
        id : userId, 
        email,

    }, process.env.JWT_SECRET, {expiresIn: '15m'}
)

}
 export function generateRefreshToken(userId, email){
    return jwt.sign({
        id : userId,
        email
    }, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'})
}