import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeLoadingState } from "../../redux/slice/loadingSlice";
import { pushMsg } from "../../redux/slice/toastSlice";
import { Modal, Offcanvas } from "bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
import SearchBar from "../../components/SearchBar";
import Dropdown from "../../components/Dropdown";
import DramaFormModal from "../../components/modal/DramaFormModal";
import TagsFilter from "../../components/TagsFilter";
import DramaListCard from "../../components/card/DramaListCard";
import DramaListTab from "../../components/tab/DramaListTab";
import LoginModal from "../../components/modal/LoginModal";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;
const pageLink = [
  {
    name: `首頁`,
    link: `/`,
  },
  {
    name: `劇會總覽`,
    link: `/dramaList`,
  },
];

const DramaList = () => {
  // 變數宣告
  const dramaFormRef = useRef(null);
  const dramaFormInstance = useRef(null);
  const searchOffcanvasRef = useRef(null);
  const searchOffcanvasInstance = useRef(null);
  const [modalMode, setModalMode] = useState("");
  const openButtonRef = useRef(null);
  const { dramas, setDramas, members, setMembers, mymodal } =
    useOutletContext();
  const [loveDramas, setLoveDramas] = useState([]);
  const [filterDramas, setFilterDramas] = useState([]);
  const [unitShareDrama, setUnitShareDrama] = useState({});
  const [dramaState, setDramaState] = useState("onGoing");
  const dispatch = useDispatch();
  const [phoneSearchState, setPhoneSearchState] = useState(false);
  const token = Cookies.get(`token`);

  // 彈跳視窗
  const showAlert = () => {
    let timerInterval;
    Swal.fire({
      title:
        '<span style="color: #FF8A20;"><i class="bi bi-person-fill-exclamation me-2 fs-2"></i>請先登入</span>',
      html: "倒數<b></b>自動跳轉登入頁",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
        mymodal.current.show();
      },
      customClass: {
        title: "swal-title-color",
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    });
  };

  // 開關劇會modal
  const openDramaForm = () => {
    dramaFormInstance.current.show();
  };
  const closeDramaForm = () => {
    setModalMode("");
    dramaFormInstance.current.hide();
  };
  // 開關offcanvas
  const closeSearchOffcanvas = () => {
    searchOffcanvasInstance.current.hide();
  };

  // 渲染劇會列表
  const getDramas = async () => {
    dispatch(changeLoadingState(true));
    try {
      const res = await axios.get(`${baseUrl}/api/${apiPath}/products`);
      setDramas(res.data.products);
      setFilterDramas(res.data.products);
    } catch (err) {
      const message = err.response?.data;
      message = Array.isArray(message) ? message : [message];
      dispatch(
        pushMsg({
          text: message.join("、"),
          status: "failed",
        })
      );
    } finally {
      dispatch(changeLoadingState(false));
    }
  };

  // 取得會員列表
  const getMember = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/${apiPath}/articles`);
      setMembers(res.data.articles);
    } catch (err) {
      console.log(err);
      const message = err.response?.data;
      message = Array.isArray(message) ? message : [message];
      dispatch(
        pushMsg({
          text: message.join("、"),
          status: "failed",
        })
      );
    }
  };

  // 加入最愛蒐藏
  const postLoveDrama = async (product_id) => {
    const updateData = {
      data: {
        product_id,
        qty: 1,
      },
    };
    dispatch(changeLoadingState(true));
    try {
      await axios.post(`${baseUrl}/api/${apiPath}/cart`, updateData);
      dispatch(
        pushMsg({
          text: "已加入蒐藏",
          status: "success",
        })
      );
      getLoveDramas();
    } catch (err) {
      const message = err.response.data;
      dispatch(
        pushMsg({
          text: message.join("、"),
          status: "failed",
        })
      );
    } finally {
      dispatch(changeLoadingState(false));
      getLoveDramas();
    }
  };
  const getLoveDramas = async () => {
    dispatch(changeLoadingState(true));
    try {
      const res = await axios.get(`${baseUrl}/api/${apiPath}/cart`);
      setLoveDramas(res.data.data.carts);
    } catch (err) {
      const message = err.response.data;
      dispatch(
        pushMsg({
          text: message.join("、"),
          status: "failed",
        })
      );
    } finally {
      dispatch(changeLoadingState(false));
    }
  };
  const deleteLoveDrama = async (cart_id) => {
    dispatch(changeLoadingState(true));
    try {
      await axios.delete(`${baseUrl}/api/${apiPath}/cart/${cart_id}`);
      dispatch(
        pushMsg({
          text: "已取消蒐藏",
          status: "success",
        })
      );
      getLoveDramas();
    } catch (err) {
      const message = err.response.data;
      dispatch(
        pushMsg({
          text: message.join("、"),
          status: "failed",
        })
      );
    } finally {
      dispatch(changeLoadingState(false));
    }
  };
  const handleLoveClick = (drama_id) => {
    if (loveDramas.some((item) => item.product.id === drama_id)) {
      const cart_id = loveDramas.filter(
        (loveDrama) => loveDrama.product.id === drama_id
      )[0].id;
      deleteLoveDrama(cart_id);
    } else {
      postLoveDrama(drama_id);
    }
  };

  // 初始化
  useEffect(() => {
    if (dramaFormRef.current) {
      dramaFormInstance.current = new Modal(dramaFormRef.current);
    }
    dramaFormRef.current.addEventListener("hidden.bs.modal", () => {
      if (openButtonRef.current) {
        openButtonRef.current.focus();
      }
    });
    if (searchOffcanvasRef.current) {
      searchOffcanvasInstance.current = new Offcanvas(
        searchOffcanvasRef.current
      );
    }
  }, []);
  useEffect(() => {
    getDramas();
    getLoveDramas();
    getMember();
  }, []);

  useEffect(() => {
    getDramas();
  }, [modalMode, token]);
  const phoneSearch = () => {
    setPhoneSearchState(true);
  };

  return (
    <>
      <main className="dramaList bg-brand-50 pt-lg-13 pt-6 pb-15">
        <div className="container">
          {/* 電腦版 */}
          <Breadcrumb pageLink={pageLink} className="breadcrumb" />
          <div className="row d-none d-lg-flex">
            <div className="filterBoard col-3">
              {/* 建立劇會 */}
              <div className="addDrama-bg rounded-5 rounded-bottom-0 d-flex align-items-center">
                <button
                  type="button"
                  className="btn fs-5 text-white ms-9 createDramaBtn"
                  style={{ "--bs-btn-border-color": "none" }}
                  onClick={() => {
                    if (token) {
                      setModalMode("add");
                      openDramaForm();
                    } else {
                      showAlert();
                    }
                  }}
                >
                  <i className="bi bi-plus-circle-fill"></i>
                  <span className="ms-1">我要發起劇會</span>
                </button>
              </div>
              {/* 篩選區 */}
              <div className="d-flex flex-column align-items-start bg-white p-5">
                {/* 搜尋bar */}
                <SearchBar
                  bar={false}
                  filterDramas={filterDramas}
                  setDramas={setDramas}
                />
                {/* 標籤區 */}

                <TagsFilter
                  filterDramas={filterDramas}
                  setDramas={setDramas}
                  dramaState={dramaState}
                />
              </div>
            </div>
            <div className="col-9">
              {/* 下拉選單 */}
              <div className="d-flex justify-content-between mb-5 sortBoard">
                <DramaListTab
                  tabName={[
                    { name: "熱門", state: "onGoing" },
                    { name: "歷史", state: "history" },
                  ]}
                  setDramaState={setDramaState}
                />
                <div className="d-flex">
                  <Dropdown
                    options={["最新>最舊", "最舊>最新"]}
                    type="time"
                    filterDramas={filterDramas}
                    setDramas={setDramas}
                    getDramas={getDramas}
                  />
                  <Dropdown
                    options={["全部", "我發起的", "我跟團的"]}
                    type={"personal"}
                  />
                </div>
              </div>
              {/* 卡片區 */}
              <div className="row row-cols-md-2 gy-4">
                {dramas
                  .filter((drama) =>
                    dramaState === "onGoing"
                      ? drama.isFinish === 0
                      : drama.isFinish === 1
                  )
                  .map((drama) => {
                    const randomIndex =
                      Array.isArray(members) &&
                      Math.floor(Math.random() * members.length);
                    const member = members && members[randomIndex];
                    return (
                      <DramaListCard
                        key={drama.id}
                        drama={drama}
                        loveDramas={loveDramas}
                        handleLoveClick={handleLoveClick}
                        openDramaForm={openDramaForm}
                        setModalMode={setModalMode}
                        setUnitShareDrama={setUnitShareDrama}
                        member={member}
                        showAlert={showAlert}
                      />
                    );
                  })}
              </div>
            </div>
          </div>

          {/* 平板/手機版 */}
          {/* 下拉選單 */}
          <div className="d-flex d-lg-none align-items-center justify-content-between mb-4">
            <button
              type="button"
              className="btn btn-brand-400 rounded-pill fs-5 text-white"
              onClick={() => {
                setModalMode("add");
                openDramaForm();
              }}
            >
              <i className="bi bi-plus-circle-fill"></i>
              <span className="ms-1 fs-6">我要發起劇會</span>
            </button>
            <div className="h4">
              <span
                type="button"
                onClick={phoneSearch}
                data-bs-toggle="offcanvas"
                data-bs-target="#filterOffcanvas"
                aria-controls="filterOffcanvas"
              >
                <i className="bi bi-funnel"></i>
              </span>
              <span
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#sortOffcanvas"
                aria-controls="sortOffcanvas"
              >
                <i className="bi bi-sort-down ms-4"></i>
              </span>
            </div>
          </div>
          <div className="row row-cols-md-2 d-lg-none gy-4">
            {dramas.map((drama) => (
              <DramaListCard
                key={drama.id}
                drama={drama}
                loveDramas={loveDramas}
                handleLoveClick={handleLoveClick}
                openDramaForm={openDramaForm}
                setModalMode={setModalMode}
                setUnitShareDrama={setUnitShareDrama}
              />
            ))}
          </div>
        </div>

        {/* Modal */}
        <DramaFormModal
          dramaFormRef={dramaFormRef}
          closeDramaForm={closeDramaForm}
          modalMode={modalMode}
          unitShareDrama={unitShareDrama}
        />
        <LoginModal mymodal={mymodal} />

        {/* Offcanvas */}
        {/* 篩選 */}
        <div
          className="offcanvas offcanvas-bottom offcanvas-filter rounded-6 rounded-bottom"
          tabIndex="-1"
          id="filterOffcanvas"
          aria-labelledby="filterOffcanvasLabel"
          ref={searchOffcanvasRef}
        >
          <div className="offcanvas-body">
            <div className="d-flex flex-column align-items-start bg-white p-5">
              <SearchBar
                bar={false}
                filterDramas={filterDramas}
                setDramas={setDramas}
                phoneSearchState={phoneSearchState}
                closeSearchOffcanvas={closeSearchOffcanvas}
              />

              {/* 標籤區 */}
              <TagsFilter filterDramas={filterDramas} setDramas={setDramas} />
            </div>
          </div>
          <button
            className="btn btn-brand-core w-100 text-white rounded-0"
            data-bs-toggle="offcanvas"
            data-bs-target="#filterOffcanvas"
          >
            套用
          </button>
        </div>
        {/* 排序 */}
        <div
          className="offcanvas offcanvas-bottom offcanvas-sort rounded-6 rounded-bottom"
          tabIndex="-1"
          id="sortOffcanvas"
          aria-labelledby="sortOffcanvasLabel"
        >
          <div className="offcanvas-body">
            <span className="h6 d-block my-3">發起時間</span>
            <Dropdown
              options={["最新>最舊", "最舊>最新"]}
              type="time"
              filterDramas={filterDramas}
              setDramas={setDramas}
              getDramas={getDramas}
            />
            <br />
            <span className="h6 d-block my-3">出團情況</span>
            <Dropdown options={["全部", "我發起的", "我跟團的"]} />
          </div>
          <button
            className="btn btn-brand-core w-100 text-white rounded-0"
            data-bs-toggle="offcanvas"
            data-bs-target="#sortOffcanvas"
          >
            套用
          </button>
        </div>
      </main>
    </>
  );
};

export default DramaList;
