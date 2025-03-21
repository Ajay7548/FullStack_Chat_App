import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId: { // ✅ Fixed spelling
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: { // ✅ Fixed `tyep` to `type`
            type: String
        },
        image: {
            type: String
        }
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
