// TODO: 狀態跟類別排版

import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useDispatch } from "react-redux";
import Loading from "../../components/Loading";

import { useOutletContext } from "react-router-dom";

const records = [
  // {
  //   category: "甜甜圈",
  //   content: "尺寸：14x14cm",
  //   description:
  //     "濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！",
  //   id: "-L9tH8jxVb2Ka_DYPwng",
  //   is_enabled: 1,
  //   origin_price: 150,
  //   price: 99,
  //   title: "草莓莓果夾心圈",
  //   unit: "元",
  //   num: 10,
  //   imageUrl: "https://images.unsplash.com/photo-1583182332473-b31ba08929c8",
  //   imagesUrl: [
  //     "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a",
  //     "https://images.unsplash.com/photo-1559656914-a30970c1affd",
  //   ],
  // },
  // {
  //   category: "蛋糕",
  //   content: "尺寸：6寸",
  //   description:
  //     "蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！",
  //   id: "-McJ-VvcwfN1_Ye_NtVA",
  //   is_enabled: 1,
  //   origin_price: 1000,
  //   price: 900,
  //   title: "蜂蜜檸檬蛋糕",
  //   unit: "個",
  //   num: 1,
  //   imageUrl:
  //     "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
  //   imagesUrl: [
  //     "https://images.unsplash.com/photo-1618888007540-2bdead974bbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80",
  //   ],
  // },
  // {
  //   category: "蛋糕",
  //   content: "尺寸：6寸",
  //   description: "法式煎薄餅加上濃郁可可醬，呈現經典的美味及口感。",
  //   id: "-McJ-VyqaFlLzUMmpPpm",
  //   is_enabled: 1,
  //   origin_price: 700,
  //   price: 600,
  //   title: "暗黑千層",
  //   unit: "個",
  //   num: 15,
  //   imageUrl:
  //     "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  //   imagesUrl: [
  //     "https://images.unsplash.com/flagged/photo-1557234985-425e10c9d7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxjYWtlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  //     "https://images.unsplash.com/photo-1540337706094-da10342c93d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  //   ],
  // },
];

const ProfileRecord = () => {
  const dispatch = useDispatch();
  const [record, setRecords] = useState({ records });

  return (
    <>
      <div className="col-lg-8">
        <div className="my-records">
          <h2 className="fs-md-1m fs-5 mb-8">我的劇會記錄</h2>
          <div className="d-md-flex flex-md-row flex-column mb-8">
            <div className="d-flex align-items-center">
              <label className="fs-md-4 fs-6 me-3" for="party-status">
                揪團狀態
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                id="party-status"
              >
                <option value="1">全部</option>
                <option value="2" selected>
                  未出團
                </option>
                <option value="3">已出團</option>
                <option value="4">取消出團</option>
              </select>
            </div>
            <div className="d-flex align-items-center">
              <label className="fs-md-4 fs-6 me-3" for="party-category">
                劇會類別
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                id="party-category"
              >
                <option value="1" selected>
                  全部
                </option>
                <option value="2">未出團</option>
                <option value="3">已出團</option>
                <option value="4">取消出團</option>
              </select>
            </div>
          </div>
          <div className="d-flex">
            <div className="ms-auto mb-3">
              <button
                type="button"
                className="btn d-flex align-items-center fs-b3 text-grey-400"
              >
                劇會日期：最新到最舊
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
          </div>

          <div className="table-responsive">
            <table
              className={`table align-middle ${
                record.records?.length > 0 ? "table-hover" : ""
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
                {record.records?.length > 0 ? (
                  records.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">
                        <small className="date">{product.origin_price}</small>
                        <p>{product.title}</p>
                      </th>
                      <td>{product.price}</td>
                      <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
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
                        <a href="#">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <title>bookmark_fill</title>
                            <g id="bookmark_fill" fill="none">
                              <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z" />
                              <path
                                fill="#FF8A20FF"
                                d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v16.028c0 1.22-1.38 1.93-2.372 1.221L12 18.229l-5.628 4.02c-.993.71-2.372 0-2.372-1.22z"
                              />
                            </g>
                          </svg>
                        </a>
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
                        <p className="fs-3 mb-4">目前尚無參加過的劇會</p>
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

export default ProfileRecord;
