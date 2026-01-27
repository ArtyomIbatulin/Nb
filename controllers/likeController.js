const prisma = require("../prisma/prisma-client");

const likePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;
  try {
    if (!postId) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });
    if (existingLike) {
      return res.status(400).json({ message: "Вы уже ставили лайк" });
    }

    const like = await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return res.json(like);
  } catch (error) {
    console.log(error, "error: likePost");
    return res.status(500).json(error);
  }
};

const unlikePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) {
    return res.status(400).json({ message: "Вы уже ставили дизлайк" });
  }
  try {
    const existingLike = await prisma.like.findFirst({
      where: { postId: id, userId },
    });
    if (!existingLike) {
      return res.status(400).json({ message: " Нельзя поставить дизлайк" });
    }

    const like = await prisma.like.deleteMany({
      where: { postId: id, userId },
    });

    return res.json(like);
  } catch (error) {
    console.log(error, "error: unlikePost");
    return res.status(500).json(error);
  }
};

module.exports = { likePost, unlikePost };
