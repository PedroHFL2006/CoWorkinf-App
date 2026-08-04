import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminSenha = process.env.ADMIN_SENHA;

    if (!adminEmail || !adminSenha) {
        console.log(
            "[seed] ADMIN_EMAIL / ADMIN_SENHA não definidos no .env — pulando criação do admin."
        );
        return;
    }

    const senhaHash = await bcrypt.hash(adminSenha, SALT_ROUNDS);

    const admin = await prisma.usuario.upsert({
        where: { email: adminEmail },
        update: { admin: true },
        create: {
            nome: "Administrador",
            email: adminEmail,
            senha: senhaHash,
            telefone: "00000000000",
            cpf: "00000000000",
            admin: true,
        },
    });

    console.log(`[seed] Conta admin pronta: ${admin.email} (id ${admin.id})`);
}

main()
    .catch((error) => {
        console.error("[seed] Erro ao criar admin:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });