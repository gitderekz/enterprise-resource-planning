const bcrypt = require('bcrypt');
const users = [
  { username: 'Alice Johnson', email: 'alice@example.com', role_id: 1 },
  { username: 'Benjamin Lee', email: 'benjamin@example.com', role_id: 2 },
  { username: 'Carla Mendes', email: 'carla@example.com', role_id: 3 },
  { username: 'David Kim', email: 'david@example.com', role_id: 4 },
  { username: 'Emily Stone', email: 'emily@example.com', role_id: 5 },
  { username: 'Frank Howard', email: 'frank@example.com', role_id: 1 },
  { username: 'Grace Liu', email: 'grace@example.com', role_id: 2 },
  { username: 'Hassan Ali', email: 'hassan@example.com', role_id: 3 },
  { username: 'Isla Patel', email: 'isla@example.com', role_id: 4 },
  { username: 'Jason Wong', email: 'jason@example.com', role_id: 5 },
  { username: 'Kylie Torres', email: 'kylie@example.com', role_id: 1 },
  { username: 'Liam Nguyen', email: 'liam@example.com', role_id: 2 },
  { username: 'Maria Rossi', email: 'maria@example.com', role_id: 3 },
  { username: 'Noah Schmidt', email: 'noah@example.com', role_id: 4 },
  { username: 'Olivia Brown', email: 'olivia@example.com', role_id: 5 },
  { username: 'Paul Garcia', email: 'paul@example.com', role_id: 1 },
  { username: 'Quinn O’Connor', email: 'quinn@example.com', role_id: 2 },
  { username: 'Rita Martins', email: 'rita@example.com', role_id: 3 },
  { username: 'Samuel Rivera', email: 'samuel@example.com', role_id: 4 },
  { username: 'Tina Müller', email: 'tina@example.com', role_id: 5 }
];

(async () => {
  const saltRounds = 10;
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  console.log("INSERT INTO medicine_factory.users (username, email, password, role_id) VALUES");
  users.forEach((user, index) => {
    const row = `('${user.username}', '${user.email}', '${hashedPassword}', ${user.role_id})`;
    process.stdout.write(row);
    if (index < users.length - 1) process.stdout.write(",\n");
    else process.stdout.write(";\n");
  });
})();
