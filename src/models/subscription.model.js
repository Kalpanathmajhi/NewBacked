import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: { 
        type: Schema.Types.ObjectId, //one who is sbbscribing

        ref:  'User'
    },
    channel:  { 
       type:Schema.Types.ObjectId, //one who  is being followed/subscribed to
        
    }
})



export const Subscription = mongoose.model("Subscription", subscriptionSchema);