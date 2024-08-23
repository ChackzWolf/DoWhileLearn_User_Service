
export interface IUserService {

    userRegister(userData:{
        firstName:string;
        lastName:string;
        email:string;
        password:string;
    }):{ 
        success: boolean, 
        message: string, 
        tempId?: string, 
        email?: string }
}