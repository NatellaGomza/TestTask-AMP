import React, {useState} from 'react';
import styles from '../styles.module.scss';
import logoSvg from '../../../assets/logo.svg';
import {Button, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

interface LoginFormValues {
    email: string;
    password: string;
}

type AuthPageProps = {
    onAuthComplete: (val: boolean, email: string) => void;
};

const AuthPage: React.FC<AuthPageProps> = ({onAuthComplete}) => {
    const [form] = Form.useForm<LoginFormValues>();
    const [isValid, setIsValid] = useState(false);

    const onFinish = async (values: LoginFormValues) => {
        try {
            const res = await fetch('/api/authorization/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values),
            });

            const result = await res.json();

            if (result.code !== 0) {
                form.setFields([
                    {
                        name: 'password',
                        errors: [result.message],
                    },
                ]);
                console.log('Вход выполнен:', result.data);
                return;
            } else {
                console.error('Ошибка запроса:', result.message);
            }

            onAuthComplete(true, values.email);
        } catch (error) {
            console.error('Ошибка запроса:', error);
            form.setFields([
                {
                    name: 'email',
                    errors: ['Сервер недоступен'],
                },
            ]);
        }
    }

    const handleFieldsChange = () => {
        const hasErrors = form.getFieldsError().some(({errors}) => errors.length > 0);
        const allTouched = form.isFieldsTouched(true);
        const allFilled = form.getFieldsValue(['email', 'password']);
        const isFilled = Object.values(allFilled).every((val) => val);

        setIsValid(!hasErrors && allTouched && isFilled);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles['auth-form']}>
                <div className={styles['auth-form__header']}>
                    <img className={styles['auth-form__company-logo']} src={logoSvg} alt={""}/>
                    <p className={styles['auth-form__title']}>Sign in to your account to continue</p>
                </div>
                <div className={styles['auth-form__content']}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        onFieldsChange={handleFieldsChange}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {required: true, message: 'Enter email'},
                                {type: 'email', message: 'Enter valid email'},
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined/>}
                                placeholder="Email"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {required: true, message: 'Enter password'},
                                {min: 6, message: 'Password length should be more then 6 digits'},
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                prefix={<LockOutlined/>}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block disabled={!isValid}>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
};

export default AuthPage;