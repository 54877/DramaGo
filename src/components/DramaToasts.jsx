import { useEffect, useRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import { Toast } from "bootstrap";
import { removeMsg } from "../redux/slice/toastSlice";




const DramaToasts =  () => {

    const toastRefs = useRef({});
    const messages = useSelector(state=>state.toastStore.messages);
    const dispatch = useDispatch();

    useEffect(()=>{
        messages.forEach(message => {
            const toastEl = toastRefs.current[message.id];
            if (toastEl) {
                const toastInstance= new Toast(toastEl);
                toastInstance.show();
            }

            setTimeout(()=>{    
                dispatch(removeMsg(message.id));
            },2000);
        });

    },[messages]);

    return(<>
    <div className="position-fixed top-0 end-0 p-3" style={{zIndex:'15000'}}>
        {
            messages.map(message=>
                <div 
                className="toast"
                role="alert" 
                aria-live="assertive" 
                aria-atomic="true" 
                ref={(el)=>toastRefs.current[message.id]=el}
                key={message.id}
                >
                    <div className={`toast-header ${message.status==='success'?'bg-success':'bg-danger'}`}>
                        <strong className="me-auto text-white">{message.status==='success'?'成功':'失敗'}</strong>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">
                        {message.text}
                    </div>
                </div>
            )
        }
        
    </div>
    </>)
};

export default DramaToasts;