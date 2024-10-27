const db = require('../db/config');

// Example GET request
exports.getData = (req, res) => {
  db.query('SELECT * FROM your_table', (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to retrieve data' });
    } else {
      res.status(200).json(results);
    }
  });
};

// Example POST request
exports.postData = (req, res) => {
  const { name, value } = req.body;
  db.query('INSERT INTO your_table (name, value) VALUES (?, ?)', [name, value], (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to save data' });
    } else {
      res.status(201).send({ message: 'Data saved successfully' });
    }
  });
};
