const sauces = require('../models/sauces');
const Sauce = require('../models/sauces');

exports.addNewSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Object saved' }))
        .catch((err) => res.status(400).json({ error: err }));
};

exports.displaySauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

exports.displayOne = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then((sauce) => { res.status(200).json(sauce); }
    ).catch((error) => { res.status(400).json({ error }) })
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(
            (sauce) => {
                if (!sauce) {
                    res.status(404).json({error: new Error('Sauce does not exist')});
                }
                if (sauce.userId !== req.auth.userId) {
                    res.status(400).json({error: new Error('Unauthorized request, user attempted to delete a sauce that wasn\'t theirs')});
                }
                Sauce.deleteOne({ _id: req.params.id }).then(
                    () => {res.status(200).json({message: 'Deleted'});}
                ).catch((error) => { res.status(400).json({ error: error }); });
            }
        )
};

exports.likedSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            const newValues = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 0,
                dislikes: 0
            }
            switch (like) {
                case 1:
                    newValues.usersLiked.push(userId);
                    break;
                case -1:
                    newValues.usersDisliked.push(userId);
                    break;
                case 0:
                    if (newValues.usersLiked.includes(userId)) {
                        const index = newValues.usersLiked.indexOf(userId);
                        newValues.usersLiked.splice(index, 1);
                    } else {
                        const index = newValues.usersDisliked.indexOf(userId);
                        newValues.usersDisliked.splice(index, 1);
                    }
                    break;
                default:
                    console.error('bad request')
            };
            newValues.likes = newValues.usersLiked.length;
            newValues.dislikes = newValues.usersDisliked.length;
            Sauce.updateOne({ _id: sauceId }, newValues )
                .then(() => res.status(200).json({}))
                .catch(error => res.status(400).json({ error }))  
        })
        .catch(error => res.status(500).json({ error }));
}