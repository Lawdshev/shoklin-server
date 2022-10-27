const express = require("express");
const Joi = require('joi');
const cors = require('cors')
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(cors())

app.get('/customers',(req,res)=>{
    fs.readFile('files/customers.json','utf8', (err,data)=>{
        res.send(data)
     })
});
//ADD CUSTOMER
app.post('/customers',(req,res)=>{
    fs.readFile('files/customers.json','utf8', (err,data)=>{
        data = JSON.parse(data);
        
        const newCustomer = {
            _id: data.length + 1,
            name:req.body.name,
            email:req.body.email,
           address:req.body.address,
            phone:req.body.phone,
            tickets: []
        };
        data.push(JSON.stringify(newCustomer));
        
        fs.writeFile('files/customers.json',JSON.stringify(data) , function (err) {
            if (err) throw err;
            console.log('Replaced!');
          });
          res.send(newCustomer)
     })  
})
//ADD TICKET
app.post('/customers/:id/addOrder',(req,res)=>{
    const id = parseInt(req.params.id);
    
    fs.readFile('files/customers.json','utf8', (err,data)=>{
        data = JSON.parse(data);
        const customer = data.find(c=>c._id === id );

        const newOrder = {
            _orderId: 'xxx',
            typeOfOrder: req.body.typeOfOrder,
            numberOfClothes:  req.body.numberOfClothes,
            price:  req.body.price,
            pickUpName: customer.name,
            pickUpAddress: customer.address,
            phoneNumber: customer.phone
        };
        customer.tickets.push(newOrder);
        
        fs.writeFile('files/customers.json',JSON.stringify(data) , function (err) {
            if (err) throw err;
            console.log('Replaced!');
          });
        res.send(data)
     })  
})
//Edit information
app.put('/customers/:id/editInfo',(req,res)=>{
    const id = parseInt(req.params.id);
    
    fs.readFile('files/customers.json','utf8', (err,data)=>{
        data = JSON.parse(data);
        const customer = data.find(c=>c._id === id );
            customer.name = !req.body.name? customer.name: req.body.name,
            customer.email= !req.body.email? customer.name:req.body.email,
            customer.address= !req.body.address? customer.name:req.body.address,
            customer.phone= !req.body.phone? customer.name:req.body.phone,
        
        fs.writeFile('files/customers.json',JSON.stringify(data) , function (err) {
            if (err) throw err;
            console.log('Replaced!');
          });
        res.send(data)
     })  
})


app.listen(8080, ()=> console.log('listening on port 3001'));
