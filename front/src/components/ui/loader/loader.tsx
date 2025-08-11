// import Reack from "react"
import styles from "./loader.module.css";

const Loader = ({minHeight= "auto"}) => {
    return (
        <div className="flex px-2 items-center justify-center" style={{minHeight}}>
        <div className={styles.loader}></div>
        </div>
    )
}
export default Loader