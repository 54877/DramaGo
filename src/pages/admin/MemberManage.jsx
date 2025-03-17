import axios from "axios";
import { useEffect, useState,  } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { changeLoadingState } from "../../redux/slice/loadingSlice";
import { pushMsg } from "../../redux/slice/toastSlice";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;


const MemberManage = () => {
    const token = Cookies.get(`token`);
    const config = {
        headers: {
            Authorization: `${token}`
        }
    }

    const [memberInfo,setMemberInfo] = useState([]);
    const dispatch = useDispatch();


    // 取得會員
    const getMembers = async() => {
        dispatch(changeLoadingState(true));
        try {
            const res = await axios.get(`${baseUrl}/api/${apiPath}/admin/articles`, config);
            setMemberInfo(res.data.articles);
        } catch (err) {
            console.log(err);
        } finally{
            dispatch(changeLoadingState(false));
        }
    };

    //修改會員
    const editMember = async (e, member) => {
        const { name, value } = e.target
        const updateData = {
            data: {
                ...member,
                [name]:name=== 'isPublic'? (value === 'true'):Number(value),
                content:member.author
            }
        }
        try {
            dispatch(changeLoadingState(true));
            const res = await axios.put(`${baseUrl}/api/${apiPath}/admin/article/${member.id}`, updateData, config);
            console.log(res.data);
            dispatch(pushMsg({
                text: '已修改會員狀態',
                status: 'success',
            }));
            getMembers();
        } catch (err) {
            console.log(err);
            
            const message = err.response.data;
            dispatch(pushMsg({
                text: message.join('、'),
                status: 'failed',
            }));
        } finally{
            dispatch(changeLoadingState(false));
        }
    };

    useEffect(()=>{
        getMembers();
    },[]);

    useEffect(()=>{
        console.log(memberInfo);
    },[memberInfo]);


    return(<>
    <div className="container py-10">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 my-4">會員管理</h1>
            </div>
            <table className="table table-hover table-brand-400 table-sm align-middle">
                <thead>
                    <tr>
                        <th className="d-none text-center d-lg-block">頭像</th>
                        <th className="text-center ">暱稱</th>
                        <th className="text-center ">信箱</th>
                        <th className="text-center ">權限</th>
                        <th className="text-center ">狀態</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        memberInfo.map(member=>
                            <tr key={member.id}>
                                <td className="text-center py-5">
                                    <img 
                                    src={member.image} 
                                    alt={member.author}
                                    width='50'
                                    height='50'
                                    className="rounded-circle object-fit-cover"
                                    style={{aspectRatio: '1 / 1'}}
                                    />
                                </td>
                                <td className="text-center py-5">{member.author}</td>
                                <td className="py-5 w-25">{member.email}</td>
                                <td className="text-center py-5">
                                    {/* 桌機版 */}
                                    <select className="form-select d-none d-lg-block" name="isAdmin" value={member.isAdmin ? '1' : '0'} onChange={(e) => editMember(e, member)}>
                                        <option value="1">管理員</option>
                                        <option value="0">會員</option>
                                    </select>
                                    {/* 手機版 */}
                                    <button onClick={(e) => editMember(e, member)} name="isAdmin" value='0' style={{ whiteSpace: `nowrap` }} type="button" className={`btn text-white d-lg-none ${member.isAdmin == 0 ? "d-none" : " btn-brand-800"}`}>管理員</button>

                                    <button onClick={(e) => editMember(e, member)} name="isAdmin" value='1' style={{ whiteSpace: `nowrap` }} type="button" className={`btn text-white d-lg-none ${member.isAdmin == 1 ? "d-none" : " btn-brand-400"}`}>會員</button>
                                </td>
                                
                                <td className="text-center py-5">
                                    {/* 桌機版 */}
                                    <select className="form-select d-none d-lg-block" name="isPublic" value={member.isPublic ? "true" : "false"} onChange={(e) => editMember(e, member)}>
                                        <option value="true">正常</option>
                                        <option value="false">封鎖</option>
                                    </select>
                                    {/* 手機版 */}
                                    <button onClick={(e) => editMember(e, member)} name="isPublic" value='false' style={{ whiteSpace: `nowrap` }} type="button" className={`btn text-white d-lg-none ${member.isPublic == 0 ? "d-none" : " btn-brand-400"}`}>正常</button>

                                    <button onClick={(e) => editMember(e, member)} name="isPublic" value='true' style={{ whiteSpace: `nowrap` }} type="button" className={`btn text-white d-lg-none ${member.isPublic == 1 ? "d-none" : " btn-brand-800"}`}>封鎖</button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

        </div>
    </>)
};

export default MemberManage;