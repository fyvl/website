const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* GET ALL ORDERS */
router.get('/', (req, res) => {
    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username'])
        .sort({id: 1})
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json(orders);
            } else {
                res.json({message: 'No orders found'});
            }
        }).catch(err => console.log(err));
});

/* GET SINGLE ORDER */
router.get('/:id', (req, res) => {
    const orderId = req.params.id;

    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username', 'p.image', 'od.quantity as quantityOrdered'])
        .filter({'o.id': orderId})
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json(orders);
            } else {
                res.json({message: `No orders found with order id ${orderId}`});
            }
        }).catch(err => console.log(err));
});

/* PLACE A NEW ORDER */
router.post('/new', async (req, res) => {
    let {userId, products} = req.body;
    console.log(userId);
    console.log(products);

    if (userId !== null && userId > 0) {
        database.table('orders')
            .insert({
                user_id: userId
            }).then(newOrderId => {
                if (newOrderId.insertId > 0){
                    products.forEach(async (p) => {

                        let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();
                        let inCart = parseInt(p.inCart);

                        console.log(data);
                        if (data.quantity > 0){
                            data.quantity = data.quantity - inCart;

                            if (data.quantity < 0){
                                data.quantity = 0;
                            }
                        } else{
                            data.quantity = 0;
                        }
                        // INSERT ORDER DETAILS
                        database.table('orders_details')
                            .insert({
                                order_id: newOrderId.insertId,
                                product_id: p.id,
                                quantity : inCart
                            }).then(newId => {
                                database.table('products')
                                    .filter({id: p.id})
                                    .update({
                                        quantity: data.quantity
                                    }).then(successNum => {
                                }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    });
                } else {
                    res.json({message: 'new order failed while adding order details', success: false});
                }
                res.json({
                    message: `Order successfully placed with order id ${newOrderId.insertId}`,
                    success: true,
                    order_id: newOrderId.insertId,
                    products: products
                })
        }).catch(err => console.log(err));
    }
    else {
        res.json({message: 'New order failed', success: false});
    }
});

/* FAKE PAYMENT GATEWAY CALL */
router.post('/payment', (req, res) => {
    setTimeout(() => {
        res.status(200).json({success: true});
    }, 3000);
});

module.exports = router;