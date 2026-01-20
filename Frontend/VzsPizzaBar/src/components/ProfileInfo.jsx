import { useState } from 'react'
import './ProfileInfo.css'
import { useEffect } from 'react'
import { useCart } from '../context/CartContext'

export function ProfileInfo(){

    const [activeBtn, setActiveBtn] = useState(false)
    const [error, setError] = useState(null)

    const { showToast } = useCart()

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        postcode: "",
        city: "",
        roadnum: ""
    });


    const fields = [
        {key: "name", label: "Név", editable: true },
        {key: "email", label: "E-mail", editable: false},
        {key: "phone", label: "Tel.szám" , editable: true},
        {key: "postcode", label: "Irányító sz." , editable: true},
        {key: "city", label: "Település" , editable: true},
        {key: "roadnum", label: "Utca / házszám" , editable: true}
    ]


    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/profile/me", {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!res.ok) {
                setError("Nem sikerült betölteni a profilt")
                return
            }

                const data = await res.json()
                setProfile(data)
            } catch (err) {
                setError(err.message)
            }
        };

        loadProfile()
    }, [])



    const saveProfile = async () => {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("http://localhost:5000/api/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
            },
                body: JSON.stringify(profile)
            })

            if (!res.ok) {
                setError("Nem sikerült a profil frissítése")
            return;
            }

            const data = await res.json()

            setActiveBtn(false)
            showToast('Sikeres mentés')

        } catch (err) {
            setError(err.message)
        }

    }


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
                            {fields.map(a => (
                                <div className="data" key={a.key}>
                                    <h3>{a.label}:</h3>
                                    {activeBtn && a.editable ? (
                                        <input className='profile-input' type="text"
                                            value={profile[a.key] || ""}
                                            onChange={e => {
                                                setProfile({...profile, [a.key]: e.target.value})
                                            }}    
                                        />
                                    ): (
                                        <h3>{profile[a.key]}</h3>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
                <div id="save-div">
                    <button onClick={saveProfile} disabled={!activeBtn}>Mentés</button>
                </div>
                
            </div>
            <div id="profile-del">
                <button>Fiók törlése</button>
            </div>
        </>
    )
}