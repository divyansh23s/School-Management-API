const pool = require('../db/connection');
const { z } = require('zod');

// Haversine formula to calculate the distance between two geographical points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degree) => degree * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

const addSchoolSchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    latitude: z.number({ required_error: "Latitude is required and must be a number" }).min(-90).max(90),
    longitude: z.number({ required_error: "Longitude is required and must be a number" }).min(-180).max(180),
});

exports.addSchool = async (req, res) => {
    try {
        // Validate request body
        const validatedData = addSchoolSchema.parse(req.body);

        const { name, address, latitude, longitude } = validatedData;

        // Insert into database
        const [result] = await pool.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );

        res.status(201).json({
            message: 'School added successfully',
            schoolId: result.insertId
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error('Error adding school:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.listSchools = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude query parameters are required' });
        }

        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        if (isNaN(userLat) || isNaN(userLon)) {
            return res.status(400).json({ error: 'Latitude and longitude must be valid numbers' });
        }

        // Fetch all schools from the database
        const [schools] = await pool.execute('SELECT * FROM schools');

        // Calculate distance and map to a new array
        const sortedSchools = schools.map(school => {
            const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
            return {
                ...school,
                distance // adding distance property for sorting
            };
        }).sort((a, b) => a.distance - b.distance); // Sort by proximity

        res.status(200).json(sortedSchools);
    } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ error: 'Database table not found. Please ensure the schema setup is complete.' });
        }
        console.error('Error listing schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
