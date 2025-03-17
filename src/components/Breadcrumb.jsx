import { Link } from "react-router-dom";

const Breadcrumb = ({pageLink}) => {

    return(<>
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {
                    pageLink&&
                    pageLink.map((page,index)=>
                        <li 
                        key={page.name}
                        className={`breadcrumb-item ${pageLink.length === (index+1)?'active':''}`}>
                            {pageLink.length === (index+1)?(page.name):(<Link to={page.link}>{page.name}</Link>)}
                        </li>
                    )
                }
            </ol>
        </nav>
    </>)
};

export default Breadcrumb;