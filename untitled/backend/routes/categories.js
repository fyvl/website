const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* GET All Products */
router.get('/', function(req, res) {

  database.table('categories as c')
      .withFields([
        'c.id as id',
        'c.title as title',
        'c.image as image'
      ])
      .sort({id: .1})
      .getAll()
      .then(cats => {
        if (cats.length > 0) {
          res.status(200).json({
            count: cats.length,
            categories: cats
          });
        } else {
          res.json({message: 'No products found'});
        }
      }).catch(err => console.log(err));
});

module.exports = router;