// TODO: 收藏日期排序功能

import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import Love from "../../components/modal/Love";
import { useOutletContext } from "react-router-dom";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;

import { useDispatch } from "react-redux";
import { changeLoadingState } from "../../redux/slice/loadingSlice";
import Loading from "../../components/Loading";

const ProfileCollection = () => {
  const dispatch = useDispatch();
  const [collection, setCollection] = useState([]);
  const { state, mymodal } = useOutletContext();

  const getCollection = async () => {
    try {
      dispatch(changeLoadingState(true));
      const res = await axios.get(`${baseUrl}/api/${apiPath}/cart`);
      console.log(res.data.data);
      setCollection(res.data.data.carts);
    } catch (error) {
      alert("取得收藏列表失敗");
    } finally {
      dispatch(changeLoadingState(false));
    }
  };

  useEffect(() => {
    getCollection();
  }, []);

  const refreshCollection = () => {
    console.log("refreshCollection 被呼叫");
    getCollection(); // 重新獲取最新資料
  };

  return (
    <>
      <div className="col-lg-8">
        <div className="my-collections">
          <div className="d-flex align-items-baseline justify-content-between">
            <h2 className="fs-md-1m fs-5 mb-8">我的收藏</h2>
            <button
              type="button"
              className="btn d-flex align-items-center fs-b3 text-grey-400"
            >
              收藏日期：最新到最舊
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="ms-2"
              >
                <title>sort_descending_line</title>
                <g id="sort_descending_line" fill="none">
                  <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z" />
                  <path
                    fill="#989898FF"
                    d="M18 4a1 1 0 0 1 1 1v12.414l1.121-1.121a1 1 0 0 1 1.415 1.414l-2.829 2.828a1 1 0 0 1-1.414 0l-2.828-2.828a1 1 0 1 1 1.414-1.414L17 17.414V5a1 1 0 0 1 1-1m-7 14a1 1 0 0 1 .117 1.993L11 20H4a1 1 0 0 1-.117-1.993L4 18zm2-7a1 1 0 0 1 .117 1.993L13 13H4a1 1 0 0 1-.117-1.993L4 11zm0-7a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                </g>
              </svg>
            </button>
          </div>
          <div className="table-responsive">
            <table
              className={`table align-middle ${
                collection?.length > 0 ? "table-hover" : ""
              }`}
            >
              <thead>
                <tr>
                  <th>劇會日期 / 名稱</th>
                  <th>主辦地點</th>
                  <th>劇會狀態</th>
                  <th>檢視</th>
                  <th>分享</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {collection?.length > 0 ? (
                  collection?.map((collectionItem) => (
                    <tr key={collectionItem.id}>
                      <th scope="row">
                        <small className="date">
                          {collectionItem.product.date.start.split("T")[0]}
                        </small>
                        <small className="date"> ~ </small>
                        <small className="date">
                          {collectionItem.product.date.end.split("T")[0]}
                        </small>
                        <p>{collectionItem.product.title}</p>
                      </th>
                      <td>{collectionItem.product.location}</td>
                      <td>
                        {collectionItem.product.isFinish ? "已出團" : "未出團"}
                      </td>
                      <td>
                        <a href="#">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <title>eye_2_fill</title>
                            <g id="eye_2_fill" fill="none">
                              <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z" />
                              <path
                                fill="#FF8A20FF"
                                d="M12 5c3.679 0 8.162 2.417 9.73 5.901.146.328.27.71.27 1.099 0 .388-.123.771-.27 1.099C20.161 16.583 15.678 19 12 19c-3.679 0-8.162-2.417-9.73-5.901C2.124 12.77 2 12.389 2 12c0-.388.123-.771.27-1.099C3.839 7.417 8.322 5 12 5m0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4"
                              />
                            </g>
                          </svg>
                        </a>
                      </td>
                      <td>
                        <a href="#">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <title>share_forward_fill</title>
                            <g id="share_forward_fill" fill="none">
                              <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z" />
                              <path
                                fill="#FF8A20FF"
                                d="m10.114 4.491-.203 3.144-.02.417-.09.01C5.363 8.582 2 12.366 2 17c0 .457.034.91.102 1.357.279 1.845.489 2.024 1.772.498a8.953 8.953 0 0 1 1.04-1.03 7.958 7.958 0 0 1 4.754-1.818l.226-.005.061 1.229.166 2.345c.08.804.926 1.353 1.704.914.352-.198.695-.41 1.04-.62 1.787-1.118 3.46-2.403 5.09-3.738.96-.8 1.8-1.558 2.516-2.248.33-.323.66-.646.979-.98.462-.484.508-1.285.024-1.792-1.114-1.165-2.688-2.624-4.647-4.172-1.588-1.242-3.23-2.402-4.97-3.421-.837-.477-1.667.177-1.743.972"
                              />
                            </g>
                          </svg>
                        </a>
                      </td>
                      <td>
                        <Love
                          id={collectionItem.product.id}
                          state={state}
                          mymodal={mymodal}
                          onClick={refreshCollection}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr style={{ height: "300px" }}>
                    <td colSpan="6" className="text-center border-bottom-0">
                      <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{ height: "100%" }}
                      >
                        <p className="fs-3 mb-4">目前尚無收藏劇會</p>
                        <NavLink className="nav-link" to="/dramaList">
                          <p className="fs-5 text-brand-400 d-flex align-items-center justify-content-center">
                            探索更多劇會活動
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              className="ms-1"
                            >
                              <title>search_line</title>
                              <g
                                id="search_line"
                                fill="none"
                                fill-rule="evenodd"
                              >
                                <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z" />
                                <path
                                  fill="#FFA13CFF"
                                  d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0"
                                />
                              </g>
                            </svg>
                          </p>
                        </NavLink>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Loading />
    </>
  );
};

export default ProfileCollection;
