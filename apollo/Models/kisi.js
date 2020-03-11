import mongoose from 'mongoose'
const kisiSchema = new mongoose.Schema({
    kendisinifi: String,
    sinif: String,
    isimsoyisim: String,
    numara: String,
});
export default mongoose.models.Kisi || mongoose.model('Kisi', kisiSchema);