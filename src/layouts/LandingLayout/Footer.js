import React from 'react';
import { useTranslate } from "react-translate";

function Footer() {
    const lang = localStorage.getItem("lang") ?  localStorage.getItem("lang") : "de";
    let t = useTranslate("Footer");
    return(
        <footer className="footer">
            <div className="wrapper">
                <span>{t(`footerSpan-${lang}`)}</span>
                <a href="https://www.agile-automation.at/agilom-oberoesterreich/">{t(`footerP-${lang}`)}</a>.
            </div>
        </footer>
    )
}

export default Footer;