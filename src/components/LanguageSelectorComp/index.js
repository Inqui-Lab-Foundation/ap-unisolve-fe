import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './style.scss';
import i18next from 'i18next';
import { FaGlobeAsia } from 'react-icons/fa';
import { languageOptions } from '../../constants/languageOptions';

const LanguageSelectorComp = () => {
    const [language, setLanguage] = useState('English');
    const handleSelector = (item) => {
        setLanguage(item.name);
        i18next.changeLanguage(item.code);
    };
    return (
        <DropdownButton
            id="language-selector-btn"
            title={
                <span>
                    <FaGlobeAsia /> {language}
                </span>
            }
        >
            {languageOptions.map((item, i) => {
                return (
                    <Dropdown.Item
                        key={i}
                        href="#/action-1"
                        onClick={() => handleSelector(item)}
                        label="English"
                    >
                        <span> {item.name}</span>
                    </Dropdown.Item>
                );
            })}
        </DropdownButton>
    );
};

export default LanguageSelectorComp;
