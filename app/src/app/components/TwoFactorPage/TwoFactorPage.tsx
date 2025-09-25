import React, {useEffect, useState} from 'react';
import {Input, Button, Form} from 'antd';
import styles from '../styles.module.scss';
import logoSvg from "../../../assets/logo.svg";
import {ArrowLeftOutlined} from "@ant-design/icons";

type TwoFactorPageProps = {
    onAuthCancel: (val: boolean) => void;
    user: string,
};

const TwoFactorPage: React.FC<TwoFactorPageProps> = ({ onAuthCancel, user }) => {
    const [code, setCode] = useState<string>('');
    const [isCodeFilled, setIsCodeFilled] = useState(false);
    const [seconds, setSeconds] = useState(45);
    const [form] = Form.useForm();

    useEffect(() => {
        if (seconds === 0) return;

        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval); // очистка при размонтировании
    }, [seconds]);

    // Обработка отправки
    const handleSubmit = async () => {
        try {
            const res = await fetch('/api/authorization/verify', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: user, code}),
            });

            const result = await res.json();

            if (result.code === 0) {
                alert('Успешная авторизация');
                console.log('Успешная авторизация:', result.data.email);
                form.setFields([{ name: 'code', errors: [] }]);
            } else {
                form.setFields([{ name: 'code', errors: ['Invalid code'] }]);
            }

        } catch (error) {
            console.error('Ошибка запроса:', error);
            form.setFields([{ name: 'code', errors: ['Сервер недоступен'] }]);
        }
    };

    const handleResend = async () => {
        const res = await fetch('/api/authorization/resend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user }),
        });

        const result = await res.json();

        if (result.code === 0) {
            setSeconds(45);
            console.log(result.message );
        } else {
            console.log(result.message);
        }
    };


    return (
        <div className={styles.wrapper}>
            <div className={styles['auth-form']}>
                <div className={styles['auth-form__header']}>
                    <ArrowLeftOutlined onClick={() => onAuthCancel(false)}/>
                    <img className={styles['auth-form__company-logo']} src={logoSvg} alt={""}/>
                    <p className={styles['auth-form__title']}>Two-Factor Authentication</p>
                    <p className={styles['auth-form__text']}>Enter the 6-digit code from the Google Authenticator
                        app</p>
                </div>
                <div className={styles['auth-form__content']}>
                    <Form form={form}>
                        <Form.Item
                            name="code"
                        >
                            <Input.OTP
                                value={code}
                                onChange={(val: string) => {
                                    setCode(val);
                                    if (val.length === 6) {
                                        setIsCodeFilled(true);
                                    } else {
                                        setIsCodeFilled(false);
                                    }
                                }}
                                length={6}
                                type={"number"}
                                size={"large"}
                            />
                        </Form.Item>
                    </Form>

                    {!isCodeFilled ? (
                        <>
                            {seconds !== 0 ? (
                                <p className={styles['auth-form__timer']}>
                                    Get a new code in 00:{seconds.toString().padStart(2, '0')}
                                </p>
                            ) : (
                                <Button
                                    type="primary"
                                    block
                                    onClick={handleResend}
                                    className={styles['auth-form__btn']}
                                >
                                    Get new
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button
                            type="primary"
                            block
                            onClick={handleSubmit}
                            className={styles['auth-form__btn']}
                        >
                            Continue
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwoFactorPage;
