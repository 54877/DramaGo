import { useEffect,useId,useState } from "react";
import { useForm,useWatch } from "react-hook-form";


const TagsFilter = ({filterDramas,setDramas,dramaState}) => {
    const [tagFilter,setTagFilter] = useState([]);
    const uniqueId = useId();
    // 功能：表單
    const {
        register,
        watch,
        control,
    } = useForm({
        defaultValues:{
            category:'全部',
            day:'全部',
            cost:'全部',
            genderTerm:'全部',
            ageTerm:'全部',
            areaTerm:'全部',
            state:'全部',
        },
    });

    const watchForm = useWatch({
        control,
    });
    

    // 用戶輸入值
    const categoryTag = watch('category');
    const dayTag = watch('day');
    const costTag = watch('cost');
    const genderTag = watch('genderTerm');
    const ageTag = watch('ageTerm');
    const areaTag = watch('areaTerm');
    
    // 系統標籤
    const categoryTags = ['全部','看電影','看表演','逛劇展','買劇品','上劇課','劇本殺','接劇龍','聽劇透','遊劇旅','追影星'];
    const dayTags = ['全部','1天內','2天以上'];
    const costTags = ['全部','免費','AA制','團主請客','男生請客','女生請客'];
    const genderTags = ['全部','不限男女','限男生','限女生'];
    const ageTags = ['全部','不限年齡','限年齡'];
    const areaTags = ['全部','不限居住地','限居住地'];

    // 複選標籤劇會篩選
    const dramaFilter = () => {
        const newData = filterDramas.filter(drama=>{           
            const {category,cost,during} = drama;
            const {gender,age:{condition:ageCondition},area:{condition:areaCondition}} = drama.term;
            const dramaTagsArr = [category,cost,during,gender,ageCondition,areaCondition];
            return tagFilter.every(item => dramaTagsArr.includes(item))
        })
        setDramas(newData);
    };

        useEffect(() => {
        const arr = Object.values(watchForm).filter(item=>item !== '全部');
        setTagFilter(arr);
    }, [watchForm]);

    useEffect(()=>{
        dramaFilter();        
    },[tagFilter]);


    return(<>
    <form>
        <div className="mt-8 mb-4">
            <span className="h5 mb-4">劇會類型</span>
            <br />
            {
                categoryTags.map((tag,index)=>
                    <a role="button" className="my-1 mx-1" key={index}>
                        <input
                        {...register('category')}
                        type="radio"
                        name="category" 
                        className="btn-check"
                        value={tag}
                        id={`${uniqueId}-dramaCategoryTag-${tag}`}
                        checked={categoryTag===tag}
                        />
                        <label
                        className={`brandBtn-3 ${categoryTag===tag&&'active'}`} 
                        htmlFor={`${uniqueId}-dramaCategoryTag-${tag}`}
                        style={{cursor:'pointer'}}
                        >{tag}</label>
                    </a>
                )
            }
        </div>
        {
            dramaState==='onGoing'&&
            <div className="my-4">
                <span className="h5 mb-4 ">劇會時間</span>
                <br />
                {
                    dayTags.map((tag,index)=>
                        <a role="button" className="my-1 mx-1" key={index}>
                            <input
                            {...register('day')}
                            type="radio"
                            name="day" 
                            className="btn-check"
                            value={tag}
                            id={`${uniqueId}-dramaDayTag-${tag}`}
                            checked={dayTag===tag}
                            />
                            <label
                            className={`brandBtn-3 ${dayTag===tag&&'active'}`} 
                            htmlFor={`${uniqueId}-dramaDayTag-${tag}`}
                            style={{cursor:'pointer'}}
                            >{tag}</label>
                        </a>
                    )
                }
            </div>
        }
        <div className="my-4">
            <span className="h5 mb-4">劇會費用</span>
            <br />
            {
                costTags.map((tag,index)=>
                    <a role="button" className="my-1 mx-1" key={index}>
                        <input
                        {...register('cost')}
                        type="radio"
                        name="cost" 
                        className="btn-check"
                        value={tag}
                        id={`${uniqueId}-dramaCostTag-${tag}`}
                        checked={costTag===tag}
                        />
                        <label
                        className={`brandBtn-3 ${costTag===tag&&'active'}`} 
                        htmlFor={`${uniqueId}-dramaCostTag-${tag}`}
                        style={{cursor:'pointer'}}
                        >{tag}</label>
                    </a>
                )
            }
        </div>
        <div className="my-4">
            <span className="h5 mb-4">劇會條件</span>
            <br />
            <div className="my-3">
                <span className="mb-1 d-block">性別</span>
                {
                    genderTags.map((tag,index)=>
                        <a role="button" className="my-1 mx-1" key={index}>
                            <input
                            {...register('genderTerm')}
                            type="radio"
                            name="genderTerm" 
                            className="btn-check"
                            value={tag}
                            id={`${uniqueId}-dramaGenderTag-${tag}`}
                            checked={genderTag===tag}
                            />
                            <label
                            className={`brandBtn-3 ${genderTag===tag&&'active'}`} 
                            htmlFor={`${uniqueId}-dramaGenderTag-${tag}`}
                            style={{cursor:'pointer'}}
                            >{tag}</label>
                        </a>
                    )
                }
            </div>
            <div className="my-3">
                <span className="mb-1 d-block">年齡</span>
                {
                    ageTags.map((tag,index)=>
                        <a role="button" className="my-1 mx-1" key={index}>
                            <input
                            {...register('ageTerm')}
                            type="radio"
                            name="ageTerm" 
                            className="btn-check"
                            value={tag}
                            id={`${uniqueId}-dramaAgeTag-${tag}`}
                            checked={ageTag===tag}
                            />
                            <label
                            className={`brandBtn-3 ${ageTag===tag&&'active'}`} 
                            htmlFor={`${uniqueId}-dramaAgeTag-${tag}`}
                            style={{cursor:'pointer'}}
                            >{tag}</label>
                        </a>
                    )
                }
            </div>
            <div className="my-3">
                <span className="mb-1 d-block">居住</span>
                {
                    areaTags.map((tag,index)=>
                        <a role="button" className="my-1 mx-1" key={index}>
                            <input
                            {...register('areaTerm')}
                            type="radio"
                            name="areaTerm" 
                            className="btn-check"
                            value={tag}
                            id={`${uniqueId}-dramaAreaTag-${tag}`}
                            checked={areaTag===tag}
                            />
                            <label
                            className={`brandBtn-3 ${areaTag===tag&&'active'}`} 
                            htmlFor={`${uniqueId}-dramaAreaTag-${tag}`}
                            style={{cursor:'pointer'}}
                            >{tag}</label>
                        </a>
                    )
                }
            </div>
        </div>
    </form>
    
    </>)
};

export default TagsFilter;