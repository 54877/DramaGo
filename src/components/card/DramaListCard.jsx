import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const DramaListCard = ({
  drama,
  loveDramas,
  handleLoveClick,
  openDramaForm,
  setModalMode,
  setUnitShareDrama,
  member,
  showAlert,
}) => {
  const randomNumber = Math.floor(Math.random() * 10);
  const startDate = dayjs(drama.date.start);
  const endDate = dayjs(drama.date.end);
  const token = Cookies.get(`token`);

  return (
    <>
      <div className="col">
        <div className="card border-0 rounded-3 shadow position-relative h-100">
          <div className="p-4 rounded-2">
            <div
              className="overflow-hidden cursor w-100"
              style={{ height: "300px" }}
            >
              <img
                src={drama.imageUrl}
                className="object-fit rounded-2 img-scale "
                alt={drama.title}
              />
            </div>
          </div>
          <div className="badge-group position-absolute d-flex flex-column">
            {drama.people - randomNumber === 1 ? (
              <span className="fs-6 badge bg-brand-700 py-2 px-5 rounded-pill rounded-start my-1">
                差一人出團
              </span>
            ) : (
              drama.people - randomNumber <= 0 && (
                <span className="fs-6 badge bg-brand-700 py-2 px-5 rounded-pill rounded-start my-1">
                  滿團
                </span>
              )
            )}
            {randomNumber <= 3 && (
              <span className="fs-6 badge bg-brand-700 py-2 px-5 rounded-pill rounded-start my-1">
                三天內到期
              </span>
            )}
          </div>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{drama.title}</h5>
            <div className="my-4">
              <button type="button" className="brandBtn-4 mx-1 mb-2">
                {drama.category}
              </button>
              <button type="button" className="brandBtn-4 mx-1 mb-2">
                {drama.cost}
              </button>
              <button type="button" className="brandBtn-4 mx-1 mb-2">
                {drama.term.gender}
              </button>
              <button type="button" className="brandBtn-4 mx-1 mb-2">
                {drama.term.age.condition}
              </button>
              <button type="button" className="brandBtn-4 mx-1 mb-2">
                {drama.term.area.condition}
              </button>
            </div>
            <p className="card-text">
              <i className="bi bi-clock text-grey-300 me-4 mb-3"></i>
              <time dateTime={drama.date.start} className="fs-b2 text-grey-700">
                {startDate.format("YYYY/MM/DD hh:mm A")}~
                {endDate.format("YYYY/MM/DD hh:mm A")}
              </time>
            </p>
            <p className="card-text">
              <i className="bi bi-geo-alt text-grey-300 me-4 mb-3"></i>
              <span className="text-grey-700">{drama.location}</span>
            </p>
            <p className="card-text">
              <i className="bi bi-people text-grey-300 me-4 mb-3"></i>
              <span className="text-grey-700 me-4">
                欲揪人數｜<span>{drama.people}</span>
              </span>
              <span className="text-grey-700">
                已跟團者｜<span>{randomNumber}</span>
              </span>
            </p>
            <div className="mt-auto">
              <hr />
              <div className="d-flex justify-content-between">
                <Link
                  to={`/profile/${member && member.id}`}
                  role="button"
                  className="d-flex align-items-center"
                >
                  <div className="avatar me-2">
                    <img
                      src={member && member.image}
                      alt="頭像"
                      className="object-fit rounded-circle"
                    />
                  </div>
                  <div className="d-flex flex-column">
                    <span className="h6">{member && member.author}</span>
                    <span className="text-grey-400 fs-c">揪團主</span>
                  </div>
                </Link>
                <div className="d-flex align-items-center">
                  {/* 最愛按鈕 */}
                  <button
                    type="button"
                    className="btn p-0"
                    style={{ "--bs-btn-border-color": "none" }}
                    onClick={() => {
                      if (token) {
                        handleLoveClick(drama.id);
                      } else {
                        showAlert();
                      }
                    }}
                  >
                    <i
                      className={`bi text-brand-core fs-2 mx-1 ${
                        loveDramas.some((item) => item.product.id === drama.id)
                          ? "bi-bookmark-heart-fill"
                          : "bi-bookmark-heart"
                      }`}
                    ></i>
                  </button>

                  {/* 分享按鈕 */}
                  <button
                    type="button"
                    className="btn"
                    style={{ "--bs-btn-border-color": "none" }}
                    onClick={() => {
                      setUnitShareDrama(drama);
                      setModalMode("share");
                      openDramaForm();
                    }}
                  >
                    <span className="material-symbols-rounded text-brand-core fs-2 mx-1 cursor">
                      share
                    </span>
                  </button>

                  {/* 查看按鈕 */}
                  <Link to={`/dramaInfo/${drama.id}`}>
                    <button type="button" className="brandBtn-1-lg">
                      劇會內容
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DramaListCard;
