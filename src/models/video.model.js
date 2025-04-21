import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    video: {
        type: String, //cloudinery
        required: true,
    },
    thumbnail: {
        type: String, //cloudinery
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    duration: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true
});

videoSchema.plugin(aggregatePaginate);


export const video = mongoose.model("Video", videoSchema);