import mongoose from 'mongoose'
const sinifSchema = new mongoose.Schema({
    saat: String,
    sinif: String,
    icerik: String,
    kontenjan: String,
    aciklama: String,
});
export default mongoose.models.Sinif || mongoose.model('Sinif', sinifSchema);