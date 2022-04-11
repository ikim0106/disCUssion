/*
References
1. https://stackfame.com/mongodb-chat-schema-mongoose-chat-schema-chat-application
2. https://stackoverflow.com/questions/26936645/mongoose-private-chat-message-model
3. https://mongoosejs.com/docs/guide.html
4. https://github.com/jaewonhimnae/react-chat/blob/5316520881ac1101ae11f9b6c5ba3f5852aa9867/server/models/Chat.js

Resource 1~3 were used as learning material.
The structure and some code from this schema was copied from resource 4 and modified to fit the project.
A chat can either be a one-on-one chat or a chat with 3 or more people, is_group differentiates the two. In a group chat, the chat creator is a manager of that chat.
Otherwise, there will be no manager.

This module is exported to be used by other modules (chat.js)
*/

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let chatroomSchema = new Schema({
   is_group: {type: Boolean, default: false},
   name: {type: String},
   users: [{type: mongoose.Schema.Types.ObjectId, ref: 'userModel'}],
   manager: [{type: mongoose.Schema.Types.ObjectId, ref: 'userModel'}],
   last_message: [{type: mongoose.Schema.Types.ObjectId, ref: 'messageModel'}]
},
{
   timestamps: true
})

let chatroomModel = mongoose.model('chatroomModel', chatroomSchema)
module.exports = chatroomModel