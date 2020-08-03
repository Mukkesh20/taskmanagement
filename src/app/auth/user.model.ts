export class User{

    constructor(
        public username: string,
        public password: string,
        private access_token: string,
        private expires_in: number

    ){}

    get token(){
        if(!this.expires_in || new Date().getTime() > this.expires_in){
            return null
        }
        else{
            return this.access_token;
        }
    }
}
