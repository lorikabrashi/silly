module.exports = {
    jwt : {
        adm : function (req, res, next) {
            next();
        },
        app: function(req, res, next) {
            next();
        }
    } 
}