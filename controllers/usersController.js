var validation = require('../util/validation');

exports.isID = function (req, res) {
	var id = req.query.id;
	var QUERY_SELECT = 'SELECT a.M_USER_ID, a.M_USER_PIN, a.M_USER_STATUS, a.DEVICE_ID, b.RESIDENT_NM, b.EMAIL ';
	var QUERY_FROM = ' FROM tland.M_USER a INNER JOIN tland.CM_RESIDENT b ON a.M_USER_ID = b.M_USER_ID WHERE a.M_USER_ID = ? ';
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query(QUERY_SELECT + QUERY_FROM, id, function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({
					'msg': err
				});
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};

