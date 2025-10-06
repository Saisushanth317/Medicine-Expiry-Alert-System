const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicine');
const { verifyToken } = require('../middleware/auth');

const isAdmin = (req) => req.user && req.user.role === 'admin';

// GET all
router.get('/', verifyToken, async (req,res) => {
  const meds = await Medicine.find().sort({expiryDate: 1});
  res.json(meds);
});

// GET expiring within 30 days
router.get('/expiring', verifyToken, async (req,res) => {
  const now = new Date();
  const thirty = new Date(); thirty.setDate(now.getDate()+30);
  const docs = await Medicine.find({ expiryDate: { $lte: thirty, $gte: now } }).sort({expiryDate:1});
  res.json(docs);
});

// POST create (admin)
router.post('/', verifyToken, async (req,res) => {
  if(!isAdmin(req)) return res.status(403).json({ message: 'Admin only' });
  const { name, batch, expiryDate, quantity } = req.body;
  try {
    const med = new Medicine({ name, batch, expiryDate, quantity });
    await med.save();
    res.json(med);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update (admin)
router.put('/:id', verifyToken, async (req,res) => {
  if(!isAdmin(req)) return res.status(403).json({ message: 'Admin only' });
  try {
    const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new:true });
    if(!med) return res.status(404).json({ message:'Not found' });
    res.json(med);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE (admin)
router.delete('/:id', verifyToken, async (req,res) => {
  if(!isAdmin(req)) return res.status(403).json({ message: 'Admin only' });
  await Medicine.findByIdAndDelete(req.params.id);
  res.json({ message:'Deleted' });
});

// PUT update quantity (staff/admin)
router.put('/:id/quantity', verifyToken, async (req,res) => {
  const { quantity } = req.body;
  if(typeof quantity !== 'number') return res.status(400).json({ message:'Quantity required' });
  try {
    const med = await Medicine.findById(req.params.id);
    if(!med) return res.status(404).json({ message:'Not found' });
    med.quantity = quantity;
    await med.save();
    res.json(med);
  } catch(err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
