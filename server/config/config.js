//
// --- Puerto
//
process.env.PORT = process.env.PORT || 3000;





//
// --- Entorno
//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//
// --- Fecha de expiracion del token
// 60 min
// 60 SEG
process.env.CADUCIDAD = '48h';



//
// --- SEED del token
//
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//
// --- Base de datos
//

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;

//
// --- Google Cliente ID
//
process.env.CLIENT_ID = process.env.CLIENT_ID;