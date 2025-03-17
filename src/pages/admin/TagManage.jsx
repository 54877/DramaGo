import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeLoadingState } from "../../redux/slice/loadingSlice";
import { pushMsg } from "../../redux/slice/toastSlice";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";



const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;

const TagManage = () => {

    const [noteTags, setNoteTags] = useState([]);
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const dispatch = useDispatch();

    const onSubmit = () => {
        addTag(watch(`name`));
        reset();
    }

    //新增
    const addTag = async (input) => {
        const updateData = {
            data: {
                title: input,
                is_enabled: 1,
                percent: 0,
                due_date: 0,
                code: input,
            }
        };
        dispatch(changeLoadingState(true));
        try {
            const token = Cookies.get(`token`);
            const config = {
                headers: {
                    Authorization: `${token}`
                }
            }
            const res = await axios.post(`${baseUrl}/api/${apiPath}/admin/coupon`, updateData, config);
            dispatch(pushMsg({
                text: '已新增標籤',
                status: 'success',
            }));
            getTags();
        } catch (err) {
            let message = err.response.data;
            message = Array.isArray(message) ? message : [message]
            dispatch(pushMsg({
                text: message.join('、'),
                status: 'failed',
            }));
        } finally {
            dispatch(changeLoadingState(false));
        };
    };

    //取得標籤
    const getTags = async () => {
        dispatch(changeLoadingState(true));
        try {
            const token = Cookies.get(`token`);
            const config = {
                headers: {
                    Authorization: `${token}`
                }
            }
            const res = await axios.get(`${baseUrl}/api/${apiPath}/admin/coupons`, config);
            setNoteTags(res.data.coupons);
        } catch (err) {
            let message = err.response.data;
            message = Array.isArray(message) ? message : [message]
            dispatch(pushMsg({
                text: message.join('、'),
                status: 'failed',
            }));
        } finally {
            dispatch(changeLoadingState(false));
        };
    };

    //刪除標籤
    const deleteTags = async (id) => {
        dispatch(changeLoadingState(true));
        try {
            const token = Cookies.get(`token`);
            const config = {
                headers: {
                    Authorization: `${token}`
                }
            }
            await axios.delete(`${baseUrl}/api/${apiPath}/admin/coupon/${id}`, config);
            dispatch(pushMsg({
                text: '已刪除標籤',
                status: 'success',
            }));
            getTags();
        } catch (err) {
            let message = err.response.data;
            message = Array.isArray(message) ? message : [message]
            dispatch(pushMsg({
                text: message.join('、'),
                status: 'failed',
            }));
        } finally {
            dispatch(changeLoadingState(false));
        };
    }

    //初始化
    useEffect(() => {
        getTags();
    }, []);

    return (<>
        <div className="container py-10 pt-lg-0">
            <h1 className="h4 my-5 my-lg-6">劇會標籤庫</h1>


            <form className="mb-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group mb-3">
                    <div className="form-floating">
                        <input
                            {...register(`name`, {
                                required: "請填寫標籤"
                            })}
                            type="text"
                            className="form-control"
                            id="tagAdd"
                            placeholder="標籤名稱"
                        />
                        <label htmlFor="tagAdd" className="text-grey-400">輸入標籤名稱</label>
                    </div>
                    <button
                        className="btn btn-brand-core text-white"
                    >新增</button>
                </div>
                {errors.name && <span className="text-danger">{errors.name.message}</span>}
            </form>


            <div className="mb-10">
                {
                    noteTags?.map((tag) =>
                        <a
                            role="button"
                            className="my-1 mx-1 brandBtn-2-lg px-4 px-lg-5"
                            key={tag.id}
                            onClick={() => deleteTags(tag.id)}
                        >
                            {tag.title}
                            <i
                                className="bi bi-x-circle-fill ms-2"
                                style={{ cursor: 'pointer' }}
                            ></i>
                        </a>
                    )
                }
            </div>
        </div>
    </>)
};

export default TagManage;