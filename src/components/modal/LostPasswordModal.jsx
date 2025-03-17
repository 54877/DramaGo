import { useRef, useState, useEffect,useId } from "react";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import PasswordReModal from "./PasswordReModal";
//照片
import Forgot from "../../assets/images/Forgot-password-cuate.png"

const LostPasswordModal = ({ mylostMadal, mymodal }) => {
    const [state, setState] = useState(false);
    const [disable, setdisable] = useState(false)
    const [time, setTime] = useState(false)
    const lostMadal = useRef(null);
    const randomNumRef = useRef(null)
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const timeIdRef = useRef(null)
    const mypasswordRef = useRef(null)
    const id = useId();

    //表單
    const onSubmit = () => {
        if (state == false) {
            setState(true);
            setdisable(true);
            randomNumRef.current = Math.ceil(Math.random() * (999999 - 100000 + 1) + 100000)
            timeIdRef.current = setTimeout(() => {
                setTime(true)
            }, 60000)
        } else if (state == true && watch('num') == randomNumRef.current && time == false) {
            mylostMadal.current.hide();
            mypasswordRef.current.show();
            setState(false);
            reset();
            setdisable(false);
            if (timeIdRef.current) {
                clearTimeout(timeIdRef.current);
                timeIdRef.current = null;
            }
        } else if (time == true) {
            alert(`驗證碼過期請重新確認信箱`)
            // clearTimeout(timeIdRef.current);
            // timeIdRef.current = null;
            setTime(false)
            setState(false);
            setdisable(false);
        } else {
            alert('驗證碼錯誤')
        }
    }

    // 初始化模態框
    useEffect(() => {
        mylostMadal.current = new Modal(lostMadal.current);
    }, []);

    //Login
    const LoginOpenMadal = () => {
        mylostMadal.current.hide();
        mymodal.current.show();
        setState(false);
        reset();
        setdisable(false);
    }

    return (
        <>
            {/* <!-- Modal --> */}
            <div className="modal fade" ref={lostMadal} id="Lost" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="Lost" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content bg-brand-50">
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
                                <img src={Forgot} alt="" />
                            </div>
                            <div className="col-lg-6 py-8 px-6 ps-lg-3">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h5 className="modal-title fs-1 mb-3">忘記密碼</h5>
                                    </div>
                                    <button type="button" className="btn-close me-3" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label htmlFor={`lostemail${id}`} className="form-label">Email</label>
                                        <input {...register("lostemail", {
                                            required: "請正確填寫email",
                                            validate: {
                                                email: value => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || "請輸入有效的email地址"
                                            }
                                        })}
                                            disabled={disable}
                                            autoComplete="email"
                                            name="lostemail"
                                            type="email"
                                            className="form-control"
                                            id={`lostemail${id}`}
                                            aria-describedby="emailHelp"
                                            placeholder="請輸入會員信箱" />
                                        {errors.lostemail && <span className="text-danger">{errors.lostemail.message}</span>}
                                    </div>
                                    {state &&
                                        <>
                                            <p className="mb-3">驗證碼 : {randomNumRef.current}</p>
                                            <div className="mb-3">
                                                <label htmlFor="num" className="form-label">請輸入驗證碼</label>
                                                <input
                                                    {...register('num')}
                                                    type="text"
                                                    name='num'
                                                    autoComplete="text"
                                                    className="form-control"
                                                    id="num"
                                                    aria-describedby="emailHelp"
                                                    placeholder="請輸入驗證碼" />
                                            </div>
                                        </>}
                                    <button type="submit" className="btn w-100 rounded-pill btn-brand-400 mb-4">確認</button>
                                </form>
                                <button className="btn w-100 rounded-pill btn-brand-400 mb-4" onClick={LoginOpenMadal}>返回登入</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <PasswordReModal mypasswordRef={mypasswordRef} mymodal={mymodal} />
        </>
    )
}


export default LostPasswordModal;