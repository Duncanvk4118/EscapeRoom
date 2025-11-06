import {QRScanner} from "../Components/QRScanner";

export const Scanner = () => {
    return (
        <div className={"flex flex-col gap-4 items-center justify-center w-full min-h-[100vh]"}>
            <div className="flex flex-col items-center max-w-screen-xl gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 bg-gray-700 text-gray-100">
                <span className={"text-3xl font-bold"}>Scan QR code</span>
                <QRScanner />
            </div>
        </div>
    )
}
