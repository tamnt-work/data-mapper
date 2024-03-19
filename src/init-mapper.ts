const interfaceContent = `export interface [IntefaceName] {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  companyName: string;
}`;

// Regular expression to match property names
const propertyRegex = /(\w+):\s*\w+/g;

// Extract property names
const properties = [];
let match;
while ((match = propertyRegex.exec(interfaceContent)) !== null) {
  properties.push(match[1]);
}

console.log(properties);
