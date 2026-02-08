const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // GANTI INI: Sesuaikan dengan email & password admin yang kamu mau
    // Nantinya ini harusnya ngecek ke Database (User.findOne)
    if (email === "admin@mail.com" && password === "admin123") {
      
      // Buat Token (Gunakan secret key bebas untuk belajar)
      const token = jwt.sign({ id: 'admin_id' }, 'RAHASIA_NEGARA', { expiresIn: '1d' });

      return res.status(200).json({
        success: true,
        message: "Login Berhasil",
        token: token
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Email atau Password Salah"
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};