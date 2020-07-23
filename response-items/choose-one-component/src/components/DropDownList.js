import React from "react";
import Select from 'react-select'

const DropDownList = ({ logOption, options, ...props }) => {
    
    const style = {
        color: props.textColor || "black",
        fontSize: props.fontSize || "1em",
        fontFamily: props.fontFamily || "Arial"
    }

    const styles = {
        placeholder: (provided, state) => ({ ...provided, ...style }),
        singleValue: (provided, state) => ({ ...provided, ...style }),
        option: (provided, state) => ({ ...provided, ...style }),
        container: (provided, state) => ({ ...provided, 
            width: props.width || "100%"
        })
    };

    return (
        <Select styles={styles} options={options} onChange={logOption} />
    )
};

export default DropDownList;