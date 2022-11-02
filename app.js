require('dotenv').config({ path: "./.env" });
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const hostname = process.env.HOST;
const port = process.env.PORT;
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.DB_URL).then(()=> console.log('connected to mongodb'))
.catch(err=> console.error("couldn't connect",err));

const customerSchema = mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    email: String, 
    tickets: [{
        _orderId: String,
        typeOfOrder: String,
        numberOfClothes:  Number,
        price: Number,
        pickUpName: String,
        pickUpAddress: String,
        phoneNumber: String
    }]
})

const Customers = mongoose.model('Customers',customerSchema);

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
app.get('/customers', async (req,res)=>{
    try {
        const customers = await Customers.find()
        res.send(customers)
    } catch (error) {
        res.status(400).send('no customers yet')
    }
});
//ADD CUSTOMER
app.post('/customers', async (req,res)=>{
    let customer = new Customers({
        name:req.body.name,
        email:req.body.email,
       address:req.body.address,
        phone:req.body.phone,
        tickets: []
    })
        try {
            await customer.save()
            res.send(customer)
        } catch (error) {
            res.send(error)
        }
     })  
//ADD TICKET
app.put('/customers/:id/addOrder', async (req,res)=>{
    const id = req.params.id; 
    
    const newOrder = {
        _orderId : randomString(),
        numberOfClothes : req.body.numberOfClothes,
        typeOfOrder : req.body.typeOfOrder,
        price: req.body.price,
    }
    try{
        const customer = await Customers.findByIdAndUpdate({ _id: id }, {
            $push: { tickets: newOrder }
           }, { new: true })

        res.send(customer)
    }
     catch (error) {
        res.send(error)
    }
     })  
//Edit information
app.put('/customers/:id/editInfo', async(req,res)=>{
    const id = req.params.id;
        const customer = await Customers.findById(id);
        if (!customer) return;
        try {
            customer.set({ 
                name: !req.body.name? customer.name: req.body.name,
                email: !req.body.email? customer.name:req.body.email,
                address: !req.body.address? customer.name:req.body.address,
                phone: !req.body.phone? customer.name:req.body.phone,
             });
            customer.save()
            res.send()
        } catch (error) {
            res.send(error)
        }    
    })

app.listen(port,hostname, ()=> console.log(`Server running`));

