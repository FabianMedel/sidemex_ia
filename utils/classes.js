module.exports = class Response{
	constructor(status,status_error,object,error,token){
		this.timestamp = (new Date()).toISOString();
		this.status = status;
		this.status_error = status_error;
		this.objects = object;
		this.token = token;
		//this.object_map = object_map;
		this.error_message = error;
	}
}

