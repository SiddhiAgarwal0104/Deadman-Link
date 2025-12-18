const Collection = require("../models/Collection");

exports.createCollection = async (req, res) => {
  const collection = await Collection.create({
    userId: req.user.id,
    name: req.body.name
  });
  res.status(201).json(collection);
};

exports.getCollections = async (req, res) => {
  const collections = await Collection.find({ userId: req.user.id });
  res.json(collections);
};
