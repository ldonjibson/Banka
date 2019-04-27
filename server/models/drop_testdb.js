import format from 'pg-format';
import { pool } from '../db/index';

const clienty = pool;

const dropTables = () => {
  clienty.query('DROP TABLE IF EXISTS  users, bankaccount, transaction CASCADE')
    .then((res) => {
      console.log('tables dropped');
    }).catch((error) => { console.log(error); });
};

dropTables();
