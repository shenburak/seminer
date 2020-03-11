import mongoose from 'mongoose'
const kittySchema = new mongoose.Schema({
    name: String
});
export default mongoose.models.Kitten || mongoose.model('Kitten', kittySchema);