import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const [count,setCount] = useState(3);
    const navigate = useNavigate();

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCount(prev=>prev-1);
        },1000);

        const timeout = setTimeout(()=>{
            navigate('/')
        },3000);

        return()=>{
            clearInterval(interval);
            clearTimeout(timeout);
        };
    },[]);

    return(<>
    <main className="notFound">
        <div className="container d-flex justify-content-center align-items-center">
            <div className="wrap d-flex justify-content-center align-items-center">
                <div>
                    <h2 className="mb-3 fs-1">Oops!!</h2>
                    <h2 className="mb-3">此頁面不存在~我送你回家~</h2>
                    <div className="text-center">
                        <span className="count text-brand-500">{count}</span>
                    </div>
                </div>
            </div>
        </div>
    </main>
    </>)
};

export default NotFound;