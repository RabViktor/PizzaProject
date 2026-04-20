import { AdminNav } from "./AdminNav";

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