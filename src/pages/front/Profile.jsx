import axios from "axios";
import Cookies from "js-cookie";
import { Navigate, NavLink, Outlet, useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { pushMsg } from "../../redux/slice/toastSlice";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;
const routes = [
  {
    path: "profileInfo",
    name: "個人資訊",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="me-2"
      >
        <title>profile_fill</title>
        <g id="profile_fill" fill="none">
          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z" />
          <path
            fill="#FF8A20FF"
            d="M20 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-3 12H7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2m-7-8H8a2 2 0 0 0-1.995 1.85L6 9v2a2 2 0 0 0 1.85 1.995L8 13h2a2 2 0 0 0 1.995-1.85L12 11V9a2 2 0 0 0-1.85-1.995zm7 4h-3a1 1 0 0 0-.117 1.993L14 13h3a1 1 0 0 0 .117-1.993zm-7-2v2H8V9zm7-2h-3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2"
          />
        </g>
      </svg>
    ),
  },
  {
    path: "profileRecord",
    name: "我的劇會記錄",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="me-2"
      >
        <title>calendar_2_fill</title>
        <g id="calendar_2_fill" fill="none" fillRule="evenodd">
          <path d="M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z" />
          <path
            fill="#FF8A20FF"
            d="M16 3a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V4a1 1 0 0 1 2 0v1h6V4a1 1 0 0 1 1-1M8.01 16H8a1 1 0 0 0-.117 1.993L8.01 18a1 1 0 1 0 0-2m4 0H12a1 1 0 0 0-.117 1.993l.127.007a1 1 0 1 0 0-2m4 0H16a1 1 0 0 0-.117 1.993l.127.007a1 1 0 1 0 0-2m-8-4H8a1 1 0 0 0-.117 1.993L8.01 14a1 1 0 1 0 0-2m4 0H12a1 1 0 0 0-.117 1.993l.127.007a1 1 0 1 0 0-2m4 0H16a1 1 0 0 0-.117 1.993l.127.007a1 1 0 1 0 0-2M19 7H5v2h14z"
          />
        </g>
      </svg>
    ),
  },
  {
    path: "profileCollection",
    name: "我的收藏",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="me-2"
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
    ),
  },
];

const Profile = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const { id: memberId } = params;
  const [memberInfo, setMemberInfo] = useState({});

  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageUpdated, setImageUpdated] = useState(false);

  const state = true; // 假設是登入狀態
  const mymodal = useRef(null);

  const getMember = async () => {
    const token = Cookies.get("token");
    try {
      const res = await axios.get(
        `${baseUrl}/api/${apiPath}/admin/article/${memberId}`,
        {
          headers: { Authorization: token },
        }
      );
      setMemberInfo(res.data.article);
      setAvatarUrl(
        res.data.article.image ||
          "https://images.unsplash.com/photo-1520780662578-a2e93221bbd5?q=80&w=2070&auto=format&fit=crop"
      );
      return res.data.article;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMember();
  }, [memberId]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 取得副檔名（不分大小寫）
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // 限制允許的圖片格式
    const allowedTypes = ["image/jpeg", "image/png"];
    const allowedExtensions = ["jpg", "jpeg", "png"]; // 允許的副檔名

    if (
      !allowedTypes.includes(file.type) ||
      !allowedExtensions.includes(fileExtension)
    ) {
      dispatch(
        pushMsg({
          text: "不支援的圖片格式！請上傳 jpg 或 png 檔案 ~",
          status: "failed",
        })
      );
      return; // 終止上傳
    }

    // 限制檔案大小（最大 3MB）
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      dispatch(
        pushMsg({
          text: "圖片大小超過 2MB，請上傳小一點的圖片！",
          status: "failed",
        })
      );
      return; // 終止上傳
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${baseUrl}/api/${apiPath}/admin/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      console.log("圖片上傳成功，獲取的 URL: ", data.imageUrl);

      // 更新個人資料 (將新的圖片 URL 存回)
      await axios.put(
        `${baseUrl}/api/${apiPath}/admin/article/${memberId}`,
        {
          data: { ...memberInfo, image: data.imageUrl },
        },
        {
          headers: { Authorization: token },
        }
      );

      setAvatarUrl(data.imageUrl);

      const newMemberInfo = await getMember();
      console.log("更新後的資訊：", newMemberInfo);

      setImageUpdated(true);
    } catch (error) {
      console.error("圖片上傳失敗：", error);
      dispatch(
        pushMsg({
          text: "圖片上傳失敗，請稍後再試！",
          status: "failed",
        })
      );
    }
  };

  useEffect(() => {
    if (imageUpdated) {
      setTimeout(() => {
        dispatch(pushMsg({ text: "更新個人圖片成功！", status: "success" }));
      }, 700);
      setImageUpdated(false); // 重置狀態
    }
  }, [imageUpdated]);

  return (
    <>
      <Navigate to={routes[0].path} replace />
      <div className="profile-container">
        <div className="container pt-13 pb-18">
          <div className="row">
            <div className="col-lg-4 mb-lg-0 mb-6">
              <div className="profile">
                <div className="profile-info">
                  <div className="profile-pic-container position-relative d-inline-block">
                    <div className="flex-shrink-0">
                      <img
                        src={memberInfo.image}
                        alt="個人圖片"
                        width="200"
                        height="200"
                        className="rounded-circle object-fit-cover profile-pic"
                      />
                    </div>
                    {/* <a
                      href=""
                      className="change-btn rounded-circle position-absolute bg-white
                  d-flex justify-content-center align-items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <title>點擊更換個人圖片~</title>
                        <g id="refresh_3_fill" fill="none">
                          <path d="M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z" />
                          <path
                            fill="#FF8A20FF"
                            d="M20 9.5a1.5 1.5 0 0 1 1.5 1.5 8.5 8.5 0 0 1-8.5 8.5h-2.382a1.5 1.5 0 0 1-2.179 2.06l-2.494-2.494a1.495 1.495 0 0 1-.445-1.052v-.028c.003-.371.142-.71.368-.97l.071-.077 2.5-2.5a1.5 1.5 0 0 1 2.18 2.061H13a5.5 5.5 0 0 0 5.5-5.5A1.5 1.5 0 0 1 20 9.5m-4.44-7.06 2.5 2.5a1.5 1.5 0 0 1 0 2.12l-2.5 2.5a1.5 1.5 0 0 1-2.178-2.06H11A5.5 5.5 0 0 0 5.5 13a1.5 1.5 0 1 1-3 0A8.5 8.5 0 0 1 11 4.5h2.382a1.5 1.5 0 0 1 2.179-2.06Z"
                          />
                        </g>
                      </svg>
                    </a> */}
                    <label
                      htmlFor="imageUpload"
                      className="change-btn rounded-circle position-absolute bg-white
                      d-flex justify-content-center align-items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <title>點擊更換個人圖片~</title>
                        <g id="refresh_3_fill" fill="none">
                          <path d="M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z" />
                          <path
                            fill="#FF8A20FF"
                            d="M20 9.5a1.5 1.5 0 0 1 1.5 1.5 8.5 8.5 0 0 1-8.5 8.5h-2.382a1.5 1.5 0 0 1-2.179 2.06l-2.494-2.494a1.495 1.495 0 0 1-.445-1.052v-.028c.003-.371.142-.71.368-.97l.071-.077 2.5-2.5a1.5 1.5 0 0 1 2.18 2.061H13a5.5 5.5 0 0 0 5.5-5.5A1.5 1.5 0 0 1 20 9.5m-4.44-7.06 2.5 2.5a1.5 1.5 0 0 1 0 2.12l-2.5 2.5a1.5 1.5 0 0 1-2.178-2.06H11A5.5 5.5 0 0 0 5.5 13a1.5 1.5 0 1 1-3 0A8.5 8.5 0 0 1 11 4.5h2.382a1.5 1.5 0 0 1 2.179-2.06Z"
                          />
                        </g>
                      </svg>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="imageUpload"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                  </div>

                  <p className="fs-3 fw-bold mt-11 mb-3">{memberInfo.title}</p>
                  <p className="fs-6 mb-11">{memberInfo.description}</p>
                </div>
                <div className="profile-nav">
                  <ul className="nav nav-pills flex-column gap-5">
                    {routes.map((route) => (
                      <li className="nav-item" key={route.path}>
                        <NavLink className="nav-link" to={route.path}>
                          {route.icon}
                          {route.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <Outlet context={{ state, mymodal }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
