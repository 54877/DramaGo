import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_URL = import.meta.env.VITE_APP_API_PATH;

function AttendModal({ dramaId, userId }) {
  const [peopleCount, setPeopleCount] = useState(1);
  const [ticketCount, setTicketCount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const modal = document.getElementById("exampleModal");

    const handleModalHidden = () => {
      setPeopleCount(1);
      setTicketCount(1);
    };

    modal.addEventListener("hidden.bs.modal", handleModalHidden);

    return () => {
      modal.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, []);

  const handleClose = () => {
    setPeopleCount(1);
    setTicketCount(1);
  };

  const handleConfirm = async () => {
    try {
      // 先發送 cart 請求
      const cartResponse = await axios.post(`${BASE_URL}/api/${API_URL}/cart`, {
        data: {
          product_id: dramaId,
          qty: peopleCount,
        },
      });

      if (cartResponse.data.success) {
        // 再發送 order 請求
        const orderResponse = await axios.post(
          `${BASE_URL}/api/${API_URL}/order`,
          {
            data: {
              user: {
                name: "test",
                email: "test@gmail.com",
                tel: "0912346768",
                address: "kaohsiung",
              },
              message: "這是留言",
            },
          }
        );

        if (orderResponse.data.success) {
          // 獲取原本的資料
          const articleResponse = await axios.get(
            `${BASE_URL}/api/${API_URL}/article/${userId}`
          );

          // 最後發送 article 更新請求，使用原本的資料
          await axios.put(
            `${BASE_URL}/api/${API_URL}/admin/article/${userId}`,
            {
              data: {
                ...articleResponse.data.article,
                dramaId: dramaId,
              },
            }
          );
          // 清空狀態
          setPeopleCount(1);
          setTicketCount(1);

          // 關閉 modal
          const modal = document.getElementById("exampleModal");
          const modalInstance = Modal.getInstance(modal);
          modalInstance.hide();

          navigate(`/attendSuccess/${dramaId}`);
        }
      }
    } catch (error) {
      console.error("加入購物車失敗：", error);
    }
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fs-2">完成資料提交</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* 人數調整 */}
            <div className="mb-3">
              <label className="form-label">是否攜伴?</label>
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={peopleCount}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setPeopleCount(peopleCount + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* 票數調整 */}
            <div className="mb-3">
              <label className="form-label">需要票數: ($400/張)</label>
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={ticketCount}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setTicketCount(ticketCount + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleClose}
            >
              關閉
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendModal;
