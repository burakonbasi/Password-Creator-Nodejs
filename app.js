const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Veritabanı bağlantısı
mongoose.connect('mongodb://localhost:27017/passwords', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Veritabanı bağlantı hatası:'));
db.once('open', function () {
  console.log('Veritabanı bağlantısı başarılı!');
});

// Şifre modeli ve şema
const passwordSchema = new mongoose.Schema({
  password: String,
});
const Password = mongoose.model('Password', passwordSchema);

// Rastgele şifre oluşturma fonksiyonu
function generateRandomPassword(length) {
  var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?";
  var password = "";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// API endpoint'i
app.get('/api/passwords', (req, res) => {
  var numberOfPasswords = 100;
  var passwordLength = 8;
  
  var passwords = [];
  
  for (var i = 0; i < numberOfPasswords; i++) {
    var password = generateRandomPassword(passwordLength);
    passwords.push(password);
    console.log("password : ",password)
    // Veritabanına şifreleri kaydetme
    var newPassword = new Password({ password: password });
    newPassword.save(function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
  
  res.json({ passwords: passwords });
});

// Sunucuyu başlatma
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} numaralı portta çalışıyor...`);
});
