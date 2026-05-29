import express from 'express';
import db from "./db.js";

const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
	res.render("index")
})

app.get("/dashboard",(req,res)=>{
	db.query("SELECT * FROM contact ORDER BY created_at ASC",(err,result)=>{
		if(err){
			return res.send("Error while fetching data from database.")
		}
		res.render("dashboard",{contacts: result})
	});
})

app.post("/submit",(req,res)=>{
	const { name, mail, message } = req.body;

	db.query("INSERT INTO contact (name,email,message) VALUES (?,?,?)",[name,mail,message],
		(err,result)=>{
			if(err){
				return res.send(`
		        <script>
		            alert('Error occur while saving data. Please try again.');
		            window.location.href = "/";
		        </script>
    			`);
			}
			res.send(`
	        <script>
	            alert('Successfully received message');
	            window.location.href = "/";
	        </script>
    		`);
		})

})

app.use((req, res) => {
    res.status(404).send("Page Not Found!");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});