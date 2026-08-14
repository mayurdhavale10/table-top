const fs = require('fs');
const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
const allergensList = ['Dairy', 'Gluten', 'Nuts', 'Soy', 'None'];

data.menu = data.menu.map(item => {
  const cals = Math.floor(Math.random() * (800 - 150) + 150);
  const numAllergens = Math.floor(Math.random() * 3);
  const allergens = [];
  for(let i=0; i<numAllergens; i++) {
    const a = allergensList[Math.floor(Math.random() * allergensList.length)];
    if(a !== 'None' && !allergens.includes(a)) allergens.push(a);
  }
  return { ...item, calories: `approx ${cals} kcal`, allergens };
});

fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
