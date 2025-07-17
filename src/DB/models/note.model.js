import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        validate : {
            validator: function(v){
                return v !== v.toUpperCase();
            },
            message: props => `${props.value} should not be in uppercase!`
        }
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true,
})

const noteModel = mongoose.model("note", noteSchema);

export default noteModel;