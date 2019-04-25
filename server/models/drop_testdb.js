const dropTables = () =>{
	return new Promise((resolve, reject) =>{
			clienty.query(`DROP TABLE IF EXISTS  users, bankaccount, transaction CASCADE`, (err, res) => {
					if (err){
						console.log(err);
					}else {
						console.log('tables dropped');
				}
			});
		}	
	)
}