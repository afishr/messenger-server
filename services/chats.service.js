const { UserModel } = require('../models/user.model');
const { ChatModel } = require('../models/chat.model');
const { MessageModel } = require('../models/message.model');
const { findUserById } = require('./users.service');

exports.getChat = async (fromId, toId) => {
  const to = await findUserById(toId);
  const from = await findUserById(fromId);
  const fromObject = await (await UserModel.findById(fromId))
    .populate('chats')
    .execPopulate();
  const { chats } = fromObject;

  // eslint-disable-next-line no-restricted-syntax
  for (const chat of chats) {
    if (chat.participants.includes(toId)) {
      return chat._id.toString();
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
  await message.save();
};

exports.getMessages = async (userId, chatId) => {
  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: userId,
  }).exec();

  if (!chat) {
    return [];
  }

  return MessageModel.find({ chat: chatId })
    .sort({ timeSent: -1 })
    .exec();
};
