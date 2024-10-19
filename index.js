const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;


// ตั้งค่า EJS เป็น view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// สร้างการเชื่อมต่อกับ MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apartment_rental'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// แสดงข้อมูลการเช่า
app.get('/', (req, res) => {
    db.query('SELECT * FROM rentals', (err, results) => {
        if (err) throw err;
        res.render('index', { rentals: results });
    });
});

// เพิ่มข้อมูลการเช่า
app.post('/add', (req, res) => {
    const { tenant_name, phone_number, rental_date, due_date, electricity_units, water_units, total_price } = req.body;
    const sql = 'INSERT INTO rentals (tenant_name, phone_number, rental_date, due_date, electricity_units, water_units, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [tenant_name, phone_number, rental_date, due_date, electricity_units, water_units, total_price], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// แก้ไขข้อมูลการเช่า
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { tenant_name, phone_number, rental_date, due_date, electricity_units, water_units, total_price } = req.body;
    const sql = 'UPDATE rentals SET tenant_name = ?, phone_number = ?, rental_date = ?, due_date = ?, electricity_units = ?, water_units = ?, total_price = ? WHERE id = ?';
    db.query(sql, [tenant_name, phone_number, rental_date, due_date, electricity_units, water_units, total_price, id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// ลบข้อมูลการเช่า
app.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    function confirmDelete() {
        // แสดง alert เตือน
        let isConfirmed = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบ?");
        if (isConfirmed) {
            // ถ้าผู้ใช้กด "ตกลง" (OK)
            alert("รายการถูกลบแล้ว");
            // ที่นี้คุณสามารถเพิ่มโค้ดลบข้อมูลได้
        } else {
            // ถ้าผู้ใช้กด "ยกเลิก" (Cancel)
            alert("ยกเลิกการลบ");
        }
    }
    const sql = 'DELETE FROM rentals WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
