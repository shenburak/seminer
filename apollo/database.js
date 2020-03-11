import mongoose from 'mongoose'
mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@seminer-mwiaq.mongodb.net/seminer?retryWrites=true&w=majority', {
    useUnifiedTopology: true, useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("bağlantı başarılı!")
});

export default db
