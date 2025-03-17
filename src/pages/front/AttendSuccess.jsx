import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ShareModal from "../../components/modal/ShareModal";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_URL = import.meta.env.VITE_APP_API_PATH;

function AttendSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dramaData, setDramaData] = useState(null);
  const [recommendDramas, setRecommendDramas] = useState([]);

  useEffect(() => {
    const getDramaData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/${API_URL}/product/${id}`);
        setDramaData(res.data.product);
      } catch (error) {
        console.error("獲取戲劇資料失敗：", error);
      }
    };

    const getRecommendDramas = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/${API_URL}/products`);
        // 過濾掉當前劇會，並隨機選擇三個
        const otherDramas = res.data.products.filter(
          (drama) => drama.id !== id
        );
        const randomDramas = otherDramas
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setRecommendDramas(randomDramas);
      } catch (error) {
        console.error("獲取推薦劇會失敗：", error);
      }
    };

    getDramaData();
    getRecommendDramas();
  }, [id]);

  if (!dramaData) return <div>載入中...</div>;

  return (
    <div className="bg-brand-50">
      <div className="container custom-container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="drama-info__title-section mb-md-10 mb-6">
              <div
                className="d-flex align-items-center cursor-pointer hover-opacity"
                onClick={() => navigate("/dramaList")}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-arrow-left text-grey-700 fs-4 me-2"></i>
                <p className="text-grey-700 mb-0">返回劇會總覽</p>
              </div>
              <p className="text-grey-950 fs-md-2 fs-5 fw-semibold mb-6 mt-4">
                參加成功！
              </p>
            </div>
            <div className="card border-0 bg-white rounded-4 shadow-sm">
              <div className="card-body p-5">
                <div className="row">
                  <div className="col-md-6">
                    <img
                      src={dramaData.imageUrl}
                      alt={dramaData.title}
                      className="img-fluid rounded-4"
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="col-md-6 d-flex flex-column justify-content-center">
                    <h3 className="text-grey-950 fw-semibold mb-4">
                      {dramaData.title}
                    </h3>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-clock text-brand-core fs-4 me-3"></i>
                      <p className="text-grey-700 mb-0">
                        {dramaData.date.start}
                      </p>
                    </div>
                    <div className="d-flex align-items-center mb-4">
                      <i className="bi bi-geo-alt text-brand-core fs-4 me-3"></i>
                      <p className="text-grey-700 mb-0">{dramaData.location}</p>
                    </div>
                    <button
                      className="btn btn-brand-core text-white w-100"
                      data-bs-toggle="modal"
                      data-bs-target="#shareModal"
                    >
                      分享給朋友
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 推薦劇會區域 */}
            <div className="mt-10">
              <h4 className="text-grey-950 fw-semibold mb-6">
                大家都在參加...
              </h4>
              <div className="row row-cols-md-3 g-4">
                {recommendDramas.map((drama) => (
                  <div key={drama.id} className="col">
                    <div className="card border-0 bg-white rounded-4 shadow-sm h-100 d-flex flex-column">
                      <img
                        src={drama.imageUrl}
                        alt={drama.title}
                        className="card-img-top rounded-top-4"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column flex-grow-1">
                        <h5 className="card-title text-grey-950 fw-semibold mb-3">
                          {drama.title}
                        </h5>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-clock text-brand-core fs-4 me-2"></i>
                          <p className="text-grey-700 mb-0">
                            {drama.date.start}
                          </p>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                          <i className="bi bi-geo-alt text-brand-core fs-4 me-2"></i>
                          <p className="text-grey-700 mb-0">{drama.location}</p>
                        </div>
                        <div className="mt-auto">
                          <button
                            className="btn btn-outline-brand-core text-brand-core w-100 hover-bg-brand-core hover-text-white"
                            onClick={() => navigate(`/dramaInfo/${drama.id}`)}
                          >
                            參加
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShareModal />
    </div>
  );
}

export default AttendSuccess;
