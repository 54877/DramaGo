import React from "react";
import { useDispatch } from "react-redux";
import { pushMsg } from "../../redux/slice/toastSlice";

const ShareModal = () => {

  const dispatch = useDispatch();
  
  // 取得當前頁面網址
  const pageUrl = window.location.href;

  const socialMedias = [
    {
      name: "Facebook",
      icon: "bi bi-facebook",
      color: "#1877F2",
    },
    {
      name: "Line",
      icon: "bi bi-line",
      color: "#00B900",
    },
    {
      name: "Twitter",
      icon: "bi bi-twitter-x",
      color: "#000000",
    },
    {
      name: "Instagram",
      icon: "bi bi-instagram",
      color: "#E4405F",
    },
  ];

  const handleShare = (platform) => {
    // 這裡可以實作實際的分享功能
    console.log(`分享到 ${platform}`);
  };

  // 取得當前
  const copyWebsite = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl);
            dispatch(pushMsg({
                text: '已複製網址',
                status: 'success',
            }));
        } catch (err) {
            dispatch(pushMsg({
                text: '複製失敗',
                status: 'failed',
            }));
        }
    };
    

  return (
    <div
      className="modal fade"
      id="shareModal"
      tabIndex="-1"
      aria-labelledby="shareModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title fs-5" id="shareModalLabel">
              分享活動
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-center">
            <div className="d-flex justify-content-center gap-4 mb-4">
              {socialMedias.map((social) => (
                <button
                  key={social.name}
                  className="btn btn-light rounded-circle p-3"
                  onClick={() => handleShare(social.name)}
                  style={{
                    width: "60px",
                    height: "60px",
                  }}
                >
                  <i
                    className={social.icon}
                    style={{
                      color: social.color,
                      fontSize: "24px",
                    }}
                  ></i>
                </button>
              ))}
            </div>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                defaultValue={pageUrl}
                readOnly
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={copyWebsite}
              >
                複製
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
