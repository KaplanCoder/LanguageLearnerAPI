
const MongoDBCollection=require('mongoDBCollection');

class Comment extends  MongoDBCollection{

    static #modelName="Comment";

    static #commentDefinitions = {
        senderId: {
            type:String,
            required:true
        },
        receiverId : {
            type:String,
            required:true
        },
        text : {
            type:String,
            required:true
        }
    }
    constructor() {
        super(Comment.#modelName,Comment.#commentDefinitions);
    }

}

module.exports = Comment;