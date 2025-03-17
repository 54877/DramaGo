import { useState,useCallback} from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const Dropdown = ({options,filterDramas,setDramas}) => {

    const [activeOption,setActiveOption] = useState(options?.[0]);

    const handleSortClick =useCallback((option) => {
        setActiveOption(option);
        const newArr = [...filterDramas];
        if (option==='最新>最舊') {
            newArr?.sort((a,b)=>
            dayjs(b.buildDate,"YYYY/MM/DD hh:mm A").valueOf()-
            dayjs(a.buildDate,"YYYY/MM/DD hh:mm A").valueOf()
            );
        }else if (option==='最舊>最新') {
            newArr?.sort((a,b)=>
            dayjs(a.buildDate,"YYYY/MM/DD hh:mm A").valueOf()-
            dayjs(b.buildDate,"YYYY/MM/DD hh:mm A").valueOf()
            );
        }
        setDramas(newArr);
    },[filterDramas,setDramas]) 


    return(<>
        <div className="dropdown mx-1">
            <button className="btn btn-outline-brand-300 rounded-pill d-flex justify-content-between text-grey-400 w-100" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                <span>{activeOption}</span>
                <span className="material-symbols-rounded">keyboard_arrow_down</span>
            </button>
            <ul className="dropdown-menu w-100">
                {
                    options&&
                    options.map(option=>
                        <li key={option}>
                            <a 
                            className={`dropdown-item ${activeOption===option?'active':''}`}
                            role="button"
                            onClick={()=>handleSortClick(option)}
                            >{option}</a>
                        </li>
                    )
                }
            </ul>
        </div>
    </>)
};


export default Dropdown;
