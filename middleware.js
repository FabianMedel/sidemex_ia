exports.splashResponse = async function(req,res,next){
	    res.locals.response = (res.locals.dataset.error) ?
		utils.class.ResCode(404) :
		utils.class.ResCode(200, res.locals.dataset[req.body.model], res.locals.dataset[`_${req.body.model}`]);
	next();
}