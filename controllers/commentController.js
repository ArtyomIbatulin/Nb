// const { default: prisma } = require("../prisma/prisma-client");
const prisma = require("../prisma/prisma-client");

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

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }
    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const deletedComment = await prisma.comment.delete({ where: { id } });

    res.json(deletedComment);
  } catch (error) {
    console.log(error, "error: deleteComment");
    return res.status(500).json(error);
  }
};

module.exports = { createComment, deleteComment };
