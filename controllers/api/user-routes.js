const router = require('express').Router();
const {User, Post, Vote} = require('../../models');

//GET /api/users
router.get('/', (req, res) => {
    //access our User model and run .findAll() method
    User.findAll({
        attributes: {exclude: ['password']}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//Get /api/users/1
router.get('/:d', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
          id: req.params.id
        },
        include: [
          {
            model: Post,
            attributes: ['id', 'title', 'post_url', 'created_at']
          },
          // include the Comment model here:
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
              model: Post,
              attributes: ['title']
            }
          },
          {
            model: Post,
            attributes: ['title'],
            through: Vote,
            as: 'voted_posts'
          }
        ]
      })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log (err);
        res.status(500).json(err);
    });
});

//Post /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email:'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
      
          res.json(dbUserData);
        });
      })
});
router.post('/login', (req, res) => {

    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email:req.body.email
        }
   }).then(dbUserData => {
        if(!dbUserData){
           res.status(400).json({message: 'No user with that email address!'});
          return;
       }
       //res.json({user:dbUserData});

        //Very user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if(!validPassword){
            res.status(400).json({message: 'Incorrect password!'});
            return;
        }
        res.json({user: dbUserData, message: 'You are now logged in!'});
    })
  
  });

//Put /api/users/1
router.put('/:id', (req, res) => {
    //expect {username: 'Lernantino', email:'lernantino@gmail.com', password: 'password1234'}

    //if req.body has exact key/value paris to match the model, you can just use `req.body` instead

    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404),json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy ({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this id.'})
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
router.post('/logout', (req, res) => {
if(req.session.loggedIn){
    req.session.destroy(() => {
        res.status(204).end();
    });
} else {
    res.status(404).end();
}
});

module.exports = router;



