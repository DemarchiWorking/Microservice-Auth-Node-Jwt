import bcrypt from "bcrypt";

import UserRepository from "../repository/UserRepository.js";
import UserException from "../exception/UserException.js";
import jwt from "jsonwebtoken";

import * as httpStatus from "../../../config/constants/httpStatus.js";
import * as secret from "../../../config/constants/secrets.js";

class UserService{
    async findByEmail(req){
        try{
            const { email } = req.params;
            const { authUser } = req;
            this.validateRequestDate(email);
            let user = await UserRepository.findByEmail(email);
            this.validateUserNotFound(user);
            this.validateAuthenticatedUser(user, authUser);

            return {
                status: httpStatus.SUCCESS,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            };
        }catch (err){
            return {
                status: err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: err.message
            }
        }
    }

    validateRequestDate(email){
        if(!email){
            throw new UserException(
                httpStatus.BAD_REQUEST,
                "User email was not informed."
                );
        }
    }

    validateUserNotFound(user){
        if(!user){
            throw new UserException(
                httpStatus.BAD_REQUEST,
                "User was not informed."
                );
        }
    }

    validateAuthenticatedUser(user, authUser){
        if(!authUser || user.id !== authUser.id){
            throw new UserException(
                httpStatus.FORBIDDEN,
                "You cannot see this user data."
            );
        }
    }
    
    async getAccessToken(req){
        try {            
            const {email, password} = req.body;            
            this.validateAccessTokenData(email, password);            
            let user = await UserRepository.findByEmail(email);       
            this.validateUserNotFound(user); // demarchialteracao: erro1
            
            await this.validatePassword(password, user.password);
            
            console.log("TESTAAAAAAAAAAAAAAAAAA321312")
            
            

            const authUser = {id: user.id, name: user.name, email: user.email }
            const accessToken = jwt.sign({authUser}, secret.API_SECRET ,{
                expiresIn: '1d'
            });

            
            return {
                status: httpStatus.SUCCESS,
                accessToken,
            }
        }catch(err){
            return{
                status: err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: err.toString()
            }
        }
        
    }

    validateAccessTokenData(email, password){
        if(!email || !password){
            throw new UserException(httpStatus.UNAUTHORIZED, 
            "Email and password must be informed."
            );
        }
    }

    async validatePassword(password, hashPassword){
        
        if(!(await bcrypt.compare(password, hashPassword))) {
            throw new UserException(
                httpStatus.UNAUTHORIZED,
                "Password doesn't match.")
        }
    }
}

export default new UserService();
