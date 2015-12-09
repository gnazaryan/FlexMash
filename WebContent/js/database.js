var storage = {
	db: new PouchDB('https://143e3876-46cf-403e-aeac-f332a7185c79-bluemix.cloudant.com/flexmash', {
		ajax: {
			cache: false,
			timeout: 10000,
			headers: {
				//'Access-Control-Allow-Origin': 'true'
			},
		},
		auth: {
			username: '143e3876-46cf-403e-aeac-f332a7185c79-bluemix',
			password: '6a1de99bc3aeac2aba252b181a5bdf4cd52f5814649e3d45fbfde0b97d45c995'
		}
	}),
	initializeData: function(Y) {
		storage.db.get('nodes', function (err, response) {debugger;
			if (response != null && response.info) {
				app.dynamicNodes = response.info;
				storage.lastRevision = response;
			} else {
				app.dynamicNodes = [];
			}
			application.luncher(Y);
		});
	}
};