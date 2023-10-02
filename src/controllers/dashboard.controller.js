
const dashboardController = async (req, res) => {
  res.json({
    error: null,
    data: {
        title: 'mi ruta protegida',
        user: req.user
    }
})

};

module.exports = dashboardController;
