import { useEffect } from "react";

const Pagination = ({pages,setPageNum}) => {

    return(<>
        <nav aria-label="Page navigation">
            <ul className="pagination">
                <li className="page-item">
                <a 
                className={`page-link ${!pages.has_pre?'disabled':''}`}
                role="button" 
                aria-label="Previous"
                onClick={()=>setPageNum(prev=>prev-1)}
                >
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                {
                    Array.from({length:pages.total_pages}).map((_,index)=>
                        <li 
                        className={`page-item ${pages.current_page===index+1?'active':''}`} 
                        key={index}
                        onClick={()=>setPageNum(index+1)}
                        >
                            <a className="page-link" role="button">{index+1}
                            </a>
                        </li>
                    )
                }
                <li className="page-item">
                <a 
                className={`page-link ${!pages.has_next?'disabled':''}`}
                role="button" 
                aria-label="Next"
                onClick={()=>setPageNum(prev=>prev+1)}
                >
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
        </nav>
    </>)
};

export default Pagination;