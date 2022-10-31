const express = require("express");
const Joi = require('joi');
const cors = require('cors')
const fs = require('fs');
const app = express();
const hostname = '0.0.0.0';
const port = 8080;
app.use(express.json());
app.use(cors())

const randomString=()=>{
    let hex =[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B','C', 'D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y', 'Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    let hexColor = "";
    for (let i = 0; i < 7; i++) {
    hexColor += hex[getRandomNumber()];
    }
    function getRandomNumber() {
      return Math.floor(Math.random() * hex.length);
    }
    return hexColor
}
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
            _id: randomString(),
            name:req.body.name,
            email:req.body.email,
           address:req.body.address,
            phone:req.body.phone,
            tickets: []
        };
        data.push(newCustomer);
        
        fs.writeFile('files/customers.json',JSON.stringify(data) , function (err) {
            if (err) throw err;
            console.log('Replaced!');
          });
          res.send(newCustomer)
     })  
})
//ADD TICKET
app.post('/customers/:id/addOrder',(req,res)=>{
    const id = req.params.id;
    
    fs.readFile('files/customers.json','utf8', (err,data)=>{
        data = JSON.parse(data);
        const customer = data.find(c=>c._id == id );

        const newOrder = {
            _orderId: randomString(),
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
            console.log('POSTED!');
          });
        res.send(data)
     })  
})
//Edit information
app.put('/customers/:id/editInfo',(req,res)=>{
    const id = req.params.id;
    
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


app.listen(port,hostname, ()=> console.log(`Server runnin at http://${hostname}:${port}/`));

