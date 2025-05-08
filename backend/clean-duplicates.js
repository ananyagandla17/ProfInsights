const mongoose = require('mongoose');
const Professor = require('./models/Professor');
require('dotenv').config({ path: './config/config.env' });

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB Connected');
  
  try {
    // Find all duplicate professors by name
    const duplicates = await Professor.aggregate([
      { $group: { _id: "$name", count: { $sum: 1 }, ids: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    console.log(`Found ${duplicates.length} professors with duplicate entries`);
    
    // Remove duplicates (keep first one, remove others)
    for (const duplicate of duplicates) {
      const [keepId, ...removeIds] = duplicate.ids;
      
      const result = await Professor.deleteMany({
        _id: { $in: removeIds }
      });
      
      console.log(`Kept ${keepId} and removed ${removeIds.length} duplicates for ${duplicate._id}`);
    }
    
    console.log('Cleanup complete!');
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
  } finally {
    mongoose.disconnect();
  }
});