describe('Mocked API Testing for exBank API', () => {
    const apiUrl = 'http://localhost:3000/api';
    const testUser = 'Wanne';
  
    // Scenario 1: Create User
    describe('Create User Scenario', () => {
      it('should successfully create a new user', () => {
        cy.intercept('POST', `${apiUrl}/create_user`, {
          statusCode: 201,
          body: { message: `User ${testUser} created successfully`, balance: 0 }
        }).as('createUser');
  
        cy.request({
          method: 'POST',
          url: `${apiUrl}/create_user`,
          body: { user: testUser }
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.message).to.eq(`User ${testUser} created successfully`);
          expect(response.body.balance).to.eq(0);
        });
  
        cy.wait('@createUser');
      });
  
      it('should fail to create a user if the user already exists', () => {
        cy.intercept('POST', `${apiUrl}/create_user`, {
          statusCode: 400,
          body: { message: 'User already exists' }
        }).as('createUserFail');
  
        cy.request({
          method: 'POST',
          url: `${apiUrl}/create_user`,
          body: { user: testUser },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq('User already exists');
        });
  
        cy.wait('@createUserFail');
      });
    });
  
    // Scenario 2: Deposit Funds
    describe('Deposit Funds Scenario', () => {
      it('should deposit funds successfully and return updated balance', () => {
        cy.intercept('POST', `${apiUrl}/deposit`, {
          statusCode: 200,
          body: { message: 'Deposit successful', balance: 1500 }
        }).as('depositSuccess');
  
        cy.request({
          method: 'POST',
          url: `${apiUrl}/deposit`,
          body: { user: testUser, value: 500 }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq('Deposit successful');
          expect(response.body.balance).to.be.greaterThan(0);
        });
  
        cy.wait('@depositSuccess');
      });
  
      it('should fail to deposit due to error', () => {
        cy.intercept('POST', `${apiUrl}/deposit`, {
          statusCode: 400,
          body: { message: 'Error on deposit' }
        }).as('depositFail');
  
        cy.request({
          method: 'POST',
          url: `${apiUrl}/deposit`,
          body: { user: testUser, value: 500 },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq('Error on deposit');
        });
  
        cy.wait('@depositFail');
      });
    });
  
    // Scenario 3: Withdraw Funds
    describe('Withdraw Funds Scenario', () => {
      it('should withdraw funds successfully for a positive value', () => {
        cy.intercept('POST', `${apiUrl}/withdraw`, {
          statusCode: 200,
          body: { message: 'Withdraw successful', balance: 1200 }
        }).as('withdrawSuccess');
  
        cy.request({
          method: 'POST',
          url: `${apiUrl}/withdraw`,
          body: { user: testUser, value: 300 }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq('Withdraw successful');
          expect(response.body.balance).to.be.greaterThan(0);
        });
  
        cy.wait('@withdrawSuccess');
      });
  
      it('should fail to withdraw when value is negative or zero', () => {
        cy.intercept('POST', `${apiUrl}/withdraw`, {
          statusCode: 400,
          body: { message: 'Invalid value' }
        }).as('withdrawFail');
  
        cy.request({
          method: 'POST',
          url: `${apiUrl}/withdraw`,
          body: { user: testUser, value: -100 },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq('Invalid value');
        });
  
        cy.wait('@withdrawFail');
      });
    });
  
    // Scenario 4: Send Funds Between Users
    describe('Send Funds Scenario', () => {
      const anotherUser = 'user2';
  
      it('should transfer funds successfully between two users', () => {
        cy.intercept('POST', `${apiUrl}/send`, {
          statusCode: 200,
          body: { message: 'Transfer successful' }
        }).as('sendSuccess');
  
        cy.request({
          method: 'POST',
          url: `${apiUrl}/send`,
          body: { fromUser: testUser, toUser: anotherUser, value: 100 }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq('Transfer successful');
        });
  
        cy.wait('@sendSuccess');
      });
  
      it('should fail to transfer when value is zero or negative', () => {
        cy.intercept('POST', `${apiUrl}/send`, {
          statusCode: 400,
          body: { message: 'Invalid value' }
        }).as('sendFail');
  
        cy.request({
          method: 'POST',
          url: `${apiUrl}/send`,
          body: { fromUser: testUser, toUser: anotherUser, value: 0 },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq('Invalid value');
        });
  
        cy.wait('@sendFail');
      });
    });
  
    // Scenario 5: Get User Balance
    describe('Get User Balance Scenario', () => {
      it('should return the balance for a valid user', () => {
        cy.intercept('GET', `${apiUrl}/get_balance`, {
          statusCode: 200,
          body: { message: 'Balance retrieved successfully', balance: 1500 }
        }).as('getBalanceSuccess');
  
        cy.request({
          method: 'GET',
          url: `${apiUrl}/get_balance`,
          qs: { user: testUser }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq('Balance retrieved successfully');
          expect(response.body.balance).to.be.greaterThan(0);
        });
  
        cy.wait('@getBalanceSuccess');
      });
  
      it('should fail for an invalid user', () => {
        cy.intercept('GET', `${apiUrl}/get_balance`, {
          statusCode: 401,
          body: { message: 'Invalid user' }
        }).as('getBalanceFail');
  
        cy.request({
          method: 'GET',
          url: `${apiUrl}/get_balance`,
          qs: { user: 'invalidUser' },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.eq('Invalid user');
        });
  
        cy.wait('@getBalanceFail');
      });
    });
  });
  