// /src/Interfaces/IRepositories/IUserService.interface.ts

import { 
  UserRegisterDTO, 
  UserRegisterResponse, 
  VerifyOtpDTO, 
  VerifyOtpResponse, 
  ResendOtpDTO, 
  ResendOtpResponse, 
  UserLoginDTO, 
  UserLoginResponse, 
  BlockUnblockDTO, 
  BlockUnblockResponse,
  FetchStudentsResponse,
  GoogleAuthenticationRequestDTO,
  GoogleAuthenticationResponse
} from '../DTOs/IService.dto';

export interface IUserService {
  userRegister(userData: UserRegisterDTO): Promise<UserRegisterResponse>;

  googleAuthentication(data: GoogleAuthenticationRequestDTO): Promise<GoogleAuthenticationResponse>

  VerifyOtp(passedData: VerifyOtpDTO): Promise<VerifyOtpResponse>;

  ResendOTP(passedData: ResendOtpDTO): Promise<ResendOtpResponse>;

  userLogin(loginData: UserLoginDTO): Promise<UserLoginResponse>;

  blockUnblock(data: BlockUnblockDTO): Promise<BlockUnblockResponse>;

  fetchStudents(): Promise<FetchStudentsResponse>;
}
