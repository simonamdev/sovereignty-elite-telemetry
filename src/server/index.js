import * as express from "express";
import * as path from "path";

const app = express();


app.use('/', (req, res) => {
    res.send('Hello World');
});

app.use('/static', express.static(path.resolve('./dist/client')));


app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
