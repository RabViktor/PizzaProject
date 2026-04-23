import { AdminNav } from "./AdminNav";
import "./AdminLayout.css"

export function AdminLayout({children}) {
    return(
        <div className="admin-layout">
            <AdminNav/>
            <main className="admin-content">
                {children}
            </main>
        </div>
    )
}