const accounts = {
    teste01: { balance: 1000 },
    teste02: { balance: 1000 },
    teste03: { balance: 1000 },
  };
  
 
  const randomStatus = (successCodes = [200], errorCodes = [400, 401]) => {
    const codes = [...successCodes, ...errorCodes];
    return codes[Math.floor(Math.random() * codes.length)];
  };
  
  // POST /create_user
 exports.create_user = (req, res) => {
    const { user } = req.body;
    
   
    if (!user) return res.status(400).json({ message: 'Username is required' });
  
    
    if (accounts[user]) return res.status(400).json({ message: 'User already exists' });
  
    accounts[user] = { balance: 0 };
  
  
    res.status(201).json({ message: `User ${user} created successfully`, balance: accounts[user].balance });
  };
  
  // POST /deposit
  exports.deposit = (req, res) => {
    const { user, value } = req.body;
    const statusCode = randomStatus([200], [400]);
  
    if (!accounts[user]) return res.status(401).json({ message: 'Invalid user' });
  
    if (statusCode === 200) {
      accounts[user].balance += value;
      res.status(200).json({ balance: accounts[user].balance, message: 'Deposit successful' });
    } else {
      res.status(statusCode).json({ message: 'Error on deposit' });
    }
  };
  
  // POST /withdraw
  exports.withdraw = (req, res) => {
    const { user, value } = req.body;
    const statusCode = randomStatus([200], [400]);
  
    if (!accounts[user]) return res.status(401).json({ message: 'Invalid user' });
  
    if (value <= 0) return res.status(400).json({ message: 'Invalid value' });
  
    if (statusCode === 200) {
      accounts[user].balance += value;
      res.status(200).json({ balance: accounts[user].balance, message: 'Withdraw successful' });
    } else {
      res.status(statusCode).json({ message: 'Error on withdraw' });
    }
  };
  
  // POST /send
  exports.send = (req, res) => {
    const { fromUser, toUser, value } = req.body;
    const statusCode = randomStatus([200], [400, 401]);
  
    if (!accounts[fromUser] || !accounts[toUser]) return res.status(401).json({ message: 'Invalid user' });
  
    if (value <= 0) return res.status(400).json({ message: 'Invalid value' });
  
    if (statusCode === 200) {
      if (accounts[fromUser].balance < value) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      accounts[fromUser].balance -= value;
      accounts[toUser].balance += value;
      res.status(200).json({ message: 'Transfer successful' });
    } else {
      res.status(statusCode).json({ message: 'Error transfer' });
    }
  };
  
  // GET /get_balance
  exports.get_balance = (req, res) => {
    const { user } = req.query;
    const statusCode = randomStatus([200], [401]);
  
    if (!accounts[user]) return res.status(401).json({ message: 'Invalid user' });
  
    if (statusCode === 200) {
      res.status(200).json({ balance: accounts[user].balance, message: 'Balance retrieved successfully' });
    } else {
      res.status(statusCode).json({ message: 'Erro na consulta' });
    }
  };
  