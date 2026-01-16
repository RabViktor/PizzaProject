import { useState } from 'react'
import './ProfileInfo.css'

export function ProfileInfo(){

    const [activeBtn, setActiveBtn] = useState(false)

    return(
        <>
            <div id="profile-info-card">
                <div id="profile-header">
                    <div id='profile-and-img'>
                        <h2>Profilom</h2>
                        <img onClick={() => setActiveBtn(!activeBtn)} src="/pencil.jpg" alt='szerk.' />
                    </div>
                    
                    <div id="profile-line"></div>
                </div>
                <div id="data-div">
                    <div id="profile-datas">
                        <div className='data'>
                            <h3>Név: </h3>
                            {activeBtn && <input type="text" />}
                            {!activeBtn && <h3>Szűcs Zsombor</h3>}
                            
                        </div>
                        <div className='data'>
                            <h3>E-mail: </h3>
                            {activeBtn && <input type="text" />}
                            {!activeBtn && <h3>example@email.com</h3>}
                        </div>
                    </div>
                </div>
                <div id="save-div">
                    <button disabled={!activeBtn}>Mentés</button>
                </div>
                
            </div>
            <div id="profile-del">
                <button>Fiók törlése</button>
            </div>
        </>
    )
}