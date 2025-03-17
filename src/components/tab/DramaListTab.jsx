import { useState } from "react";


const DramaListTab = ({tabName,setDramaState}) => {

    const [tabActive,setTabActive] = useState(tabName[0].name);
    

    return(<>
        <ul className="nav nav-enable">
            
            {
                tabName.map(tab=>
                    <li className="nav-item dramaListTab" key={tab.state}>
                        <a 
                        className={`nav-link ${tabActive===tab.name?'active':''}`} 
                        role="button" 
                        onClick={()=>{
                            setTabActive(tab.name);
                            setDramaState(tab.state);
                        }}
                        >{tab.name}</a>
                    </li>
                )
            }
        </ul>
    </>)
};

export default DramaListTab;