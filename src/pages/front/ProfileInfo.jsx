import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { changeLoadingState } from "../../redux/slice/loadingSlice";
import Loading from "../../components/Loading";
import { pushMsg } from "../../redux/slice/toastSlice";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;

const loginMethod = ["Facebook", "Instagram"];

const ProfileInfo = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const { id: memberId } = params;
  const [info, setInfo] = useState([]);

  const area = useSelector((state) => state.defaultDataStore.city);

  // 會員資訊表單
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isDirty },
    reset,
  } = useForm({
    mode: "onTouched",
  });

  // 重設密碼表單
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, touchedFields: passwordTouchedFields },
    reset: resetPassword,
    watch,
  } = useForm({
    mode: "onTouched",
  });

  const password = watch("password");
  const newPassword = watch("newPassword");
  const newPasswordCheck = watch("newPasswordCheck");

  const getInfo = async () => {
    dispatch(changeLoadingState(true));
    const token = Cookies.get("token");
    axios.defaults.headers.common["Authorization"] = token;
    console.log("發送 API 請求中...");
    try {
      const res = await axios.get(
        `${baseUrl}/api/${apiPath}/admin/article/${memberId}`
      );

      console.log("API 回應成功：", res);

      setInfo(res.data.article);

      // 使用 reset 設置表單的預設值
      reset({
        title: res.data.article.title,
        author: res.data.article.author,
        birthday: res.data.article.birthday,
        gender: res.data.article.gender,
        email: res.data.article.email,
        phone: res.data.article.phone,
        area: res.data.article.area,
        description: res.data.article.description,
      });

      // 重設密碼表單不需要預設值
      resetPassword();
    } catch (error) {
      console.error("取得個人資料失敗：", error);
      alert("取得個人資料失敗");
    } finally {
      dispatch(changeLoadingState(false));
    }
  };

  useEffect(() => {
    getInfo();
  }, [memberId]);

  const onSubmit = handleSubmit((data) => {
    updateInfo(data);
  });

  const updateInfo = async (info) => {
    const data = {
      title: info.title || "預設暱稱",
      description: info.description || "這是預設簡介",
      image:
        info.image ||
        "https://images.unsplash.com/photo-1520780662578-a2e93221bbd5?q=80&w=2070&auto=format&fit=crop",
      tag: ["tag1"],
      create_at: info.create_at || 1712238900,
      author: info.author || "預設姓名",
      isPublic: true,
      content: "這是內容",
      ...info,
    };
    try {
      await axios.put(`${baseUrl}/api/${apiPath}/admin/article/${memberId}`, {
        data,
      });
      await getInfo();
      dispatch(
        pushMsg({
          text: "更新個人資料成功！",
          status: "success",
        })
      );
    } catch (error) {
      alert("更新個人資料失敗");
      console.error(error);
      console.log(data);
    }
  };

  // 提交重設密碼表單
  const onSubmitPassword = handleSubmitPassword(async (data) => {
    dispatch(changeLoadingState(true));

    try {
      // 執行密碼重設，因為即時驗證已經確保舊密碼正確
      await resetPasswordHandler(data);
      dispatch(
        pushMsg({
          text: "密碼重設成功！",
          status: "success",
        })
      );
    } catch (error) {
      console.error("密碼重設失敗：", error);
      dispatch(
        pushMsg({
          text: "密碼重設失敗，請稍後再試",
          status: "failed",
        })
      );
    } finally {
      dispatch(changeLoadingState(false));
    }
  });

  // 重設密碼
  const resetPasswordHandler = async (data) => {
    try {
      dispatch(changeLoadingState(true));

      const updatedData = {
        ...info, // 保留原有的所有資料
        password: data.newPassword, // 更新密碼欄位
      };

      await axios.put(`${baseUrl}/api/${apiPath}/admin/article/${memberId}`, {
        data: updatedData,
      });

      // 重設密碼表單
      resetPassword();

      dispatch(
        pushMsg({
          text: "密碼重設成功！",
          status: "success",
        })
      );
    } catch (error) {
      console.error("密碼重設失敗：", error);
      dispatch(
        pushMsg({
          text: "密碼重設失敗，請稍後再試",
          status: "failed",
        })
      );
    } finally {
      dispatch(changeLoadingState(false));
    }
  };

  return (
    <>
      <div className="col-lg-8">
        <div className="my-info">
          <h2 className="fs-md-1m fs-4 mb-8">個人資訊</h2>
          <section className="my-info-section">
            <div className="d-md-flex flex-md-row flex-column align-items-baseline gap-5 mb-md-0 mb-5">
              <h3 className="fs-md-2 fs-5 mb-md-5">會員資訊</h3>
              <p className="text-danger">
                <span className="fs-5">*</span>
                必填項目，填寫完整資訊開始參加劇會
              </p>
            </div>

            <form onSubmit={onSubmit}>
              <div className="row align-items-center mb-5">
                <label
                  htmlFor="title"
                  className="col-md-3 col-form-label text-nowrap fs-md-5 fs-6"
                >
                  會員暱稱
                  <span className="fs-5 text-danger">*</span>
                </label>

                <div className="col-auto position-relative">
                  <input
                    type="text"
                    id="title"
                    className={`form-control ${
                      touchedFields.title
                        ? errors.title
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    placeholder="暱稱字數上限 16 個字"
                    maxLength="16"
                    {...register("title", {
                      required: "暱稱欄位必填",
                      maxLength: {
                        value: 16,
                        message: "暱稱字數上限 16 個字",
                      },
                    })}
                  />
                  {errors.title && (
                    <div className="col-auto invalid-feedback">
                      {errors.title.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="row align-items-center mb-5">
                <label
                  htmlFor="author"
                  className="col-md-3 col-form-label text-nowrap fs-md-5 fs-6"
                >
                  真實姓名<span className="fs-5 text-danger">*</span>
                </label>

                <div className="col-auto position-relative">
                  <input
                    type="text"
                    id="author"
                    className={`form-control ${
                      touchedFields.author
                        ? errors.author
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    placeholder="請填寫你的真實姓名"
                    {...register("author", {
                      required: "姓名欄位必填",
                    })}
                  />
                  {errors.author && (
                    <div className="col-auto invalid-feedback">
                      {errors.author.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="row align-items-center mb-5">
                <label
                  htmlFor="birthday"
                  className="col-md-3 col-form-label text-nowrap fs-md-5 fs-6"
                >
                  出生日期<span className="fs-5 text-danger">*</span>
                </label>

                <div className="col-auto position-relative">
                  <input
                    type="date"
                    id="birthday"
                    className={`form-control ${
                      touchedFields.birthday
                        ? errors.birthday
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    {...register("birthday", {
                      required: "生日欄位必填",
                    })}
                  />
                  {errors.birthday && (
                    <div className="col-auto invalid-feedback">
                      {errors.birthday.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="row align-items-center mb-5">
                <label
                  htmlFor="gender"
                  className="col-md-3 col-form-label text-nowrap fs-md-5 fs-6"
                >
                  性別<span className="fs-5 text-danger">*</span>
                </label>
                {errors.gender && (
                  <div className="col-auto invalid-feedback">
                    {errors.gender.message}
                  </div>
                )}

                <div className="col-auto position-relative">
                  <div className="form-check form-check-inline">
                    <input
                      className={`form-check-input ${
                        touchedFields.gender
                          ? errors.gender
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      type="radio"
                      name="gender"
                      id="inlineRadio1"
                      value="男生"
                      {...register("gender", { required: "性別必選" })}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      男生
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className={`form-check-input ${
                        touchedFields.gender
                          ? errors.gender
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      type="radio"
                      name="gender"
                      id="inlineRadio2"
                      value="女生"
                      {...register("gender", { required: "性別必選" })}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio2">
                      女生
                    </label>
                  </div>
                </div>
              </div>

              <div className="row align-items-center mb-5">
                <label
                  htmlFor="email"
                  className="col-md-3 col-form-label text-nowrap fs-md-5 fs-6"
                >
                  會員信箱&ensp;
                </label>

                <div className="col-auto">
                  <input
                    type="email"
                    id="email"
                    className="form-control-plaintext"
                    {...register("email")}
                    readOnly
                    title="若需要修改請聯絡我們"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-5">
                <label
                  htmlFor="phone"
                  className="col-md-3 col-form-label text-nowrap fs-md-5 fs-6"
                >
                  手機號碼<span className="fs-5 text-danger">*</span>
                </label>

                <div className="col-auto position-relative">
                  <input
                    type="tel"
                    id="phone"
                    className={`form-control ${
                      touchedFields.phone
                        ? errors.phone
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    placeholder="請填寫你的手機號碼"
                    {...register("phone", {
                      required: "電話欄位必填",
                      pattern: {
                        value: /^(0[2-8]\d{7}|09\d{8})$/,
                        message: "電話格式錯誤",
                      },
                    })}
                  />
                  {errors.phone && (
                    <div className="col-auto invalid-feedback">
                      {errors.phone.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="row align-items-center mb-5">
                <label
                  htmlFor="area"
                  className="col-md-3 col-form-label text-nowrap fs-md-5 fs-6"
                >
                  居住地區<span className="fs-5 text-danger">*</span>
                </label>

                <div className="col-auto">
                  <select
                    className="form-select"
                    defaultValue="僅限台灣"
                    title="目前僅限台灣地區"
                    disabled
                  >
                    <option>僅限台灣</option>
                  </select>
                </div>
                <div className="col-auto position-relative">
                  <select
                    id="area"
                    className="form-select"
                    {...register("area", {
                      required: "地區欄位必填",
                    })}
                  >
                    <option value="" disabled>
                      選擇地區
                    </option>
                    {area.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.area && (
                    <div className="col-auto invalid-feedback">
                      {errors.area.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="row mb-5">
                <label
                  htmlFor="description"
                  className="col-md-3 form-label text-nowrap fs-md-5 fs-6"
                >
                  個人簡介
                </label>

                <div className="d-md-flex d-flex-column align-items-md-end gap-md-5">
                  <textarea
                    id="description"
                    className="form-control mb-md-0 mb-8"
                    cols="5"
                    rows="5"
                    maxLength="100"
                    placeholder="請輸入你的個人簡介，字數上限 100 字"
                    style={{ resize: "none" }}
                    {...register("description")}
                  ></textarea>
                  <div
                    className="text-end"
                    title={!isDirty ? "表單未被修改時不能按唷~" : ""}
                  >
                    <button
                      type="submit"
                      className="btn btn-brand text-white w-100 text-nowrap"
                      disabled={!isDirty} // 當表單未被修改時禁用按鈕
                    >
                      確認修改
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>

        <div className="login-method">
          <h2 className="fs-md-1m fs-4 mb-8">登入方式</h2>
          <section className="login-method-section">
            {loginMethod.map((method, index) => (
              <div
                key={index}
                className="row justify-content-between align-items-center py-3"
              >
                <p className="col-sm-4 col-8 fs-md-5 fs-6 text-nowrap">
                  {method} 登入
                </p>
                <p className="col-sm-3 fs-6 text-muted text-nowrap d-sm-block d-none">
                  尚未綁定
                </p>
                <div className="col-sm-3 col-4">
                  <button className="btn btn-secondary text-nowrap">
                    進行綁定
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <button className="btn btn-danger text-nowrap">刪除帳號</button>
            </div>
          </section>
        </div>

        <form onSubmit={onSubmitPassword}>
          <div className="reset-password">
            <h2 className="fs-md-1m fs-4 mb-8">重設密碼</h2>
            <section className="reset-password-section d-md-flex flex-md-row flex-column align-items-end">
              <div className="w-100">
                <div className="mb-3 row">
                  <label
                    htmlFor="password"
                    className="col-md-3 col-form-label text-nowrap fs-md-5 fs-6"
                  >
                    舊密碼
                  </label>
                  <div className="col-md-auto position-relative">
                    <input
                      type="password"
                      className={`form-control ${
                        passwordTouchedFields.password
                          ? passwordErrors.password
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      {...registerPassword("password", {
                        required: "舊密碼欄位必填",
                        minLength: {
                          value: 8,
                          message: "密碼至少需要 8 個字元",
                        },
                        maxLength: {
                          value: 24,
                          message: "密碼最多 24 個字元",
                        },
                        validate: async (value) => {
                          try {
                            const response = await axios.get(
                              `${baseUrl}/api/${apiPath}/admin/article/${memberId}`
                            );
                            const currentPassword =
                              response.data.article.password;

                            if (value !== currentPassword) {
                              return "舊密碼不正確，請重新輸入";
                            }
                          } catch (error) {
                            console.error("無法驗證舊密碼：", error);
                            return "驗證密碼時出現問題，請稍後再試";
                          }
                        },
                      })}
                      id="password"
                      placeholder="密碼 (限 8-24 碼英文數字符號) "
                    />
                    {passwordErrors.password && (
                      <div className="col-auto invalid-feedback">
                        {passwordErrors.password.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3 row">
                  <label
                    htmlFor="newPassword"
                    className="col-md-3 col-form-label text-nowrap fs-md-5 fs-6"
                  >
                    新密碼
                  </label>
                  <div className="col-md-auto position-relative">
                    <input
                      type="password"
                      className={`form-control ${
                        passwordTouchedFields.newPassword
                          ? passwordErrors.newPassword
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      {...registerPassword("newPassword", {
                        required: "新密碼欄位必填",
                        minLength: {
                          value: 8,
                          message: "密碼至少需要 8 個字元",
                        },
                        maxLength: {
                          value: 24,
                          message: "密碼最多 24 個字元",
                        },
                      })}
                      id="newPassword"
                      placeholder="密碼 (限 8-24 碼英文數字符號) "
                    />
                    {passwordErrors.newPassword && (
                      <div className="col-auto invalid-feedback">
                        {passwordErrors.newPassword.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-md-0 mb-8 row">
                  <label
                    htmlFor="newPasswordCheck"
                    className="col-md-3 col-form-label text-nowrap fs-md-5 fs-6"
                  >
                    確認新密碼
                  </label>
                  <div className="col-md-auto position-relative">
                    <input
                      type="password"
                      className={`form-control ${
                        passwordTouchedFields.newPasswordCheck
                          ? passwordErrors.newPasswordCheck
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      {...registerPassword("newPasswordCheck", {
                        required: "再次輸入密碼欄位必填",
                        validate: (value, formValues) =>
                          value === formValues.newPassword ||
                          "新密碼與確認密碼不一致",
                      })}
                      id="newPasswordCheck"
                      placeholder="再次輸入密碼"
                    />
                    {passwordErrors.newPasswordCheck && (
                      <div className="col-auto invalid-feedback">
                        {passwordErrors.newPasswordCheck.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-brand text-white w-100 text-nowrap"
                  disabled={
                    !password || // 檢查舊密碼是否已填寫
                    !newPassword || // 檢查新密碼是否已填寫
                    !newPasswordCheck || // 檢查確認密碼是否已填寫
                    passwordErrors.password || // 檢查舊密碼是否有錯誤
                    passwordErrors.newPassword || // 檢查新密碼是否有錯誤
                    passwordErrors.newPasswordCheck // 檢查確認密碼是否有錯誤
                  }
                >
                  確認修改
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
      <Loading />
    </>
  );
};

export default ProfileInfo;
