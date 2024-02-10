export const Nutrition = ({ label, quantity, unit }) => {
    return (
        <div>
            <p><b><span>{label}</span></b> - {quantity} {unit}<hr></hr></p>
        </div>
    )
}
