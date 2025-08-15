import { routes } from "@/routes";

const CancelPage = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <div className="relative w-40 h-40 bg-secondary-100 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <svg
                    className="w-20 h-20 text-secondary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
            </div>

            <h1 className="text-4xl font-bold text-primary-900 mb-4">Pago Cancelado</h1>
            <p className="text-lg text-primary-800 max-w-md">
                El proceso de pago fue interrumpido. No te preocupes, no se ha realizado ningún cargo a tu tarjeta.
            </p>

            <a
                className="mt-6 px-4 py-2 bg-primary-600 text-secondary-50 w-20 rounded hover:bg-primary-400"
                href={routes.home}
            >
                Salir
            </a>
        </div>
    );
}
export default CancelPage;