import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";




const Loading = () => {
    const isLoading = useSelector((state)=>state.loadingStore.isLoading);
    
    return(<>
    {
        isLoading&&
        <div className="dramaLoading d-flex justify-content-center align-items-center">
            <ClipLoader
            color={'#fff'}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
            />
        </div>
    }
    </>)
};


export default Loading;