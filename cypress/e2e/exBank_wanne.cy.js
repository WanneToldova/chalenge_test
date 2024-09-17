describe('API Testing for Fake Bank API', () => {
    const apiUrl = 'http://localhost:3000/api';
    const testUser = 'Wanne';
  
    // Scenario 1: Create User
    describe('Create User Scenario', () => {
      it.only('should successfully create a new user', () => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}/create_user`,
          body: { user: testUser }
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.message).to.eq(`User ${testUser} created successfully`);
          expect(response.body.balance).to.eq(0);
        });
      });
  
      it('should fail to create a user if the user already exists', () => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}/create_user`,
          body: { user: testUser },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq('User already exists');
        });
      });
    });
  
    // Scenario 2: Deposit Funds
    describe('Deposit Funds Scenario', () => {
      it('should deposit funds successfully and return updated balance', () => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}/deposit`,
          body: { user: testUser, value: 500 }
        }).then((response) => {
          if (response.status === 200) {
            expect(response.body.message).to.eq('Deposit successful');
            expect(response.body.balance).to.be.greaterThan(0);
          } else {
            expect(response.status).to.be.oneOf([400, 401]);
            expect(response.body.message).to.be.oneOf(['Error on deposit', 'Invalid user']);
          }
        });
      });
    });
  
    // Scenario 3:  Funds
    describe('Withdraw Funds Scenario', () => {
        
      it('should withdraw funds successfully for a positive value', () => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}/withdraw`,
          body: { user: testUser, value: 300 }
        }).then((response) => {
          if (response.status === 200) {
            expect(response.body.message).to.eq('Withdraw successful');
            expect(response.body.balance).to.be.greaterThan(0);
          } else {
            expect(response.status).to.be.oneOf([400, 401]);
            expect(response.body.message).to.be.oneOf(['Invalid value', 'Error on withdraw', 'Invalid user']);
          }
        });
      });
  
      it('should fail to withdraw when value is negative or zero', () => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}/withdraw`,
          body: { user: testUser, value: -100 },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq('Invalid value');
        });
      });
    });
  
    // Scenario 4: Send Funds Between Users
    describe('Send Funds Scenario', () => {
      const anotherUser = 'wanne2';

      it('should transfer funds successfully between two users', () => {
        cy.request({
            method: 'POST',
            url: `${apiUrl}/create_user`,
            body: { user: anotherUser }
          }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.eq(`User ${anotherUser} created successfully`);
            expect(response.body.balance).to.eq(0);
          });
      });
  
      it('should transfer funds successfully between two users', () => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}/send`,
          body: { fromUser: testUser, toUser: anotherUser, value: 100 }
        }).then((response) => {
          if (response.status === 200) {
            expect(response.body.message).to.eq('Transfer successful');
          } else {
            expect(response.status).to.be.oneOf([400, 401]);
            expect(response.body.message).to.be.oneOf(['Insufficient balance', 'Invalid value', 'Invalid user', 'Error on transfer']);
          }
        });
      });
  
      it('should fail to transfer when value is zero or negative', () => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}/send`,
          body: { fromUser: testUser, toUser: anotherUser, value: 0 },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq('Invalid value');
        });
      });
  
      it('should fail when users are invalid', () => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}/send`,
          body: { fromUser: 'invalidUser', toUser: anotherUser, value: 100 },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.eq('Invalid user');
        });
      });
    });
  
    // Scenario 5: Get User Balance
    describe('Get User Balance Scenario', () => {
      it('should return the balance for a valid user', () => {
        cy.request({
          method: 'GET',
          url: `${apiUrl}/get_balance`,
          qs: { user: testUser }
        }).then((response) => {
          if (response.status === 200) {
            expect(response.body.message).to.eq('Balance retrieved successfully');
            expect(response.body.balance).to.be.greaterThan(0);
          } else {
            expect(response.status).to.be.oneOf([401]);
            expect(response.body.message).to.eq('Invalid user');
          }
        });
      });
  
      it('should fail for an invalid user', () => {
        cy.request({
          method: 'GET',
          url: `${apiUrl}/get_balance`,
          qs: { user: 'invalidUser' },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.eq('Invalid user');
        });
      });
    });
  });
  