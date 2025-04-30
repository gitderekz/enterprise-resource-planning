const Inventory = require('../models/Inventory');

// Get all inventory items
const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findAll();
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching inventory', error: err.message });
    }
};

// Add a new inventory item
const addInventory = async (req, res) => {
    const { material_name, quantity, threshold } = req.body;

    try {
        const inventory = await Inventory.create({
            material_name,
            quantity,
            threshold,
        });
        res.status(201).json({ message: 'Inventory item added successfully', inventory });
    } catch (err) {
        res.status(500).json({ message: 'Error adding inventory item', error: err.message });
    }
};

// Update an inventory item
const updateInventory = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const inventory = await Inventory.findByPk(id);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        inventory.quantity = quantity || inventory.quantity;
        await inventory.save();
        res.json({ message: 'Inventory item updated successfully', inventory });
    } catch (err) {
        res.status(500).json({ message: 'Error updating inventory item', error: err.message });
    }
};

// Delete an inventory item
const deleteInventory = async (req, res) => {
    const { id } = req.params;

    try {
        const inventory = await Inventory.findByPk(id);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        await inventory.destroy();
        res.json({ message: 'Inventory item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting inventory item', error: err.message });
    }
};

module.exports = { getInventory, addInventory, updateInventory, deleteInventory };