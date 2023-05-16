import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './style.scss';
import i18next from 'i18next';
import { FaGlobeAsia } from 'react-icons/fa';
import { languageOptions } from '../../constants/languageOptions';
import { useDispatch, useSelector } from 'react-redux';
import { getGlobalLanguage } from '../../redux/home/actions';

const LanguageSelectorComp = ({ module }) => {
    const dispatch = useDispatch();
    
   
    const globalLang = useSelector((state) => state?.home.globalLanguage);
    const [language, setLanguage] = useState(globalLang?.name);
    const localLang = JSON.parse(localStorage.getItem("s_language"));
    useEffect(() => {
        if(localLang){
            i18next.changeLanguage(localLang.code);
        }
    }, []);
    
    const handleSelector = (item) => {
        let forMentor;
        if (item && item.code !== "en") {
            forMentor = { ...item };
            forMentor.code = "en";
            forMentor.name = "English";
        }
        setLanguage(item.name);
        i18next.changeLanguage(item.code);
        if (module === 'general') {
            dispatch(getGlobalLanguage(item));
        }
    };
    return (
        <DropdownButton
            id="language-selector-btn"
            title={
                <span>
                    <FaGlobeAsia /> { (localLang && localLang.name) || language}
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
