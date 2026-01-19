// const { default: prisma } = require("../prisma/prisma-client");
const prisma = require("../prisma/prisma-client");

const followUser = async (req, res) => {
  const { followingId } = req.body;
  const userId = req.user.userId;

  if (followingId === userId) {
    return res
      .status(500)
      .json({ message: "Нельзя подписаться на самого себя" });
  }

  try {
    const existingFollow = await prisma.follows.findFirst({
      where: {
        AND: [{ followerId: userId }, { followingId }],
      },
    });
    if (existingFollow) {
      return res.status(400).json({ message: "Подписка уже есть" });
    }

    await prisma.follows.create({
      data: {
        follower: { connect: { id: userId } },
        following: { connect: { id: followingId } },
      },
    });

    return res.status(201).json({ message: "Подписка оформлена" });
  } catch (error) {
    console.log(error, "error: followUser");
    return res.status(500).json(error);
  }
};

const unfollowUser = async (req, res) => {
  const { followingId } = req.body;
  const userId = req.user.userId;

  try {
    const follows = await prisma.follows.findFirst({
      where: {
        AND: [{ followerId: userId }, { followingId }],
      },
    });

    if (!follows) {
      return res.status(404).json({ message: "Такой записи нет" });
    }

    await prisma.follows.delete({
      where: { id: follows.id },
    });

    return res.status(200).json({ message: "Вы отписались" });
  } catch (error) {
    console.log(error, "error: unfollowUser");
    return res.status(500).json(error);
  }
};

module.exports = { followUser, unfollowUser };
