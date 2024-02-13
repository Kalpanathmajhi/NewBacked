import { Promise } from "mongoose"

const asyncHandler = (requestHandler) => {
    (req, res, next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
    }
}

export {asyncHandler}
// const asyncHandler = (fn) => async () => {
//     try {
//     }  catch(err){
//         resizeBy.status(err.code || 500).json({
//             sucess: false,
//             message: err.message
//         })
// }
// }
