const moment = require("moment");
const { UserModel } = require('../models/user.model');
const { ChatModel } = require('../models/chat.model');

exports.getChat = async (fromId, toId) => {
    const to = await findUserById(toId);
    const from = await findUserById(fromId);
    const fromObject = await (await UserModel.findById(fromId)).populate("chats").execPopulate();
    const chats = fromObject.chats;
    for (const chat of chats) {
      if (chat.participants.includes(toId)) {
        return chat._id.toString();
      } 
    }
  
    const chat = new ChatModel({ participants: [from, to]});
    await chat.save();
    await UserModel.updateOne({_id: fromId}, {$push: {chats: chat}});
    await UserModel.updateOne({_id: toId}, {$push: {chats: chat}});
  
    return chat._id.toString();
}


exports.formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format("h:mm a")
    };
}

exports.addMessage = async () => {

}
