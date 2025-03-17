import { useEffect, useState,useId } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = ({ filterDramas, setDramas, closeSearchOffcanvas, bar, phoneSearchState }) => {
    const searchId1 = useId();
    const searchId2 = useId();
    const [keyword, setKeyword] = useState('');
    const [isFirstRender, setIsFirstRender] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (location.pathname != '/dramaList') {
            navigate('/dramaList')
            setTimeout(find, 1500)
        } else {
            find();

        }
    };


    const find = () => {
        const newArr = filterDramas.filter(drama => drama.title.includes(keyword));
        setDramas(newArr);
        if (phoneSearchState == true) {
            closeSearchOffcanvas();
        }
    }

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        };
        if (setDramas && !keyword) {
            setDramas(filterDramas);
        };
    }, [keyword]);

    return bar ?
        (<>
            <div className="position-relative w-100">
                <form>
                    <label
                        htmlFor={searchId1}
                        className="form-label position-absolute top-50 end-0 translate-middle-y pe-4">
                        <button
                            type="submit"
                            className="btn"
                            style={{ "--bs-btn-border-color": "none" }}
                            onClick={handleSearchSubmit}
                        >
                            <i className="bi bi-search text-brand-core d-block"></i>
                        </button>
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-pill py-3 ps-6"
                        id={searchId1}
                        placeholder="搜尋劇會"
                        onChange={e => setKeyword(e.target.value)}
                        value={keyword}
                    />
                </form>
            </div>
        </>)
        : (<>
            <div className="mb-3 position-relative w-100">
                <form>
                    <label
                        htmlFor={searchId2}
                        className="form-label position-absolute top-50 end-0 translate-middle-y pe-4">
                        <button
                            type="submit"
                            className="btn"
                            style={{ "--bs-btn-border-color": "none" }}
                            onClick={handleSearchSubmit}
                        >
                            <i className="bi bi-search text-brand-core d-block"></i>
                        </button>
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-pill "
                        id={searchId2}
                        placeholder="搜尋劇會"
                        onChange={e => setKeyword(e.target.value)}
                        value={keyword}
                    />
                </form>
            </div>
        </>)
};

export default SearchBar;