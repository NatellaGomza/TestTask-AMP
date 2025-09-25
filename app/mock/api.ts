// mock/auth.ts
const mockUsers: { email: string; password: string; code: string }[] = [];

for (let i = 1; i <= 10; i++) {
    mockUsers.push({
        email: `user${i}@example.com`,
        password: `password${i}`,
        code: '',
    });
}

function randomDelay(min = 500, max = 2000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export default [
    {
        url: '/api/authorization/login',
        method: 'post',
        timeout: randomDelay(),
        response: ({ body }) => {
            const { email, password } = body;

            const user = mockUsers.find((u) => u.email === email);

            if (!user) {
                return { code: 1, message: 'Пользователь не найден' };
            }

            if (user.password !== password) {
                return { code: 2, message: 'Неверный пароль' };
            }

            user.code = generateCode();

            return {
                code: 0,
                message: 'Успешный вход',
                data: { email },
            };
        },
    },
    {
        url: '/api/authorization/verify',
        method: 'post',
        response: ({ body }) => {
            const { email, code } = body;

            const user = mockUsers.find((u) => u.email === email);

            if (!user) {
                return { code: 1, message: 'User not found' };
            }

            if (user.code !== code) {
                return { code: 2, message: 'Invalid code' };
            }

            return {
                code: 0,
                message: 'Код подтверждён',
                data: { email },
            };
        },
    },
    {
        url: '/api/authorization/resend',
        method: 'post',
        response: ({ body }) => {
            const { email } = body;

            const userExists = mockUsers.some((u) => u.email === email);
            if (!userExists) {
                return { code: 1, message: 'Пользователь не найден' };
            }

            const user = mockUsers.find((u) => u.email === email);
            user.code = generateCode();

            return {
                code: 0,
                message: 'Код отправлен повторно',
                data: { email },
            };
        },
    }
];
