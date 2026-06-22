import Address from "../models/adress.js";

// Add address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ SECURE SOURCE
    await Address.create({ ...req.body.address, userId });

    res.json({ success: true, message: "Address added successfully" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

// Get address
export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ SECURE SOURCE
    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
