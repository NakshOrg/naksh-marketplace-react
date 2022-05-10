import React from 'react';
import { useHistory } from 'react-router-dom';

import discord from "../../assets/svgs/discord.svg";
import instagram from "../../assets/svgs/instagram.svg";
import linkedIn from "../../assets/svgs/linkedIn.svg"; 
import telegram from "../../assets/svgs/telegram.svg";
import twitter from "../../assets/svgs/twitter.svg";
import logo from '../../assets/svgs/logowithcaption.svg'
import configs from '../../configs';
import { helpers } from '../../constants';
import globalStyles from '../../globalStyles';
import "./uiComponents.css";

function Footer() {

    const history = useHistory();

    const textStyle = {
        padding: "0 15px 0 15px",
        borderRight: "solid rgb(255 255 255 / 27%)",
        fontSize: "14px"
    }

    const subTextStyle = {
        fontWeight:100, 
        fontSize:16, 
        marginBottom:10,
        cursor:"pointer"
    }
    

    return (
        <div className='footer' style={{backgroundColor:"transparent"}}>
            <div style={{padding:"30px 0", ...globalStyles.flexRowSpace}}>
                <div>
                    <img style={{marginBottom:25}} src={logo} alt="logo"/>
                    <div className="icons-container" style={{...globalStyles.flexRow}}>
                        <div style={{marginRight:18}} onClick={() => helpers.openInNewTab(configs.discord)}><img style={{height:15}} src={discord} alt='discord'/></div>
                        <div style={{marginRight:18}} onClick={() => helpers.openInNewTab(configs.instagram)}><img style={{height:15}} src={instagram} alt='instagram'/></div>
                        <div style={{marginRight:18}} onClick={() => helpers.openInNewTab(configs.twitter)}><img style={{height:15}} src={twitter} alt='twitter'/></div>
                        <div style={{marginRight:18}} onClick={() => helpers.openInNewTab(configs.linkedin)}><img style={{height:15}} src={linkedIn} alt='linkedIn'/></div>
                        <div style={{marginRight:18}} onClick={() => helpers.openInNewTab(configs.telegram)}><img style={{height:15}} src={telegram} alt='telegram'/></div>
                    </div>
                </div>
                <div style={{...globalStyles.flexRowSpace, alignItems:"flex-start"}}>
                    <div>
                        <div style={{fontFamily:"AthelasBold", fontSize:25, marginBottom:5}}>Marketplace</div>
                        <div onClick={() => history.push("/browse")} style={subTextStyle}>Browse</div>
                        <div onClick={() => history.push("/ourartists")} style={subTextStyle}>Our artists</div>
                        <div onClick={() => history.push("/nearprotocol")} style={subTextStyle}>Near Protocol</div>
                    </div>
                    <div style={{margin:"0 100px"}}>
                        <div style={{fontFamily:"AthelasBold", fontSize:25, marginBottom:5}}>Resources</div>
                        <div onClick={() => history.push("/helpcenter")} style={subTextStyle}>Help center</div>
                        <div onClick={() => history.push("/blogs")} style={subTextStyle}>Blogs</div>
                        <div onClick={() => history.push("/helpcenter")} style={subTextStyle}>Write to us</div>
                        <div onClick={() => history.push("/aboutnaksh")} style={subTextStyle}>About Naksh</div>
                    </div>
                </div>
            </div>
            <div style={{height:1, background:"#fff", opacity:0.27}}></div>
            <div style={{padding:"25px 0", ...globalStyles.flexRowSpace}}>
                <div style={{fontSize:14}}>©2021 naksh.org. All right reserved.</div>
                <div style={{...globalStyles.flexRowSpace}}>
                    <div style={textStyle}>Terms</div>
                    <div style={textStyle}>Privacy policy</div>
                    <div style={{paddingLeft:15, fontSize:14}}>Community guidelines</div>
                </div>
            </div>
        </div>
    );

}

export default Footer;
