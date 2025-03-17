import { Link, Outlet, useLocation } from "react-router-dom";

//照片
import chart from "../../assets/images/icon/24px/line/pie_chart.svg"
import sell from "../../assets/images/icon/24px/line/sell_24dp.svg"
import theaters from "../../assets/images/icon/24px/line/theaters.svg"

const AdminHome = () => {
    const location = useLocation()
    
    return (<>
        <main className="container">
            <section className="row pt-6 pb-12">
                <div className="col-lg-3 ">
                    {/* 桌機版 */}
                    <ul className="d-none d-lg-block">
                        <li className={/^\/adminSystem\/?$/.test(location.pathname) ? "bg-brand-100 rounded-bottom rounded-5" : ""}>
                            <Link className="fs-b1 text-brand-950 fw-semibold d-flex justify-content-center align-items-center py-5"
                                to="./">
                                <img className="pe-3" src={theaters} alt="" />
                                劇會管理
                            </Link>
                        </li>
                        <li className= {location.pathname == "/adminSystem/member-manage" ? "bg-brand-100" : ""}>
                            <Link className="fs-b1 text-brand-950 fw-semibold d-flex justify-content-center align-items-center py-5"
                                to="./member-manage">
                                <i className="bi bi-people-fill pe-5 text-brand-core"></i>
                                會員管理
                            </Link>
                        </li>
                        <li className= {location.pathname == "/adminSystem/tag-manage" ? "bg-brand-100" : ""}>
                            <Link className="fs-b1 text-brand-950 fw-semibold d-flex justify-content-center align-items-center py-5"
                                to="./tag-manage">
                                <img className="pe-3" src={sell} alt="" />
                                標籤管理
                            </Link>
                        </li>
                        <li className={location.pathname == "/adminSystem/chart" ? "bg-brand-100" : ""}>
                            <Link className="fs-b1 text-brand-950 fw-semibold d-flex justify-content-center align-items-center  py-5"
                                to="./chart">
                                <img className="pe-3" src={chart} alt="" />
                                統計數據
                            </Link>
                        </li>
                    </ul>
                    {/* 手機版 */}
                    <ul className="d-lg-none d-flex justify-content-between">
                        <li className={/^\/adminSystem\/?$/.test(location.pathname) ? "bg-brand-100  rounded-4 px-3" : ""}>
                            <Link className="fs-b1 text-brand-950 fw-semibold d-flex justify-content-center align-items-center py-4"
                                to="./">
                                <img className="pe-3" src={theaters} alt="" />
                                劇會管理頁面
                            </Link>
                        </li>
                    </ul>

                    <ul className="d-lg-none d-flex justify-content-between">
                        <li className= {location.pathname == "/adminSystem/tag-manage" ? "bg-brand-100 rounded-4 px-5" : ""}>
                            <Link className="fs-b1 text-brand-950 fw-semibold d-flex justify-content-center align-items-center  py-4"
                                to="./member-manage">
                                <i className="bi bi-people-fill pe-5 text-brand-core"></i>
                                會員管理
                            </Link>
                        </li>
                        <li className= {location.pathname == "/adminSystem/tag-manage" ? "bg-brand-100 rounded-4 px-3" : ""}>
                            <Link className="fs-b1 text-brand-950 fw-semibold d-flex justify-content-center align-items-center py-4"
                                to="./tag-manage">
                                標籤管理
                            </Link>
                        </li>
                        <li className={location.pathname == "/adminSystem/chart" ? "bg-brand-100 rounded-4 px-5" : ""}>
                            <Link className="fs-b1 text-brand-950 fw-semibold d-flex justify-content-center align-items-center  py-4"
                                to="./chart">
                                統計數據
                            </Link>
                        </li>
                        <li className={/^\/adminSystem\/?$/.test(location.pathname) ? "bg-brand-100  rounded-4 px-5" : ""}>
                            <Link className="fs-b1 text-brand-950 fw-semibold d-flex justify-content-center align-items-center py-4"
                                to="./">
                                劇會管理頁面
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className=" col-lg-9">
                    <Outlet />
                </div>
            </section>
        </main>

    </>)
};

export default AdminHome;