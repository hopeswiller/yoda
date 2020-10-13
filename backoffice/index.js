const app = require('express')()
const {
    graphqlHTTP
} = require('express-graphql')
// const bodyParser = require('body-parser')
const http_server = require('http').createServer(app)
const dotenv = require('dotenv')
const figlet = require('figlet')
dotenv.config()

const mongoConnect = require('./dbConnect')
const graphql_schema = require('./models/graphql/schema')



//Middlewares and Connections
mongoConnect();
app.set('view engine', 'ejs');
app.use('/graphql', graphqlHTTP({
    schema: graphql_schema,
    graphiql: true
}));



app.get('/', (req, res) => {
    res.send(
        `   <h1>HELLO TO GRAPHQL</h1>
            <p><a href="/graphql">next to graphql endpoint</a></p>
            <p><a href="/test">next to test endpoint</a></p>
            <p><a href="/binExtAPI/FundAssetAllocation/date=:date&assetMapID=:AssetMapID&fundCodes=:fundcode">binfolio</a></p>
        `
    )
});


app.get('/test', (req, res) => {
    user = {person: 'kofi',age:3}
    res.render('d.ejs',user)
})


app.get(`/binExtAPI/FundAssetAllocation/date=:date&assetMapID=:AssetMapID&fundCodes=:fundcode`, (req, res) => {
    console.log(req.params)
    if (req.params){
        resp = {
            "result": [
                {
                    "assetClass": "Net_Cash",
                    "fundCode": "FD00000031",
                    "portfolioID": 60482,
                    "portfolioName": "Petra Opportunity Share Class A",
                    "statusCode": 0,
                    "systemDate": "2020-06-12T12:51:42",
                    "valuationDate": "2020-06-11T00:00:00",
                    "weight": 100
                }
            ]
        }
        res.status(200).json(resp)
    }
    else{
        res.status(404).json({error: "No parameters entered"})
    }
    console.log('done running')
});





http_server.listen(process.env.PORT || 4000, () => {
    figlet('BookShop', (err, data) => {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    })
    console.log(`Server running on http://localhost:${process.env.PORT || 4000}`)
})