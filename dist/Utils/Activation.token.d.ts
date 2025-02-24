import { IUser } from "../Interfaces/Models/IUser";
declare const createToken: (user: IUser) => {
    accessToken: string;
    refreshToken: string;
};
export default createToken;
