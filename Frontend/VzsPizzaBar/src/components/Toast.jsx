import './Toast.css'

export function Toast({ message }) {
    return (
        <div className="toast">
            {message}
        </div>
    );
}
