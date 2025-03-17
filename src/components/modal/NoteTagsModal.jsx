import { useState,useEffect } from "react";
import axios from "axios";
import { pushMsg } from "../../redux/slice/toastSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;

const NoteTagsModal = ({noteModalRef,closeNoteModal,setIsOpenNoteModal,selectedNoteTag,setSelectedNoteTag}) => {
    const dispatch = useDispatch();
    const token = Cookies.get(`token`)
    const config = {
        headers : {
            Authorization : `${token}`
        }
        }
    const [noteTags,setNoteTags] = useState([]);
    const handleCheckbox = (tag) => {
        setSelectedNoteTag(prev=>{
            if (prev.includes(tag)) {
                return prev.filter(t=>t!==tag)
            }else{
                return [...prev,tag]
            }
        });
    };

    const handleSubmit = () => {
        setIsOpenNoteModal(false);
        closeNoteModal();        
    };

    const getTags = async() => {
        try {
            const res = await axios.get(`${baseUrl}/api/${apiPath}/admin/coupons` , config);
            setNoteTags(res.data.coupons);
        } catch (err) {
            const message = err.response.data;
            if(Array.isArray(message)){
                dispatch(pushMsg({
                    text:message.join('、'),
                    status:'failed',
                }));
            }
            console.log(err)
        }
    };

    useEffect(()=>{
        const getToken = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
        axios.defaults.headers.common['Authorization'] = getToken;
    },[]);

    
    useEffect(()=>{
        if (token) {
            getTags();

        }
    },[]);



    return(<>
    <div className="modal" tabIndex="-1" ref={noteModalRef}>
        <div className="modal-dialog modal-md">
            <div className="modal-content">
            <div className="modal-header bg-brand-600 text-white">
                <h5 className="modal-title">劇會標籤</h5>
                <button
                type="button"
                className="btn-close btn-close-white"
                onClick={closeNoteModal}
                ></button>
            </div>
            <div className="modal-body">
                {   
                    noteTags&&
                    noteTags?.map(tag=>
                        <a role="button" className="my-1 mx-1" key={tag.id}>
                            <input
                            type="checkbox"
                            className="btn-check"
                            name="note"
                            id={`noteTag-${tag.id}`}
                            onChange={()=>handleCheckbox(tag.title)}
                            checked={selectedNoteTag.includes(tag.title)}
                            />

                            <label
                            className={`brandBtn-2-sm ${selectedNoteTag.includes(tag.title)&&'active'}`}
                            htmlFor={`noteTag-${tag.id}`}
                            style={{cursor:'pointer'}}
                            >
                                {tag.title}
                            </label>
                        </a>
                    )
                }
            </div>
            <div className="modal-footer">
                <button
                type="button"
                className="brandBtn-1 w-100"
                onClick={handleSubmit}
                >挑好了</button>
            </div>
            </div>
        </div>
    </div>
    </>);
};

export default NoteTagsModal;