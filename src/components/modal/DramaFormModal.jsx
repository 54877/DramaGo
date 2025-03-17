import axios from "axios";
import { useState, useEffect, useRef } from "react";
import NoteTagsModal from "./NoteTagsModal";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useSelector,useDispatch } from "react-redux";
import { changeLoadingState } from "../../redux/slice/loadingSlice"
import { pushMsg } from "../../redux/slice/toastSlice";
import Cookies from "js-cookie";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;
const uid = localStorage.getItem('uid');
const now = dayjs();
const pageUrl = window.location.href.replace("dramaList", "dramaInfo");

const DramaFormModal = ({ dramaFormRef, closeDramaForm, deleteDrama, modalMode, unitDrama, getDramas , unitShareDrama }) => {

    const noteModalRef = useRef(null);
    const noteModalInstance = useRef(null);
    const [isOpenNoteModal, setIsOpenNoteModal] = useState(false);
    const dispatch = useDispatch();

    // 功能：表單
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            genderTerm: '不限男女',
            ageTerm: '不限年齡',
            areaTerm: '不限居住地',
        },
        mode: 'onBlur',
    });

    const formSubmitRef = useRef(null);

    // 系統預設標籤
    const categoryTags = ['看電影', '看表演', '逛劇展', '買劇品', '上劇課', '劇本殺', '接劇龍', '聽劇透', '遊劇旅', '追影星'];
    const costTags = ['免費', 'AA制', '團主請客', '男生請客', '女生請客'];
    const genderTags = ['不限男女', '限男生', '限女生'];
    const ageTags = ['不限年齡', '限年齡'];
    const areaTags = ['不限居住地', '限居住地'];
    const city = useSelector(state=>state.defaultDataStore.city);
    

    // 用戶自輸入值
    const [imageUrl, setImageUrl] = useState('');
    const categoryTag = watch('category');
    const costTag = watch('cost');
    const genderTag = watch('genderTerm');
    const ageTag = watch('ageTerm');
    const areaTag = watch('areaTerm');
    const location = watch('location');
    const [selectedNoteTag, setSelectedNoteTag] = useState([]);
    const [imgStorage, setImgStorage] = useState('');
    const [imagesUrl, setImagesUrl] = useState([]);

    const handleImgInput = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        dispatch(changeLoadingState(true));
        try {
            const token = Cookies.get(`token`);
            
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${token}`
                }
            }
            const res = await axios.post(`${baseUrl}/api/${apiPath}/admin/upload`, formData, config);

            setImageUrl(res.data.imageUrl);
            dispatch(pushMsg({
                text: '已上傳圖片',
                status: 'success',
            }));
        } catch (err) {
            const message = err.response.data;
            dispatch(pushMsg({
                text: message.join('、'),
                status: 'failed',
            }));
        } finally {
            dispatch(changeLoadingState(false));
        };
    };
    // 功能：更多圖片
    const addImg = () => {
        const newImagesUrl = [...imagesUrl];
        newImagesUrl.push(imgStorage);
        setImagesUrl(newImagesUrl);
        setImgStorage('');
    };
    const deleteImg = (index) => {
        const newImagesUrl = [...imagesUrl];
        newImagesUrl.splice(index, 1);
        setImagesUrl(newImagesUrl);
    };

    // 功能：標籤modal
    const openNoteModal = () => {
        setIsOpenNoteModal(true);
        noteModalInstance.current.show();
    };

    const closeNoteModal = () => {
        setIsOpenNoteModal(false);
        noteModalInstance.current.hide();
    };

    const deleteNoteTags = (index) => {
        setSelectedNoteTag(prev => {
            const newNoteTags = [...prev];
            newNoteTags.splice(index, 1);
            return newNoteTags;
        });
    };
    // 複製網址
    const copyWebsite = async () => {
        try {
            await navigator.clipboard.writeText(`${pageUrl}/${unitShareDrama.id}`);
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

    // google地圖
    const generateMapUrl = (mapLocation) => {
        const encodedLocation = encodeURIComponent(mapLocation);
        return `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
    };

    const onSubmitForm = async (data) => {
        const { title, category, description, content, location, people, cost, genderTerm, ageTerm, areaTerm, ageMax, ageMin, city, startDate, endDate } = data;
        const newStartDate = dayjs(startDate).format('YYYY/MM/DD hh:mm A');
        const newEndDate = dayjs(endDate).format('YYYY/MM/DD hh:mm A');

        const updateData = {
            data: {
                title, //劇會名稱
                category, //劇會類型
                origin_price: 200, //參加劇會原價(支付給平台)
                price: 100, //參加劇會特價(支付給平台)
                unit: "次", //劇會單位
                description, //劇會連結註記
                content, //劇會詳情
                is_enabled: 1, //是否上架
                imageUrl, //劇會主圖
                imagesUrl, //劇會副圖
                uid,
                date: { start: startDate, end: endDate, },   //劇會時間
                location, //劇會地點
                people,   //劇會人數
                cost,     //劇會預估費用
                term: {  //劇會門檻
                    gender: genderTerm,
                    age: { condition: ageTerm, range: { min: ageMin || '', max: ageMax || '' } },
                    area: { condition: areaTerm, range: city || '' },
                },
                noteTag: selectedNoteTag,      //劇會標籤
                isFinish: 0,
                isHot: 0,
                during: dayjs(newEndDate).diff(dayjs(newStartDate), 'day') < 1 ? '1天內' : '2天以上',
                buildDate: now.format('YYYY/MM/DD hh:mm A'),
            }
        };
        const token = Cookies.get(`token`);
        const config = {
            headers: {
                Authorization: `${token}`
            }
        }
        if (modalMode === 'add') {
            dispatch(changeLoadingState(true));
            try {
                await axios.post(`${baseUrl}/api/${apiPath}/admin/product`, updateData , config);
                dispatch(pushMsg({
                    text: '已新增劇會',
                    status: 'success',
                }));
                reset();
                setImageUrl('');
                setSelectedNoteTag([]);
                setImagesUrl([]);
                closeDramaForm();
            } catch (err) {
                const message = err.response.data;
                message = Array.isArray(message) ? message : [message]
                dispatch(pushMsg({
                    text: message.join('、'),
                    status: 'failed',
                }));
            } finally {
                dispatch(changeLoadingState(false));
            };
        } else if (modalMode === 'edit') {
            dispatch(changeLoadingState(true));
            try {
                await axios.put(`${baseUrl}/api/${apiPath}/admin/product/${unitDrama.id}`, updateData, config);
                dispatch(pushMsg({
                    text: '已修改劇會內容',
                    status: 'success',
                }));
                getDramas();
                closeDramaForm();
            } catch (err) {
                const message = err.response.data;
                message = Array.isArray(message) ? message : [message]
                dispatch(pushMsg({
                    text: message.join('、'),
                    status: 'failed',
                }));
                console.log(err)
            } finally {
                dispatch(changeLoadingState(false));
            };
        }
    }


    // useEffect
    useEffect(() => {
        if (noteModalRef.current) {
            noteModalInstance.current = new Modal(noteModalRef.current);
        };
    }, []);

    useEffect(() => {
        if (modalMode === 'edit') {
            setImageUrl(unitDrama.imageUrl || '')
            setImagesUrl(unitDrama.imagesUrl || []);
            setSelectedNoteTag(unitDrama.noteTag || [])
            reset({
                ...unitDrama,
                genderTerm: unitDrama.term.gender,
                ageTerm: unitDrama.term.age.condition,
                ageMin: unitDrama.term.age.range.min,
                ageMax: unitDrama.term.age.range.max,
                areaTerm: unitDrama.term.area.condition,
                city: unitDrama.term.area.range,
                startDate: unitDrama.date.start,
                endDate: unitDrama.date.end,
            });
        } if (modalMode === 'add') {
            setImageUrl('');
            setImagesUrl([]);
            setSelectedNoteTag([]);
            reset('');
        }
    }, [modalMode, unitDrama, reset]);

    return (<>

        <div className="modal fade"
            style={{ ...(isOpenNoteModal && { filter: " brightness(30%)" }) }}
            tabIndex="-1" ref={dramaFormRef} >
            <div className="modal-dialog modal-md modal-fullscreen-md-down">
                <div className="modal-content">
                    <div className={` modal-header text-white 
                        ${modalMode === 'share' ?
                            'bg-brand-core' :
                            (modalMode === 'delete' ?
                                'bg-grey-600' :
                                (modalMode === 'add' ?
                                    'bg-brand-600' :
                                    'bg-brand-800'
                                ))}`}>
                        <h5 className="modal-title">
                            {`
                            ${modalMode === 'share' ?
                                    '分享劇會' :
                                    (modalMode === 'delete' ?
                                        '刪除劇會' :
                                        (modalMode === 'add' ?
                                            '新增劇會' : '編輯劇會'
                                        ))}`}
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            aria-label="Close"
                            onClick={closeDramaForm}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {
                            modalMode === 'share' ? (<>
                                <div className="card text-bg-dark">
                                    <div className="w-100" style={{ height: '360px' }}>
                                        <img src={unitShareDrama.imageUrl} className="object-fit" alt={unitShareDrama.title} />
                                    </div>
                                    <div className="card-img-overlay p-0 d-flex align-items-end">
                                        <div className="bg-brand-700 w-100 rounded-1">
                                            <h5 className="card-title p-3 ">{unitShareDrama.title}</h5>
                                        </div>
                                    </div>
                                </div>
                            </>
                            ) :
                                (modalMode === 'delete' ? (<>
                                    <div className="card text-bg-dark">
                                        <div className="w-100" style={{ height: '360px' }}>
                                            <img src={unitDrama.imageUrl} className="object-fit" alt={unitDrama.title} />
                                        </div>
                                        <div className="card-img-overlay p-0 d-flex align-items-end">
                                            <div className="bg-black w-100 rounded-1">
                                                <h5 className="card-title p-3 ">{unitDrama.title}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit(onSubmitForm)}
                                        ref={formSubmitRef}
                                    >
                                        {/* 劇會主圖 */}
                                        <div className="mb-10">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="text-brand-400">* &nbsp;</span>
                                                    <span className="h6">劇會主圖</span>
                                                    <label htmlFor="fileInput" className="form-label">
                                                        <i className="bi bi-plus-circle-fill ms-2 text-brand-600 fs-6"
                                                            style={{ cursor: 'pointer' }}></i>
                                                    </label>
                                                </div>
                                                <p className={errors.imageUrl ? 'text-danger' : ''}>
                                                    {errors.imageUrl && ('⛔' + `${errors.imageUrl.message}`)}
                                                </p>
                                            </div>
                                            <input
                                                {...register('imageUrl', modalMode === 'add' ? { required: '請上傳主圖' } : {})}
                                                name="imageUrl"
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                className="form-control"
                                                id="fileInput"
                                                style={{ display: 'none' }}
                                                onChange={handleImgInput}
                                            />
                                            {
                                                imageUrl &&
                                                <img src={imageUrl} alt="劇會主圖" className="my-3 object-fit" style={{ height: '250px' }} />
                                            }
                                        </div>

                                        {/* 劇會名稱 */}
                                        <div className="mb-10">
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="text-brand-400">* &nbsp;</span>
                                                    <label htmlFor="title" className="form-label h6">劇會名稱</label>
                                                </div>
                                                <p className={errors.title ? 'text-danger' : ''}>
                                                    {errors.title && ('⛔' + `${errors.title.message}`)}
                                                </p>
                                            </div>
                                            <input
                                                {...register('title', {
                                                    required: '請輸入名稱',
                                                    maxLength: {
                                                        value: 20,
                                                        message: '請勿超過20字',
                                                    },
                                                })}
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                placeholder="最多20字"
                                            />
                                        </div>

                                        {/* 劇會類型 */}
                                        <div className="mb-10">
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="text-brand-400">* &nbsp;</span>
                                                    <span className="h6">劇會類型</span>
                                                </div>
                                                <p className={errors.category ? 'text-danger' : ''}>
                                                    {errors.category && ('⛔' + `${errors.category.message}`)}
                                                </p>
                                            </div>
                                            {
                                                categoryTags.map((tag, index) =>
                                                    <a role="button" className="my-1 mx-1" key={index}>
                                                        <input
                                                            {...register('category', {
                                                                required: '請選擇一個類型',
                                                            })}
                                                            type="radio"
                                                            name="category"
                                                            className="btn-check"
                                                            value={tag}
                                                            id={`categoryTag-${tag}`}
                                                            checked={categoryTag === tag}
                                                        />
                                                        <label
                                                            className={`brandBtn-2-sm ${categoryTag === tag && 'active'}`}
                                                            htmlFor={`categoryTag-${tag}`}
                                                            style={{ cursor: 'pointer' }
                                                            }>{tag}</label>
                                                    </a>
                                                )
                                            }
                                        </div>

                                        {/* 劇會人數 */}
                                        <div className="mb-10">
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="text-brand-400">* &nbsp;</span>
                                                    <span className="h6">劇會人數</span>
                                                </div>
                                                <p className={errors.people ? 'text-danger' : ''}>
                                                    {errors.people && ('⛔' + `${errors.people.message}`)}
                                                </p>
                                            </div>
                                            <select
                                                {...register('people', {
                                                    required: '請選擇人數',
                                                    valueAsNumber: true,
                                                })}
                                                className="form-select"
                                                defaultValue=''>
                                                <option value='' disabled>人數包含自己</option>
                                                {
                                                    Array.from({ length: 9 }).map((option, index) =>
                                                        <option value={index + 2} key={index}>{index + 2}人</option>
                                                    )
                                                }
                                            </select>
                                        </div>

                                        {/* 劇會時間 */}
                                        <div className="mb-10">
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="text-brand-400">* &nbsp;</span>
                                                    <span className="h6">劇會時間</span>
                                                </div>
                                                <p className={(errors.startDate || errors.endDate) ? 'text-danger' : ''}>
                                                    {(errors.startDate || errors.endDate) && '⛔請選擇時間'}
                                                </p>
                                            </div>
                                            <div>
                                                <div className="input-group mb-3">
                                                    <input
                                                        {...register('startDate', {
                                                            required: true,
                                                        })}
                                                        type="datetime-local"
                                                        className="form-control"
                                                        placeholder="開始時間" />
                                                    <span className="input-group-text">~</span>
                                                    <input
                                                        {...register('endDate', {
                                                            required: true,
                                                        })}
                                                        type="datetime-local"
                                                        className="form-control"
                                                        placeholder="結束時間" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 劇會地點 */}
                                        <div className="mb-10">
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="text-brand-400">* &nbsp;</span>
                                                    <span className="h6">劇會地點</span>
                                                </div>
                                                <p className={errors.location ? 'text-danger' : ''}>
                                                    {errors.location && ('⛔' + `${errors.location.message}`)}
                                                </p>
                                            </div>
                                            <input
                                                {...register('location', {
                                                    required: '請輸入詳細地址或地標',
                                                })}
                                                name="location"
                                                type="text"
                                                className="form-control my-2"
                                                placeholder="請輸入詳細地址或地標"
                                            />
                                            <iframe
                                                src={generateMapUrl(location)}
                                                width="100%"
                                                height="300"
                                                style={{ border: 0, borderRadius: "8px" }}
                                                allowFullScreen=""
                                                loading="lazy"
                                                >
                                            </iframe>
                                        </div>

                                        {/* 劇會費用 */}
                                        <div className="mb-10">
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="text-brand-400">* &nbsp;</span>
                                                    <span className="h6">劇會費用</span>
                                                </div>
                                                <p className={errors.cost ? 'text-danger' : ''}>
                                                    {errors.cost && ('⛔' + `${errors.cost.message}`)}
                                                </p>
                                            </div>
                                            {
                                                costTags.map((tag, index) =>
                                                    <a role="button" className="my-1 mx-1" key={index}>
                                                        <input
                                                            {...register('cost', {
                                                                required: '請選擇費用',
                                                            })}
                                                            type="radio"
                                                            className="btn-check"
                                                            name="cost"
                                                            id={`costTag-${tag}`}
                                                            value={tag}
                                                            checked={costTag === tag}
                                                        />
                                                        <label
                                                            className={`brandBtn-2-sm ${costTag === tag && 'active'}`}
                                                            htmlFor={`costTag-${tag}`}
                                                            style={{ cursor: 'pointer' }}
                                                        >{tag}</label>
                                                    </a>
                                                )
                                            }
                                        </div>

                                        {/* 劇會條件 */}
                                        <div className="mb-10">
                                            <span className="h6 mb-2">設定跟團條件</span>
                                            {/* 性別 */}
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="h6 text-brand-600 me-3">性別</span>
                                                    {
                                                        genderTags.map((tag, index) =>
                                                            <a role="button" className="my-1 mx-1" key={index}>
                                                                <input
                                                                    {...register('genderTerm')}
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="genderTerm"
                                                                    id={`genderTag-${tag}`}
                                                                    value={tag}
                                                                    checked={genderTag === tag}
                                                                />
                                                                <label
                                                                    className={`brandBtn-2-sm ${genderTag === tag && 'active'}`}
                                                                    htmlFor={`genderTag-${tag}`}
                                                                    style={{ cursor: 'pointer' }}
                                                                >{tag}</label>
                                                            </a>
                                                        )
                                                    }
                                                </div>
                                            </div>

                                            {/* 年齡 */}
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="h6 text-brand-600 me-3">年齡</span>
                                                    {
                                                        ageTags.map(tag =>
                                                            <a role="button" className="my-1 mx-1" key={tag}>
                                                                <input
                                                                    {...register('ageTerm')}
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="ageTerm"
                                                                    id={`ageTag-${tag}`}
                                                                    value={tag}
                                                                    checked={ageTag === tag}
                                                                />
                                                                <label
                                                                    className={`brandBtn-2-sm ${ageTag === tag && 'active'}`}
                                                                    htmlFor={`ageTag-${tag}`}
                                                                    style={{ cursor: 'pointer' }}
                                                                >{tag}</label>
                                                            </a>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            {
                                                ageTag === '限年齡' && (<>

                                                    <div className="input-group mt-2 w-75 mx-auto">
                                                        <input
                                                            {...register('ageMin', {
                                                                required: '請輸入最低年齡',
                                                                valueAsNumber: true,
                                                                min: {
                                                                    value: 18,
                                                                    message: '最低年齡不得低於18歲',
                                                                }
                                                            })}
                                                            type="number"
                                                            className="form-control" placeholder="輸入最低年齡" />
                                                        <span className="input-group-text">~</span>
                                                        <input
                                                            {...register('ageMax', {
                                                                required: '請輸入最高年齡',
                                                                valueAsNumber: true,
                                                                min: {
                                                                    value: 18,
                                                                    message: '最高年齡不得低於18歲',
                                                                }
                                                            })}
                                                            type="number" className="form-control" placeholder="輸入最高年齡" />
                                                    </div>
                                                    <div className="w-75 mx-auto my-2">
                                                        <span className={`mx-1 ${(errors.ageMin) ? 'text-danger' : ''}`}>
                                                            {(errors.ageMin) && ('⛔' + `${errors.ageMin.message}`)}
                                                        </span>
                                                        <span className={`mx-1 ${(errors.ageMax) ? 'text-danger' : ''}`}>
                                                            {(errors.ageMax) && ('⛔' + `${errors.ageMax.message}`)}
                                                        </span>
                                                    </div>
                                                </>)
                                            }

                                            {/* 居住 */}
                                            <div className="my-1 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="h6 text-brand-600 me-3">居住</span>
                                                    {
                                                        areaTags.map(tag =>
                                                            <a role="button" className="my-1 mx-1" key={tag}>
                                                                <input
                                                                    {...register('areaTerm')}
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="areaTerm"
                                                                    id={`areaTag-${tag}`}
                                                                    value={tag}
                                                                    checked={areaTag === tag}
                                                                />
                                                                <label
                                                                    className={`brandBtn-2-sm ${areaTag === tag && 'active'}`}
                                                                    htmlFor={`areaTag-${tag}`}
                                                                    style={{ cursor: 'pointer' }}
                                                                >{tag}</label>
                                                            </a>
                                                        )
                                                    }
                                                </div>
                                                <p className={(errors.city) ? 'text-danger' : ''}>
                                                    {(errors.city) && ('⛔' + `${errors.city.message}`)}
                                                </p>
                                            </div>
                                            {
                                                areaTag === '限居住地' &&
                                                <select
                                                    {...register('city', {
                                                        required: '請選擇地區',
                                                    })}
                                                    className="form-select mt-2 w-75 mx-auto"
                                                    defaultValue=''>
                                                    <option value='' disabled>縣市地區</option>
                                                    {
                                                        city.map((tag, index) =>
                                                            <option value={tag} key={index}>{tag}</option>
                                                        )
                                                    }
                                                </select>
                                            }
                                        </div>

                                        {/* 劇會詳情 */}
                                        <div className="mb-10">
                                            <div className="h6 mb-3">
                                                <label htmlFor="content" className="form-label">劇會詳情</label>
                                                <textarea
                                                    {...register('content')}
                                                    className="form-control" id="content" rows="3"></textarea>
                                            </div>
                                        </div>

                                        {/* 更多圖片 */}
                                        <div className="mb-10">
                                            <div className="h6 mb-3 w-100">
                                                <label className="form-label">劇會照片分享</label>
                                                <div className="input-group mb-5">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="貼入圖片網址"
                                                        value={imgStorage || ''}
                                                        onChange={e => setImgStorage(e.target.value)}
                                                    />
                                                    {
                                                        imgStorage &&
                                                        <span
                                                            className="input-group-text bg-brand-600 text-white"
                                                            id="addImg"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={addImg}
                                                        >新增</span>
                                                    }
                                                </div>
                                                <div className="row row-cols-3 g-3">
                                                    {
                                                        imagesUrl.map((img, index) =>
                                                            <div className="col" key={img}>
                                                                <div className="position-relative w-100 mx-2" style={{ height: '150px' }}>
                                                                    <img src={img} alt={`附圖${index + 1}`}
                                                                        className="object-fit"
                                                                    />
                                                                    <i className="fs-4 bi bi-x-square-fill text-brand-600 position-absolute top-0 end-0"
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() => deleteImg(index)}
                                                                    ></i>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {/* 相關連結 */}
                                        <div className="mb-10">
                                            <div className="h6 mb-3">
                                                <label htmlFor="description" className="form-label">相關連結</label>
                                                <input
                                                    {...register('description')}
                                                    className="form-control" id="description"></input>
                                            </div>
                                        </div>

                                        {/* 劇會標籤 */}
                                        <div className="mb-10">
                                            <div className="mb-2">
                                                <span className="h6">劇會標籤</span>
                                                <i
                                                    className="bi bi-plus-circle-fill ms-2 text-brand-600 fs-6"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={openNoteModal}
                                                ></i>
                                            </div>
                                            {
                                                selectedNoteTag.map((tag, index) =>
                                                    <a role="button" className="my-1 mx-1 brandBtn-2-sm" key={tag}>
                                                        {tag}
                                                        <i
                                                            className="bi bi-x-circle-fill ms-2"
                                                            onClick={() => deleteNoteTags(index)}
                                                            style={{ cursor: 'pointer' }}
                                                        ></i>
                                                    </a>
                                                )
                                            }
                                        </div>
                                    </form>
                                ))
                        }
                    </div>
                    <div className="modal-footer">
                        {
                            modalMode === 'share' ? (<>
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={`${pageUrl}/${unitShareDrama.id}`}
                                />
                                <button
                                    type="button"
                                    className="btn brandBtn-1-lg w-100 text-white"
                                    onClick={copyWebsite}
                                >複製網址</button>
                            </>
                            ) : (modalMode === 'delete' ? (
                                <button
                                    type="button"
                                    className="btn btn-outline-grey-900 w-100 text-grey-900"
                                    onClick={() => deleteDrama(unitDrama.id)}
                                >刪除</button>
                            ) : (modalMode === 'edit' ? (
                                <button
                                    type="button"
                                    className="btn btn-brand-800 text-white rounded-pill w-100 "
                                    onClick={() => formSubmitRef.current.requestSubmit()}
                                >修改</button>
                            ) : (
                                <button
                                    type="button"
                                    className="brandBtn-1 w-100"
                                    onClick={() => formSubmitRef.current.requestSubmit()}
                                >發起</button>
                            )))
                        }
                    </div>
                </div>
            </div>
        </div>

        <NoteTagsModal
            noteModalRef={noteModalRef}
            closeNoteModal={closeNoteModal}
            setIsOpenNoteModal={setIsOpenNoteModal}
            selectedNoteTag={selectedNoteTag}
            setSelectedNoteTag={setSelectedNoteTag}
        />
    </>)

};

export default DramaFormModal;