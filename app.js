
const app = express(); 

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))


app.get('/', (req,res) =>{
    res.render('home');
})

app.get('/makecampground', async(req,res) =>{
   const camp =new Campground({title:'My Backyard', description:'cheap camping'});
   await camp.save();
   res.send(camp);
})
 
app.listen(3000,() =>{
    console.log("serving on port 3000");
})