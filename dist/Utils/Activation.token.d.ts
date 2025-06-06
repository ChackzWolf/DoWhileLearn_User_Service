import { IUser } from "../Interfaces/Models/IUser";
import { IJWT } from "../Interfaces/IUtils/IJWT";
export declare class JWT implements IJWT {
    createToken(user: IUser): {
        accessToken: string;
        refreshToken: string;
    };
}
