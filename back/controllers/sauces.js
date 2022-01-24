const sauces = require('../models/sauces');
const Sauce = require('../models/sauces');

//creating a new sauce in the database controller
exports.addNewSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce) //parsing through the request body
    const sauce = new Sauce({ //creating new object using Sauce model
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //getting image from local storage
        likes: 0, //initializing likes and dislikes
        dislikes: 0
    });
    sauce.save() //saving the new sauce in the database
        .then(() => res.status(201).json({ message: 'Object saved' }))
        .catch((err) => res.status(400).json({ error: err }));
};

//displays all sauces on the user's front page controller
exports.displaySauces = (req, res, next) => {
    Sauce.find() //finds all sauces in the database
        .then(sauces => res.status(200).json(sauces)) //returns all sauces data as json
        .catch(error => res.status(400).json({ error }))
};

//displays specific sauce page
exports.displayOne = (req, res, next) => {
    Sauce.findOne({ //finds the sauce in the database that matches the request's sauce id
        _id: req.params.id
    }).then((sauce) => { res.status(200).json(sauce); } //sends sauce data as json to be used by front end
    ).catch((error) => { res.status(400).json({ error }) })
};

//modifying sauce controller
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? //if new image
        {
            ...JSON.parse(req.body.sauce), //updates sauce data
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //updates image
        } : { ...req.body }; //if no image, only updates body
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //updates the sauce that matches the id with the new sauce object
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

//delete sauce controller
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //finds the sauce that matches the id in the database
        .then(
            (sauce) => {
                if (!sauce) { //case if sauce id not found in database
                    res.status(404).json({error: new Error('Sauce does not exist')});
                }
                if (sauce.userId !== req.auth.userId) { //case if the userId does not match the auth.userId => user who did not create the sauce is attempting to delete it
                    res.status(400).json({error: new Error('Unauthorized request, user attempted to delete a sauce that wasn\'t theirs')});
                }
                Sauce.deleteOne({ _id: req.params.id }).then( //if sauce found in database and right user is attempting to delete, deletes
                    () => {res.status(200).json({message: 'Deleted'});}
                ).catch((error) => { res.status(400).json({ error: error }); });
            }
        )
};


//like dislike controller
exports.likedSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId }) //finds the sauce the user is attempting to like/dislike in the database
        .then(sauce => {
            const newValues = { 
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 0,
                dislikes: 0
            }
            switch (like) {
                case 1: //case if user liked
                    newValues.usersLiked.push(userId); //pushes the userId in the userLiked array in the sauce object
                    break;
                case -1: //case if user disliked
                    newValues.usersDisliked.push(userId); //pushes the userId in the userDisliked array
                    break;
                case 0: //case if user reset their like/dislike to 0
                    if (newValues.usersLiked.includes(userId)) { //case if user went from like to 0
                        const index = newValues.usersLiked.indexOf(userId); //finds the index of the user in the userLiked array
                        newValues.usersLiked.splice(index, 1); //removes the user from the userLiked array
                    } else { //case if user went from dislike to 0
                        const index = newValues.usersDisliked.indexOf(userId); //finds the index of the user in the userDisliked array
                        newValues.usersDisliked.splice(index, 1); //removes the corresponding index in the userDisliked array
                    }
                    break;
                default: //if something went wrong
                    console.error('bad request')
            };
            newValues.likes = newValues.usersLiked.length; //sets the like number to the length of the userLiked array
            newValues.dislikes = newValues.usersDisliked.length; //sets the dislike number to the length of the userDisliked array
            Sauce.updateOne({ _id: sauceId }, newValues ) //updates the sauce in the database with the new like/dislike numbers and arrays
                .then(() => res.status(200).json({}))
                .catch(error => res.status(400).json({ error }))  
        })
        .catch(error => res.status(500).json({ error }));
}