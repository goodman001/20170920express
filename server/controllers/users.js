const User = require('../models').User;
const NoteItem = require('../models').NoteItem;

module.exports = {
  create(req, res) {
    return User
      .create({
		email: req.body.email,
		password: req.body.password,
		address: req.body.address,
		country: req.body.country,
      })
      .then((user) => res.status(201).send(user))
      .catch((error) => res.status(400).send(error));
  },

  list(req, res) {
    return User
      .findAll({
        include: [{
          model: NoteItem ,
          as: 'noteItems',
        }],
        order: [
          ['createdAt', 'DESC'],
          [{ model: NoteItem, as: 'noteItems' }, 'createdAt', 'ASC'],
        ],
      })
      .then((users) => res.status(200).send(users))
      .catch((error) => res.status(400).send(error));
  },

  retrieve(req, res) {
    return User
      .findById(req.params.userid, {
        include: [{
          model: NoteItem ,
          as: 'noteItems',
        }],
      })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'user Not Found',
          });
        }
		//console.log("lalaal");
        return res.status(200).send(user);
      })
      .catch((error) => res.status(400).send(error));
  },
  check(req, res) {
    return User
      .findOne({ where: {email: req.body.email,password: req.body.password} })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'user Not Found',
          });
        }
        return res.status(200).send(user);
      })
      .catch((error) => res.status(400).send(error));
  },

};
