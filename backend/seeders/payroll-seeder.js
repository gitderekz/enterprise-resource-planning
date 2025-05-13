'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create sample employees if they don't exist
    const employees = await queryInterface.bulkInsert('employees', [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: '$2a$10$examplehashedpassword',
        role_id: 2,
        baseSalary: 5000,
        position: 'Developer',
        hireDate: new Date('2020-01-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: '$2a$10$examplehashedpassword',
        role_id: 3,
        baseSalary: 4500,
        position: 'Designer',
        hireDate: new Date('2021-03-10'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });
    console.log("employees",employees);
    

    // Create deductions
    await queryInterface.bulkInsert('deductions', [
      {
        // userId: users[0].id,
        userId: 1,
        type: 'insurance',
        amount: 200,
        isPercentage: false,
        description: 'Health Insurance',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // userId: users[0].id,
        userId: 1,
        type: 'loan',
        amount: 5,
        isPercentage: true,
        description: 'Car Loan',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // userId: users[1].id,
        userId: 2,
        type: 'insurance',
        amount: 150,
        isPercentage: false,
        description: 'Health Insurance',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create payroll records
    await queryInterface.bulkInsert('payrolls', [
      {
        // userId: users[0].id,
        userId: 1,
        period: '2023-06',
        grossSalary: 5000,
        deductions: 450, // 200 + (5% of 5000)
        netSalary: 4550,
        status: 'paid',
        details: JSON.stringify({
          bonuses: 0,
          allowances: 0,
          overtime: 0,
          deductions: [
            { id: 1, amount: 200, description: 'Health Insurance' },
            { id: 2, amount: 250, description: 'Car Loan (5%)' }
          ]
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // userId: users[1].id,
        userId: 2,
        period: '2023-06',
        grossSalary: 4500,
        deductions: 150,
        netSalary: 4350,
        status: 'paid',
        details: JSON.stringify({
          bonuses: 0,
          allowances: 0,
          overtime: 0,
          deductions: [
            { id: 3, amount: 150, description: 'Health Insurance' }
          ]
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('payrolls', null, {});
    await queryInterface.bulkDelete('deductions', null, {});
    await queryInterface.bulkDelete('employees', null, {});
  }
};