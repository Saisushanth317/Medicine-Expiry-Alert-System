const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Medicine = require('./models/medicine');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    const adminPass = await bcrypt.hash('Admin123',10);
    const staffPass = await bcrypt.hash('Staff123',10);

    await User.deleteMany({});
    await User.insertMany([
      { name:'Admin', email:'admin@hospital.com', password:adminPass, role:'admin' },
      { name:'Staff', email:'staff@hospital.com', password:staffPass, role:'staff' }
    ]);

    await Medicine.deleteMany({});
    await Medicine.insertMany([
      { name:'Paracetamol', batch:'B001', expiryDate:new Date('2025-10-20'), quantity:100 },
      { name:'Aspirin', batch:'B002', expiryDate:new Date('2025-10-10'), quantity:50 },
      { name:'Vitamin C', batch:'B003', expiryDate:new Date('2025-11-15'), quantity:200 }
    ]);

    console.log('Seed done'); process.exit();
  });
