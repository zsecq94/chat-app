const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({ msg: "Message addedd successfully." });
    }
    return res.json({ msg: "Failed to add message to th database." });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllMessage = async (req, res, next) => {};
