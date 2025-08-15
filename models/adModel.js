// models/serviceModel.js
const db = require('./db');


try {

} catch (error) {
    console.error('Error in database transaction:', err);
    throw err;
}

// CREATE: Add a new advertisement
exports.createAdvertisement = async (imagePath) => {
    try {

        const [result] = await db.query(
            'INSERT INTO advertisement (image) VALUES (?)',
            [imagePath]
        );
        return result.insertId; // Returns the new ad_id
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }
};

// READ: Get all advertisements
exports.getAllAdvertisements = async () => {
    try {

        const [rows] = await db.query('SELECT * FROM advertisement');
        return rows;
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }
};

// READ: Get advertisement by ID
exports.getAdvertisementById = async (ad_id) => {
    try {

        const [rows] = await db.query('SELECT * FROM advertisement WHERE ad_id = ?', [ad_id]);
        return rows[0]; // Returns a single ad or undefined
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }
};


// DELETE: Remove advertisement by ID
exports.deleteAdvertisement = async (ad_id) => {
    try {

        const [result] = await db.query('DELETE FROM advertisement WHERE ad_id = ?', [ad_id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }
};
