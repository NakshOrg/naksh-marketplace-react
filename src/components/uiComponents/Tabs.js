import React, { useState } from 'react';
import { motion } from 'framer-motion';
import uuid from 'react-uuid';

import classes from '../../pages/browse/browse.module.css';
import globalStyles from '../../globalStyles';

function Tabs({ tabContents, currentTab, setCurrentTab }) {

    const [activeTab, setActiveTab] = useState(tabContents[0]);

    function renderActiveClassName (type) {
        if (type === activeTab.tabName) return classes.activeTab;
        return classes.inActiveTab;
    }

    function active(item) {
        setCurrentTab(item);
        setActiveTab(item);
    }

    return (
        <div>
            <div style={{...globalStyles.flexCenter, position:"relative", display:"grid"}}>
                <div style={{...globalStyles.flexRow}}>
                    {
                        tabContents.map(item => {
                            return <div 
                                key={uuid()} 
                                className={renderActiveClassName(item.tabName)} 
                                onClick={() => active(item)}
                            >
                                {item.tabName}
                            </div>
                        })
                    }
                </div>
                {/* bottom indicator */}
                <motion.div 
                    animate={{ x: activeTab.x }}
                    transition={{ duration: 0.5 }}
                    style={{
                        height:3, 
                        background:"#fff", 
                        width:8, 
                        borderRadius:100, 
                        marginTop:2
                    }}
                /> 
            </div>
        </div>
    );
}

export default Tabs;