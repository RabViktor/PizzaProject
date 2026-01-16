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
                <div id="profile-card">

                </div>
            </div>
        </>
    )

}