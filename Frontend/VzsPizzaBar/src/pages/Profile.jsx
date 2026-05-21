import { ProfileInfo } from "../components/ProfileInfo"
import {Orders} from "../components/Orders"
import "./Profile.css"
import { useState } from "react"

export function Profile(){

    const [activeTab, setActiveTab] = useState("profile")

    return(
        <>
            <div id="pmenu-div">
                <button 
                    onClick={() => setActiveTab("profile")}
                    className={activeTab === "profile" ? 'active' : ''}
                >
                    Profilom
                </button>

                <button 
                    onClick={() => setActiveTab("orders")}
                    className={activeTab === "orders" ? 'active' : ''}
                >
                    Rendeléseim
                </button>
            </div>

            <div id="profile-div">
                {activeTab === "profile" && <ProfileInfo/>}
                {activeTab === "orders" && <Orders/>}
            </div>
        </>
    )
}
