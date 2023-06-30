const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;

const multer = require('multer')
const path = require('path')
var cors = require('cors');
app.use(cors({
    origin: '*'
}));

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// script upload

app.use(express.static("./public"))
 //! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});
 

 

// create data / insert data
app.post('/api/customer',upload.single('image'),(req, res) => {


    const data = { ...req.body };
    const no_pesanan = req.body.no_pesanan;
    const nama = req.body.nama;
    const no_telpon = req.body.no_telpon;
    const jenis_design = req.body.jenis_design;
    const spesifikasi_proyek = req.body.spesifikasi_proyek;
    const deadline = req.body.deadline;
    const anggaran = req.body.anggaran;
    

    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO customer (no_pesanan,nama,no_telpon,jenis_design,spesifikasi_proyek,deadline,anggaran) values (?,?,?,?,?,?,?);';
         
        // jalankan query
        koneksi.query(querySql,[ no_pesanan,nama,no_telpon,jenis_design,spesifikasi_proyek,deadline,anggaran], (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
       
            // jika request berhasil
            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:5000/images/' + req.file.filename;
        const referensi = imgsrc;
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySql = 'INSERT INTO customer (no_pesanan,nama,no_telpon,jenis_design,spesifikasi_proyek,deadline,anggaran,referensi) values (?,?,?,?,?,?,?,?);';
 
// jalankan query
koneksi.query(querySql,[ no_pesanan,nama,no_telpon,jenis_design,spesifikasi_proyek,deadline,anggaran,referensi], (err, rows, field) => {
    // error handling
    if (err) {
        return res.status(500).json({ message: 'Gagal insert data!', error: err });
    }
``
    // jika request berhasil
    res.status(201).json({ success: true, message: 'Berhasil insert data!' });
});
}
});




// read data / get data
app.get('/api/customer', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM customer';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});


// update data
app.put('/api/customer/:no_pesanan', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM customer WHERE no_pesanan = ?';
    
    const no_pesanan = req.body.no_pesanan;
    const nama = req.body.nama;
    const no_telpon = req.body.no_telpon;
    const jenis_design = req.body.jenis_design;
    const spesifikasi_proyek = req.body.spesifikasi_proyek;
    const deadline = req.body.deadline;
    const anggaran = req.body.anggaran;

    const queryUpdate = 'UPDATE customer SET nama=?,no_telpon=?,jenis_design=?,spesifikasi_proyek=?,deadline=?,anggaran=? WHERE no_pesanan =?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.no_pesanan, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [nama,no_telpon,jenis_design,spesifikasi_proyek,deadline,anggaran, req.params.no_pesanan], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// delete data
app.delete('/api/customer/:no_pesanan', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM customer WHERE no_pesanan = ?';
    const queryDelete = 'DELETE FROM customer WHERE no_pesanan = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.no_pesanan, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.no_pesanan, (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika delete berhasil
                res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
