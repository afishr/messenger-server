const { UserModel } = require('../models/user.model');
const { ChatModel } = require('../models/chat.model');
const { MessageModel } = require('../models/message.model');
const { findUserById } = require('./users.service');

exports.getChat = async (fromId, toId) => {
  const to = await findUserById(toId);
  const from = await findUserById(fromId);
  let fromObject = await UserModel.findById(fromId);
  if (fromObject) {
    fromObject = await fromObject.populate('chats').execPopulate();
    const { chats } = fromObject;
    for (const chat of chats) {
      if (chat.participants.includes(toId)) {
        return chat._id.toString();
      }
    }
  }

  const chat = new ChatModel({ participants: [from, to] });
  await chat.save();
  await UserModel.updateOne({ _id: fromId }, { $push: { chats: chat } });
  await UserModel.updateOne({ _id: toId }, { $push: { chats: chat } });

  return chat._id.toString();
};

exports.formatMessage = (username, text, time) => ({
  username,
  text,
  time,
});

function findChatById(id) {
  return ChatModel.findById(id);
}

exports.addMessage = async (from, chatId, content, timeSent) => {
  const chat = await findChatById(chatId);
  const message = new MessageModel({
    from,
    chat,
    content,
    timeSent,
  });
  message.save();

  await ChatModel.updateOne({ _id: chat._id }, { $push: { messages: message } });
};

exports.getMessages = async (userId, chatId) => {
  const chat = await ChatModel.findOne({
    _id: chatId,
  }).exec();

  if (!chat.participants.includes(userId) || !chat) {
    return [];
  }

  messages = await MessageModel.find({ chat: chatId })
    .sort({ timeSent: 1 })
    .exec();

  for (message of messages) {
    await message.populate('from', 'username').execPopulate();
  }
  return messages
};
