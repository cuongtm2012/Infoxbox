// var config = require('./config.db');

// const mysql = require('mysql'); // or use import if you use TS
// const util = require('util');
// const conn = mysql.createConnection(config);

// // node native promisify
// const query = util.promisify(conn.query).bind(conn);

// querySQL = async function (sql) {
//     //   try {
//     // const rows = await query(sql);
//     // console.log(JSON.stringify(rows));
//     // return JSON.stringify(rows);
//     //   } finally {
//     //     conn.end();
//     //   }
//     // await new Promise(resolve => {
//     //     resolve(query(sql));
//     // })
//     try {
//         return await Promise.resolve(query(sql))
//     } catch (e) {
//         conn.end();
//     }
// };

// module.exports = querySQL;
