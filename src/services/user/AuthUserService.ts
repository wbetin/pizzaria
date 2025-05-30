import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthUserRequest {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthUserRequest) {
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new Error("Email/Password incorrect");
        }

        // preciso verificar se a senha está correta
        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new Error("Email/Password incorrect");
        }

        //gerar um toke JWT e devolver os dados do usuário, como id,name,email
        const token = sign({
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET, {
            subject: user.id,
            expiresIn: "30d"
        })

        return { 
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
        };
    }
}

export { AuthUserService };