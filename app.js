const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.listen(8080,()=>{
    console.log("Server is listening to 8080 port");
});

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


 
app.get("/",(req,res) => {
    res.send("Hi, I am root");
})

//Listing route
app.get("/listings", async(req,res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs",{allListing});
});

//NEW route
// app.get("/listings/new", (req,res) => {
//     res.render("./listings/new.ejs");
// });

// Route to show form for creating a new listing
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});



//SHOW route
app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
    let particularList = await Listing.findById(id);
    res.render("./listings/show.ejs",{particularList});
});

//CREATE route
app.post("/listings", async (req, res) => {
    let { title, description, image, price, location, country } = req.body;

    let newListing = new Listing({
        title,
        description,
        image: { url: image }, // Convert string to object format
        price,
        location,
        country
    });

    await newListing.save();
    res.redirect("/listings");
});


//EDIT route
app.get("/listings/:id/edit", async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
});

//UPDATE route
// app.put("/listings/:id", async(req,res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// });

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;

    let updatedData = { ...req.body.listing };

    // Ensure the image remains an object
    if (req.body.listing.image && req.body.listing.image.url) {
        updatedData.image = {
            url: req.body.listing.image.url,
            filename: "default-image" // Retain the filename or modify it if necessary
        };
    }

    await Listing.findByIdAndUpdate(id, updatedData, { new: true });

    res.redirect(`/listings/${id}`);
});



//DELETE route
app.delete("/listings/:id", async(req,res) => {
    let {id} = req.params;
    let listDeleted = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})



//listTesting route
// app.get("/testListing", async(req,res) => {
//     let sampleTesting = new Listing({
//         title:"My New Villa",
//         description:"By the beachy.",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India",
//     });

//     await sampleTesting.save();
//     console.log("sample was saved");
//     res.send("Succesfful testing");
// });


main()
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/nomadnest");
}