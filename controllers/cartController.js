const db = require("../models");

// переписать корзину

const createOrder = async (req, res) => {
  const { amount, status } = req.body;

  try {
    const order = await db.Orders.create({
      amount,
      status,
    });

    return res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const orderId = await db.Orders.findOne({ where: { id } });
    if (!orderId) {
      return res.json({ error: "Покупка с этим id не найдена" });
    }

    await db.Orders.destroy({ where: { id } });

    return res.json({ message: "Покупка успешно удалена" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findOrdersAll = async (req, res) => {
  try {
    const orders = await db.Orders.findAll({
      // attributes: { exclude: ['category'] },
      include: [db.User, db.Book],
    });

    return res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const orderId = await db.Orders.findOne({ where: { id } });

    if (!orderId) {
      return res.json({ error: "Покупка с этим id не найдена" });
    }

    const order = await db.Orders.findOne({ where: { id } });

    return res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const putOrder = async (req, res) => {
  const id = req.params.id;
  const { amount, status } = req.body;

  try {
    const orderId = await db.Orders.findOne({ where: { id } });
    if (!orderId) {
      return res.json({ error: "Покупка с этим id не найдена" });
    }

    await db.Orders.update(
      {
        amount,
        status,
      },
      { where: { id } }
    );

    return res.json({ message: "Покупка изменена" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createOrder,
  deleteOrder,
  findOrdersAll,
  findOrder,
  putOrder,
};
