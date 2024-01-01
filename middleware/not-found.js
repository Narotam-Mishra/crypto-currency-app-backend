// middleware for invalid routes
const notFound = (req,res) => {
    res.send('Route path does not exist!!');
}

module.exports = notFound;