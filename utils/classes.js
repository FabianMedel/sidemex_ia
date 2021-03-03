class Response{
	constructor({status,error,object,object_map}){
		this.timestamp = (new Date()).toISOString();
		this.status_code = status;
		this.objects = object;
		this.object_map = object_map;
		this.error_message = error;
	}
}

/*----------------------------------------*/

extended_codes = {
	520: "Web Server Returned an Unknown Error",
}

/*----------------------------------------*/


exports.ResCode = function(code,object = undefined, object_map = undefined, err = inn.modules.api.http.STATUS_CODES[code] || extended_codes[code], params = {status:code,error: err }){
	return ( err ?
		(parseInt(code) == 200 ? new Response({...params,...{object,object_map}}) : new Response(params))
		 :  this.ResCode(520) )
}
