import React, {useState} from 'react';
import AuthPage from "./components/AuthPage/AuthPage.tsx";
import styles from './styles.module.scss';
import TwoFactorPage from "./components/TwoFactorPage/TwoFactorPage.tsx";

const App: React.FC = () => {
    const [isAuthComplete, setIsAuthComplete] = useState(false);
    const [user, setUser] = useState('');
    const handleAuthComplete = (val: boolean, email: string = '') => {
        setIsAuthComplete(val);
        setUser(email);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles['form-container']}>
                {!isAuthComplete ?  <AuthPage onAuthComplete={handleAuthComplete} /> : <TwoFactorPage onAuthCancel={handleAuthComplete} user={user}/>}
            </div>
        </div>
    )
};

export default App;