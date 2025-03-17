import { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/scss/pages/_dramaInfo.scss";
import avatarImage from "../../assets/images/Frame 1000005391.png";
import { useNavigate, useParams } from "react-router-dom";
import AttendModal from "../../components/modal/AttendModal";
import ShareModal from "../../components/modal/ShareModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import Breadcrumb from "../../components/Breadcrumb";
import "swiper/css";
import "swiper/css/free-mode";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_URL = import.meta.env.VITE_APP_API_PATH;

const DramaInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dramaData, setDramaData] = useState({
    title: "",
    participants: [
      {
        image: avatarImage,
        name: "主辦人",
        status: "Host",
      },
    ],
    imageUrl: "",
    content: "",
    noteTag: [],
    imagesUrl: [],
    comments: [],
    date: { start: "" },
    location: "",
    url: "",
    people: 0,
  });
  const [commentText, setCommentText] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userId, setUserId] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [commentImages, setCommentImages] = useState({});
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [remainingSpots, setRemainingSpots] = useState(0);
  const maxLength = 1000;

  //麵包屑變數
  const pageLink = [
    {
      name: `首頁`,
      link: `/`,
    },
    {
      name: `劇會總覽`,
      link: `/dramaList`,
    },
    {
      name: `${dramaData.title}`,
      link: `/dramaInfo`,
    },
  ];


  const generateMapUrl = (location) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
  };

  // 獲取人員列表
  const getArticles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_URL}/articles`);
      const articleIds = res.data.articles.map((article) => article.id);
      // 隨機選擇一個 ID
      const randomIndex = Math.floor(Math.random() * articleIds.length);
      const selectedUserId = articleIds[randomIndex];
      setUserId(selectedUserId);

      // 獲取用戶信息
      const userRes = await axios.get(
        `${BASE_URL}/api/${API_URL}/article/${selectedUserId}`
      );

      setUserImage(userRes.data.article.image);
      setUserName(userRes.data.article.author);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  // 檢查是否已收藏
  useEffect(() => {
    if (dramaData) {
      const bookmarkedItems = JSON.parse(
        localStorage.getItem("bookmarkedItems") || "[]"
      );
      setIsBookmarked(bookmarkedItems.includes(id));
    }
  }, [dramaData, id]);

  // 處理收藏功能
  const handleBookmark = () => {
    if (!dramaData) return;

    const bookmarkedItems = JSON.parse(
      localStorage.getItem("bookmarkedItems") || "[]"
    );
    const newBookmarkedItems = isBookmarked
      ? bookmarkedItems.filter((itemId) => itemId !== id)
      : [...bookmarkedItems, id];

    localStorage.setItem("bookmarkedItems", JSON.stringify(newBookmarkedItems));
    setIsBookmarked(!isBookmarked);
  };

  // 獲取留言作者頭像
  const getCommentUserImage = async (userId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/${API_URL}/article/${userId}`
      );
      setCommentImages((prev) => ({
        ...prev,
        [userId]: res.data.article.image,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // 取得聚會資料
  const getDramaData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_URL}/product/${id}`);
      // 確保 participants 有值
      const productData = {
        ...res.data.product,
        participants: res.data.product.participants || [
          {
            image: avatarImage,
            name: "主辦人",
            status: "Host",
          },
        ],
      };
      setDramaData(productData);
      // 獲取所有留言作者和回覆作者的頭像
      if (res.data.product.comments) {
        res.data.product.comments.forEach((comment) => {
          // 獲取留言作者頭像
          if (comment.user) {
            getCommentUserImage(comment.user);
          }
          // 獲取回覆作者頭像
          if (comment.replies) {
            comment.replies.forEach((reply) => {
              if (reply.user) {
                getCommentUserImage(reply.user);
              }
            });
          }
        });
      }
      console.log("聚會資料：", res.data.product);
    } catch (error) {
      console.log(error);
      alert("此聚會不存在");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  useEffect(() => {
    getDramaData();
  }, [id]);

  // 計算剩餘名額
  const calculateRemainingSpots = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/${API_URL}/orders`);
      const orders = response.data.orders;
      console.log("訂單資料：", orders);

      // 找出當前戲劇的訂單
      const dramaOrders = orders.filter((order) => {
        // 遍歷訂單中的所有產品
        return Object.values(order.products).some(
          (product) => product.product.id === id
        );
      });

      // 計算總人數和已訂購數量
      const totalPeople = dramaData?.people || 0;
      const totalOrdered = dramaOrders.reduce((sum, order) => {
        // 遍歷訂單中的所有產品，找出當前戲劇的數量
        const dramaProduct = Object.values(order.products).find(
          (product) => product.product.id === id
        );
        return sum + (dramaProduct ? dramaProduct.qty : 0);
      }, 0);

      // 計算剩餘名額
      setRemainingSpots(totalPeople - totalOrdered);
    } catch (error) {
      console.error("獲取訂單失敗：", error);
    }
  };

  // 當 dramaData 改變時重新計算剩餘名額
  useEffect(() => {
    if (dramaData) {
      calculateRemainingSpots();
    }
  }, [dramaData]);

  const handleCommentChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setCommentText(text);
    }
  };

  const handlePublishComment = async () => {
    if (!commentText.trim()) {
      alert("請輸入留言內容");
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/${API_URL}/admin/product/${id}`,
        {
          data: {
            ...dramaData,
            comments: [
              ...(dramaData.comments || []),
              {
                commentId: Date.now().toString(),
                content: commentText,
                user: userId,
                userName: userName,
                time: new Date().toLocaleDateString(),
                replies: [],
              },
            ],
          },
        }
      );

      if (response.status === 200) {
        setCommentText("");
        getDramaData();
      }
    } catch (error) {
      console.error("發布評論時出錯：", error);
      alert("留言發布失敗，請稍後再試");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/${API_URL}/admin/product/${id}`,
        {
          data: {
            ...dramaData,
            comments: dramaData.comments.filter(
              (comment) => comment.commentId !== commentId
            ),
          },
        }
      );

      if (response.status === 200) {
        getDramaData();
      }
    } catch (error) {
      console.error("刪除評論時出錯：", error);
      alert("刪除留言失敗，請稍後再試");
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/${API_URL}/admin/product/${id}`,
        {
          data: {
            ...dramaData,
            comments: dramaData.comments.map((comment) => {
              if (comment.commentId === commentId) {
                return {
                  ...comment,
                  replies: comment.replies.filter(
                    (reply) => reply.replyId !== replyId
                  ),
                };
              }
              return comment;
            }),
          },
        }
      );

      if (response.status === 200) {
        getDramaData();
      }
    } catch (error) {
      console.error("刪除回覆時出錯：", error);
      alert("刪除回覆失敗，請稍後再試");
    }
  };

  const handleReplyChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setReplyText(text);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const handlePublishReply = async (commentId) => {
    if (!replyText.trim()) {
      alert("請輸入回覆內容");
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/${API_URL}/admin/product/${id}`,
        {
          data: {
            ...dramaData,
            comments: dramaData.comments.map((comment) => {
              if (comment.commentId === commentId) {
                return {
                  ...comment,
                  replies: [
                    ...(comment.replies || []),
                    {
                      replyId: Date.now().toString(),
                      content: replyText,
                      user: userId,
                      userName: userName,
                      time: new Date().toLocaleDateString(),
                    },
                  ],
                };
              }
              return comment;
            }),
          },
        }
      );

      if (response.status === 200) {
        setReplyText("");
        setReplyingTo(null);
        getDramaData();
      }
    } catch (error) {
      console.error("發布回覆時出錯：", error);
      alert("回覆發布失敗，請稍後再試");
    }
  };

  return (
    <>
      <div className="bg-brand-50">
        <div className="container custom-container">
          {dramaData && (
            <div className="row" key={dramaData.id}>
              <div className="col-12">
                <div className="drama-info__title-section mb-md-10 mb-6">
                  <p className="d-none d-md-block mb-6 ">
                    <Breadcrumb pageLink={pageLink} />
                  </p>
                  <p className="text-grey-950 fs-md-2 fs-5 fw-semibold mb-6">
                    {dramaData.title}
                  </p>
                  <p className="mb-4">
                    <img
                      src={dramaData.participants?.[0]?.image || avatarImage}
                      alt="發起者"
                      width="40"
                      height="40"
                      className="me-4"
                      style={{ borderRadius: "1000px" }}
                    />
                    <span className="fw-semibold poppins-font">
                      {dramaData.participants?.[0]?.name || "主辦人"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-md-8 col-12 order-md-1 order-2 ">
                <img
                  src={dramaData.imageUrl}
                  alt="主圖"
                  className="w-100 mb-md-12 mb-8 "
                  style={{ borderRadius: "20px" }}
                />
                <p className="mb-8" style={{ whiteSpace: "pre-line" }}>
                  {dramaData.content}
                </p>
                <div className="d-inline-flex gap-2 mb-md-12 mb-8">
                  {dramaData.noteTag.map((tag) => (
                    <button key={tag} type="button" className="btn tag">
                      {tag}
                    </button>
                  ))}
                </div>

                <div
                  className="attendent pb-8 drama-info__divider"
                  style={{ borderBottom: "1px solid #FFCA88" }}
                >
                  <div className="justify-content-between d-flex mb-8">
                    <p className="fw-semibold">
                      與會者({dramaData.participants?.length || 0})
                    </p>
                  </div>
                  <div style={{ marginTop: "32px" }}>
                    <Swiper
                      modules={[FreeMode]}
                      spaceBetween={8}
                      slidesPerView="auto"
                      freeMode={true}
                      style={{
                        width: "100%",
                        padding: "24px 0 0 0",
                      }}
                    >
                      {dramaData.participants?.[0] && (
                        <SwiperSlide
                          style={{
                            width: "auto",
                            height: "auto",
                          }}
                        >
                          <div className="attendent-card">
                            <div className="decorative-label">Host</div>
                            <img
                              src={
                                dramaData.participants[0].image || avatarImage
                              }
                              alt="頭像"
                              className="card-img"
                              width="40"
                              height="40"
                              style={{ borderRadius: "1000px" }}
                            />
                            <p className="card-text text-grey-950 fw-semibold">
                              {dramaData.participants[0].name || "主辦人"}
                            </p>
                            <p className="card-text fs-12 text-brand-500">
                              {dramaData.participants[0].status || "Host"}
                            </p>
                          </div>
                        </SwiperSlide>
                      )}
                      {dramaData.participants?.slice(1).map((member, index) => (
                        <SwiperSlide
                          key={index}
                          style={{
                            width: "auto",
                            height: "auto",
                          }}
                        >
                          <div className="attendent-card">
                            <img
                              src={member.image || avatarImage}
                              alt="頭像"
                              className="card-img"
                              width="40"
                              height="40"
                              style={{ borderRadius: "1000px" }}
                            />
                            <p className="card-text text-grey-950 fw-semibold">
                              {member.name || "參與者"}
                            </p>
                            <p className="card-text fs-12 text-brand-500">
                              {member.status || "成員"}
                            </p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>

                <div
                  className="photos pb-8 mt-12 drama-info__divider"
                  style={{ borderBottom: "1px solid #FFCA88" }}
                >
                  <div className="justify-content-between d-flex mb-4">
                    <p className="fw-semibold">
                      照片({dramaData.imagesUrl.length})
                    </p>
                  </div>
                  <Swiper
                    modules={[FreeMode]}
                    spaceBetween={16}
                    slidesPerView="auto"
                    freeMode={true}
                    style={{
                      width: "100%",
                    }}
                  >
                    {dramaData.imagesUrl.map((image, index) => (
                      <SwiperSlide
                        key={index}
                        style={{
                          width: "auto",
                          height: "auto",
                        }}
                      >
                        <img
                          src={image}
                          alt={`聚會照片${index + 1}`}
                          className="sub-images"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="comment mt-12">
                  <div className="justify-content-between d-flex mb-4">
                    <p className="fw-semibold">
                      留言({dramaData.comments?.length || 0})
                    </p>
                  </div>
                  <div className="comment-board px-md-8 px-4">
                    {dramaData.comments?.map((comment, index) => (
                      <div
                        key={comment.commentId}
                        className="comment-content py-md-8 py-4 drama-info__comment-content"
                        style={{ borderBottom: "1px solid white" }}
                      >
                        <div className="message d-flex flex-column flex-md-row">
                          <div className="message-header">
                            <img
                              src={commentImages[comment.user] || avatarImage}
                              alt="留言人"
                              width="40"
                              height="40"
                              style={{ borderRadius: "1000px" }}
                            />
                            <p>{comment.userName}</p>
                          </div>
                          <div className="message-content-wrapper d-flex flex-column flex-md-row justify-content-between">
                            <div
                              className="message-content"
                              style={{ fontSize: "14px" }}
                            >
                              {comment.content}
                            </div>
                            <div className="time d-flex align-items-center gap-6 mt-2">
                              <p>{comment.time}</p>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleReply(comment.commentId);
                                }}
                              >
                                回覆
                              </a>
                              {comment.user === userId && (
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteComment(comment.commentId);
                                  }}
                                  style={{ color: "red" }}
                                >
                                  刪除
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {comment.replies && comment.replies.length > 0 && (
                          <div className="replies pt-5 d-flex flex-column">
                            {comment.replies.map((reply, index) => (
                              <div
                                key={reply.replyId}
                                className="message d-flex flex-column flex-md-row"
                              >
                                <div className="message-header">
                                  <img
                                    src={
                                      commentImages[reply.user] || avatarImage
                                    }
                                    alt="留言人"
                                    width="40"
                                    height="40"
                                    style={{ borderRadius: "1000px" }}
                                  />
                                  <p>{reply.userName}</p>
                                </div>
                                <div className="d-flex flex-column flex-md-row justify-content-between w-100">
                                  <div
                                    className="message-content"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {reply.content}
                                  </div>
                                  <div className="time d-flex align-items-center gap-6 mt-2">
                                    <p>{reply.time}</p>
                                    <a href="#">回覆</a>
                                    {reply.user === userId && (
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDeleteReply(
                                            comment.commentId,
                                            reply.replyId
                                          );
                                        }}
                                        style={{ color: "red" }}
                                      >
                                        刪除
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="comment-textarea py-md-8 py-4">
                      <div className="input-area">
                        <div className="message-header">
                          <img
                            src={userImage || avatarImage}
                            alt="留言人"
                            width="40"
                            height="40"
                            style={{ borderRadius: "1000px" }}
                          />
                        </div>
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            placeholder={
                              replyingTo ? "請輸入回覆內容" : "請輸入留言內容"
                            }
                            id="floatingTextarea2"
                            value={replyingTo ? replyText : commentText}
                            onChange={
                              replyingTo
                                ? handleReplyChange
                                : handleCommentChange
                            }
                            maxLength={maxLength}
                          ></textarea>
                          <label htmlFor="floatingTextarea2">
                            {replyingTo ? "請輸入回覆內容" : "請輸入留言內容"}
                          </label>
                          <div className="character-count">
                            {(replyingTo ? replyText : commentText).length}/
                            {maxLength}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end gap-2">
                        {replyingTo && (
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                          >
                            取消
                          </button>
                        )}
                        <button
                          className="publish-btn"
                          onClick={
                            replyingTo
                              ? () => handlePublishReply(replyingTo)
                              : handlePublishComment
                          }
                        >
                          {replyingTo ? "發布回覆" : "發布"}
                          <i className="bi bi-send ms-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-12 order-md-2 order-1 mb-6">
                <div className="event-info d-flex flex-column gap-4">
                  <div className="d-flex gap-4">
                    <i className="bi bi-clock text-brand-core fs-4"></i>
                    <p className="fw-semibold fs-14 text-grey-700">
                      {dramaData.date.start}
                    </p>
                  </div>

                  {dramaData.url ? (
                    <div className="d-flex gap-4">
                      <i className="bi bi-globe2 text-brand-core fs-4"></i>
                      <p className="fw-semibold fs-14 text-grey-700">
                        {dramaData.url}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="d-flex gap-4">
                    <i className="bi bi-geo-alt text-brand-core fs-4"></i>
                    <p className="fw-semibold fs-14 text-grey-700">
                      {dramaData.location}
                    </p>
                  </div>
                  <div className="drama-info__map d-none d-md-block">
                    <iframe
                      src={generateMapUrl(dramaData.location)}
                      width="100%"
                      height="300"
                      style={{ border: 0, borderRadius: "8px" }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                  <div className="d-flex w-100 gap-2 align-items-center">
                    <i
                      className={`bi ${
                        isBookmarked ? "bi-bookmark-fill" : "bi-bookmark"
                      } text-brand-core fs-4`}
                      style={{ cursor: "pointer" }}
                      onClick={handleBookmark}
                    ></i>
                    <button
                      type="button"
                      className="share-btn ms-auto"
                      data-bs-toggle="modal"
                      data-bs-target="#shareModal"
                    >
                      分享
                    </button>
                    <button
                      type="button"
                      className="attend-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      參加
                    </button>
                  </div>
                  <p
                    className="ms-auto drama-info__available-slots"
                    style={{
                      fontWeight: 400,
                      width: "154px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    還有{remainingSpots}個名額
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AttendModal
        dramaId={id}
        remainingSpots={remainingSpots}
        dramaData={dramaData}
        userId={userId}
      />
      <ShareModal />
    </>
  );
};

export default DramaInfo;
