const { default: prisma } = require("../prisma/prisma-client");

const createPost = async (req, res) => {
  const { content } = req.body;
  const authorId = req.user.userId;

  if (!content) {
    res.status(400).json({ error: "Не должно быть пустым" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorId,
      },
    });

    return res.status(201).json(post, { message: "Пост создан" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { createPost };
