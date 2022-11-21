const Sequelize = require('sequelize');
const Express = require('express');
const methodOverride = require('method-override');
const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
const { STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/trees');
app.use(methodOverride('_method'));

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

        <h2> Or make your own: </h2>
        <form method='POST' action='/treeform'>
        <h3> Name </h3>
        
        <Input name='tree'> </Input>
        
        <h3> Description </h3>

        <Input name='description'> </Input>

        <button type="submit">Create</button>
        </form>

        </body>
        </html>`)
    }
    catch (e){
        console.log(e)
    }
})

app.post('/treeform', async (req, res) => {
    try {
        const data = req.body
        const newTree = await Trees.create({
            name: data.tree,
            description: data.description
        });
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})


app.get('/trees/:id', async (req, res, next) => {
    try {
        const SelectedTree = await Trees.findByPk(req.params.id);
        res.send(`<html> 
        <head />
        <body> 
        <h2> ${SelectedTree.name} </h2>
        <p> ${SelectedTree.description} </p>
        <INPUT TYPE="button" VALUE="Back" onClick="history.go(-1);">


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




