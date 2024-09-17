

describe('Performance Testing', () => {
    it('should measure response time for /get_balance', () => {
      const startTime = Date.now();
  
      cy.request('GET', 'http://localhost:3000/get_balance', { user: 'wanne' })
        .then((response) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
  
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('balance');
          cy.log(`Response time: ${duration}ms`);
          expect(duration).to.be.lessThan(500);
        });
    });
  });


describe('Load Testing', () => {
    it('should handle multiple concurrent requests', () => {
      const numRequests = 50;
      const requests = [];
  
      for (let i = 0; i < numRequests; i++) {
        requests.push(
          cy.request('POST', 'http://localhost:3000/deposit', { user: 'wanne', value: 100 })
        );
      }
  
      cy.wrap(Promise.all(requests)).then((responses) => {
        responses.forEach((response) => {
          expect(response.status).to.be.oneOf([200, 400, 401]);
        });
      });
    });
  });
    