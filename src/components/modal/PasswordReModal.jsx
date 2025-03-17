import { useRef, useEffect,useId } from "react";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
//照片
import Forgot from "../../assets/images/Forgot-password-cuate.png"

const PasswordReModal = ({ mymodal, mypasswordRef }) => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const passwordReModal = useRef(null);
    const id = useId();

    //表單
    const onSubmit = () => {
        if (watch('numNew') == watch('numOld'))
            alert(`不可與舊密碼相同`)
        else{
            login();
        }
    }
    //返回登入
    const login = ()=>{
        mypasswordRef.current.hide();
        mymodal.current.show();
        reset();
    }

    // 初始化模態框
    useEffect(() => {
        mypasswordRef.current = new Modal(passwordReModal.current);
    }, []);


    return (
        <>
            {/* <!-- Modal --> */}
            <div className="modal fade" ref={passwordReModal} id="Lost" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="Lost" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content bg-brand-50">
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
                                <img src={Forgot} alt="" />
                            </div>
                            <div className="col-lg-6 py-8 px-6 ps-lg-3">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h5 className="modal-title fs-1 mb-3">重設密碼</h5>
                                    </div>
                                    <button type="button" className="btn-close me-3" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label htmlFor={`PasswordRe${id}`} className="form-label">請輸入舊密碼</label>
                                        <input {...register("numOld", {
                                            required: "請填寫舊密碼",
                                        })}
                                            autoComplete="email"
                                            name="numOld"
                                            type="password"
                                            className="form-control"
                                            id={`PasswordRe${id}`}
                                            aria-describedby="emailHelp"
                                            placeholder="請輸入舊密碼" />
                                        {errors.numOld && <span className="text-danger">{errors.numOld.message}</span>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor={`PasswordNew${id}`} className="form-label">請輸入新密碼</label>
                                        <input
                                            {...register('numNew',  {
                                                required: "請填寫新密碼",
                                                minLength: { value: 8, message: "密碼最少8位數" },
                                                validate: {
                                                    containsUpperCase: value => /[A-Z]/.test(value) || '密碼必須包含至少一個大寫字母',
                                                    containsNumber: value => /[0-9]/.test(value) || '密碼必須包含至少一個數字',
                                                    smailCase: value => /[a-z]/.test(value) || '密碼必須包含至少一個小寫字母',
                                                }
                                            })}
                                        type="password"
                                        name='numNew'
                                        autoComplete="text"
                                        className="form-control"
                                        id={`PasswordNew${id}`}
                                        aria-describedby="emailHelp"
                                            placeholder="請輸入新密碼" />
                                        {errors.numNew && <span className="text-danger">{errors.numNew.message}</span>}
                                    </div>
                                    <ul className="fs-c text-grey-600 my-3">
                                        <li className="py-1" >密碼最少8位</li>
                                        <li className="py-1" >密碼必須包含大小寫字母</li>
                                        <li className="py-1" >密碼必須包含一個數字</li>
                                    </ul>
                                    <button type="submit" className="btn w-100 rounded-pill btn-brand-400 mb-4">確認</button>
                                </form>
                                <button className="btn w-100 rounded-pill btn-brand-400 mb-4" onClick={login}>返回登入</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}


export default PasswordReModal;