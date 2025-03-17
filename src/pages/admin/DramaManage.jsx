import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Modal } from "bootstrap";
import DramaFormModal from "../../components/modal/DramaFormModal";
import { useDispatch } from "react-redux";
import { changeLoadingState } from "../../redux/slice/loadingSlice";
import { pushMsg } from "../../redux/slice/toastSlice";
import Cookies from "js-cookie";
import Pagination from "../../components/Pagination";


const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;


const DramaManage = () => {

    const [dramas, setDramas] = useState([]);
    const [pages,setPages] = useState({});
    const [pageNum,setPageNum] = useState(1);
    const dramaFormRef = useRef(null);
    const dramaFormInstance = useRef(null);
    const openButtonRef = useRef(null);
    const [modalMode, setModalMode] = useState('');
    const [unitDrama, setUnitDrama] = useState({});
    const dispatch = useDispatch();

    const openDramaForm = () => {
        dramaFormInstance.current.show();
    };

    const closeDramaForm = () => {
        dramaFormInstance.current.hide();
    };

    //取得
    const getDramas = async () => {
        dispatch(changeLoadingState(true));
        try {
            const token = Cookies.get(`token`);
            const config = {
                headers: {
                    Authorization: `${token}`
                }
            }
            const res = await axios.get(`${baseUrl}/api/${apiPath}/admin/products?page=${pageNum}`, config);
            setDramas(res.data.products);
            setPages(res.data.pagination);
        } catch (err) {
            let message = err.response.data;
            message = Array.isArray(message) ? message : [message]
            dispatch(pushMsg({
                text: message.join('、'),
                status: 'failed',
            }));
            console.log(err)
        } finally {
            dispatch(changeLoadingState(false));
        };
    };

    //修改劇會
    const editDrama = async (e, drama) => {
        const { name, value } = e.target

        const updateData = {
            data: {
                ...drama,
                [name]: Number(value),
            }
        }
        dispatch(changeLoadingState(true));
        try {
            const token = Cookies.get(`token`);
            const config = {
                headers: {
                    Authorization: `${token}`
                }
            }
            await axios.put(`${baseUrl}/api/${apiPath}/admin/product/${drama.id}`, updateData, config);
            dispatch(pushMsg({
                text: '已修改劇會狀態',
                status: 'success',
            }));
            getDramas();

            closeDramaForm();

        } catch (err) {
            const message = err.response.data;
            dispatch(pushMsg({

                text: message.join('、'),
                status: 'failed',

            }));
        } finally {
            dispatch(changeLoadingState(false));
        };
    };

    //刪除劇會
    const deleteDrama = async (id) => {
        dispatch(changeLoadingState(true));
        try {
            const token = Cookies.get(`token`);
            const config = {
                headers: {
                    Authorization: `${token}`
                }
            }
            await axios.delete(`${baseUrl}/api/${apiPath}/admin/product/${id}`, config);
            dispatch(pushMsg({
                text: '已刪除劇會',
                status: 'success',
            }));
            getDramas();
            closeDramaForm();
        } catch (err) {
            const message = err.response.data;
            dispatch(pushMsg({
                text: message.join('、'),
                status: 'failed',
            }));
        } finally {
            dispatch(changeLoadingState(false));
        };
    };

    //初始化modal
    useEffect(() => {
        if (dramaFormRef.current) {
            dramaFormInstance.current = new Modal(dramaFormRef.current);
        };
        const handleModalHidden = () => {
            if (openButtonRef.current) {
                openButtonRef.current.focus();
            }
        };
        dramaFormRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
    }, []);

    useEffect(()=>{
        getDramas();
    },[pageNum]);


    return (<>
        <div className="container py-10">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 my-4">劇會管理</h1>
                <Pagination pages={pages} setPageNum={setPageNum}/>
            </div>
            <table className="table table-hover table-brand-400 table-sm align-middle">
                <thead>
                    <tr>
                        <th className="d-none text-center d-lg-block">主圖</th>
                        <th className="text-center ">名稱</th>
                        <th className="text-center ">發佈</th>
                        <th className="text-center ">熱門</th>
                        <th className="text-center ">狀態</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dramas.map(drama =>
                            <tr key={drama.id}>
                                <td className="d-none d-lg-block" style={{ width: '150px', height: '100px' }}>
                                    <img src={drama.imageUrl} alt={drama.title} className="object-fit" />
                                </td>
                                <td>{drama.title}</td>
                                <td>
                                    <select className="form-select d-none d-lg-block" name="is_enabled" value={drama.is_enabled ? '1' : '0'} onChange={(e) => editDrama(e, drama)}>
                                        <option value="1">顯示</option>
                                        <option value="0">隱藏</option>
                                    </select>
                                    <button onClick={(e) => editDrama(e, drama)} name="is_enabled" value='0' style={{ whiteSpace: `nowrap` }} type="button" className={drama.is_enabled == 0 ? "btn btn-brand-400 text-white d-lg-none d-none" : "btn btn-brand-400 d-lg-none text-white"}>顯示</button>
                                    <button onClick={(e) => editDrama(e, drama)} name="is_enabled" value='1' style={{ whiteSpace: `nowrap` }} type="button" className={drama.is_enabled == 1 ? "btn btn-brand-400 text-white d-lg-none d-none" : "btn btn-brand-400 d-lg-none text-white"}>隱藏</button>
                                </td>
                                <td>
                                    <select className="form-select d-none d-lg-block" name="isHot" value={drama.isHot ? '1' : '0'} onChange={(e) => editDrama(e, drama)}>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                    <button onClick={(e) => editDrama(e, drama)} name="isHot" value='0' style={{ whiteSpace: `nowrap` }} type="button" className={drama.isHot == 0 ? "btn btn-brand-400 text-white d-lg-none d-none" : "btn btn-brand-400 d-lg-none text-white"}>是</button>
                                    <button onClick={(e) => editDrama(e, drama)} name="isHot" value='1' style={{ whiteSpace: `nowrap` }} type="button" className={drama.isHot == 1 ? "btn btn-brand-400 text-white d-lg-none d-none" : "btn btn-brand-400 d-lg-none text-white"}>否</button>
                                </td>
                                <td>
                                    <select className="form-select d-none d-lg-block" name="isFinish" value={drama.isFinish ? '1' : '0'} onChange={(e) => editDrama(e, drama)}>
                                        <option value="1">已出團</option>
                                        <option value="0">未出團</option>
                                    </select>
                                    <button onClick={(e) => editDrama(e, drama)} name="isFinish" value='0' style={{ whiteSpace: `nowrap` }} type="button" className={drama.isFinish == 0 ? "btn btn-brand-400 text-white d-lg-none d-none" : "btn btn-brand-400 d-lg-none text-white"}>已出團</button>
                                    <button onClick={(e) => editDrama(e, drama)} name="isFinish" value='1' style={{ whiteSpace: `nowrap` }} type="button" className={drama.isFinish == 1 ? "btn btn-brand-400 text-white d-lg-none d-none" : "btn btn-brand-400 d-lg-none text-white"}>未出團</button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-brand-800 text-white mx-1 mb-2 mb-lg-0"
                                        onClick={() => {
                                            setUnitDrama(drama);
                                            setModalMode('edit');
                                            openDramaForm();
                                        }}
                                    >編輯</button>
                                    <button type="button" className="btn btn-outline-grey-600 text-grey-600 mx-1"
                                        onClick={() => {
                                            setUnitDrama(drama);
                                            setModalMode('delete');
                                            openDramaForm();
                                        }}
                                    >刪除</button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            {/* Modal */}
            <DramaFormModal
                dramaFormRef={dramaFormRef}
                closeDramaForm={closeDramaForm}
                deleteDrama={deleteDrama}
                modalMode={modalMode}
                unitDrama={unitDrama}
                getDramas={getDramas}
            />

        </div>
    </>)
};


export default DramaManage;