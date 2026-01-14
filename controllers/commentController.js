const { default: prisma } = require("../prisma/prisma-client");

const createComment = async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.userId;

  if (!post || !content) {
    res.status(400).json({ message: "Все поля обязательны" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
    });

    return res.json(comment);
  } catch (error) {
    console.log(error, "error: createComment");
    return res.status(500).json(error);
  }
};

const deleteComment = async (req, res) => {};

module.exports = { createComment, deleteComment };
