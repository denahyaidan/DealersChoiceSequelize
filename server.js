const Sequelize = require('sequelize');
const Express = require('express');
const app = Express();
const { STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/trees');

const Trees = conn.define('trees', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: STRING,
    allowNull: false,
    validate: {
        notEmpty: true
    }
  }
});

app.get('/', async (req, res, next) => {
    try {
        const TreeData = await Trees.findAll();
        res.send(`<html> 
        <head />
        <body> 
        <h1> Welcome to the Treedex! </h1>
        <h2> Pick a tree: </h2>
        <ul>
        ${TreeData.map((tree) => {
            return `<li> 
            <a href ="/trees/${tree.id}">
            ${tree.name} 
            </a>
            </li>`
        }).join('')}
        </ul>
        </body>
        </html>`)
    }
    catch (e){
        console.log(e)
    }
})

app.get('/trees/:id', async (req, res, next) => {
    try {
        const SelectedTree = await Trees.findByPk(req.params.id);
        console.log(SelectedTree);
        res.send(`<html> 
        <head />
        <body> 
        <h1> ${SelectedTree.name} </h1>
        <p> ${SelectedTree.description} </p>

        </body>
        </html>`)
    }
    catch (e){
        console.log(e)
    }
})


const init = async()=> {
    try {
      await conn.sync({ force: true });
      const [Ash, Birch, Oak, Maple] = await Promise.all([
        Trees.create({name: "Ash", description: "Ash tree is very famous in the northern parts of Europe, Asia, and North America. It is a deciduous tree that belongs to the family of Oleaceae and genus Fraxinus. "}),
        Trees.create({name: "Birch", description: "A birch is a thin-leaved deciduous hardwood tree of the genus Betula, in the family Betulaceae, which also includes alders, hazels, and hornbeams."}),
        Trees.create({name: "Oak", description: "An oak is a tree or shrub in the genus Quercus of the beech family, Fagaceae."}),
        Trees.create({name: "Maple", description: "The maple is a common symbol of strength and endurance and has been chosen as the national tree of Canada."})
      ]);
      const port = process.env.PORT || 3000;
      app.listen(port, ()=> console.log(`lisening on port ${port}`));
    }
    catch(ex){
      console.log(ex);
    }
  };

init();




