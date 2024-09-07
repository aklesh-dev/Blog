import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
    const { theme } = useSelector(state => state.theme);

    return (
        <section className={theme}>
            <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(14,21,40)] min-h-screen">
                {children}
            </div>
        </section>
    )
}
