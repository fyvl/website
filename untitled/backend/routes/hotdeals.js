const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* GET All Products (with pagination) */
router.get('/', function(req, res) {

  database.table('products as p where p.is_hot = 1')
      .withFields([
        'p.title as name',
        'p.price',
        'p.description',
        'p.quantity',
        'p.image',
        'p.id',
        'p.is_hot'
      ])
      .sort({id: .1})
      .getAll()
      .then(prods => {
        if (prods.length > 0) {
          res.status(200).json({
            count: prods.length,
            products: prods
          });
        } else {
          res.json({message: 'No products found'});
        }
      }).catch(err => console.log(err));
});

module.exports = router;