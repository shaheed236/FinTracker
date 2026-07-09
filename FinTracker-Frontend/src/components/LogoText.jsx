export default function LogoText({ className = "" }) {
    return (
        <span className={`font-bold text-blue-600 ${className}`}>
            Fin
            <span className="inline-block text-[#ffb700] animate-swapRight">T</span>
            <span className="inline-block text-[#ffb700] animate-swapLeft">r</span>
            <span className="text-[#ffb700]">acker</span>
        </span>
    );
}
